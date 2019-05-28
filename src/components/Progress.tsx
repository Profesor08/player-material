import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  PlayerState,
  ProgressState,
  setProgressAction,
  setAudioPlayerProgressNeedsUpdateAction,
} from "../store";
import throttle from "lodash/throttle";
import InputRange from "./InputRange";

type ProgressStateProps = PlayerState & ProgressState;

interface ProgressDispatchProps {
  setProgress: (progress: number) => void;
  audioProgressNeedsUpdate: () => void;
}

type ProgressProps = ProgressStateProps & ProgressDispatchProps;

class Progress extends Component<ProgressProps> {
  updateProgress = throttle((progress: number) => {
    this.props.setProgress(progress);
  }, 20);

  changeStart = (e: React.MouseEvent | React.TouchEvent) => {
    this.setState({
      changing: true,
    });
  };

  changeStop = (e: React.MouseEvent | React.TouchEvent) => {
    const progress = parseInt((e.target as HTMLInputElement).value);

    this.setState({
      changing: false,
    });

    this.updateProgress(progress);
  };

  render = () => {
    const max = this.props.track ? this.props.track.duration : 0;

    return (
      <InputRange
        className="progress"
        min={0}
        max={max}
        step={1}
        value={this.props.progress}
        onEnd={value => this.updateProgress(value)}
      />
    );
  };
}

interface State {
  player: PlayerState;
  progress: ProgressState;
}

const mapStateProps = (state: State): ProgressStateProps => {
  return {
    ...state.player,
    ...state.progress,
  };
};
const mapDispatchProps = (dispatch: Dispatch): ProgressDispatchProps => {
  return {
    setProgress: (progress: number): void => {
      dispatch(setProgressAction(progress));
      dispatch(setAudioPlayerProgressNeedsUpdateAction(true));
    },

    audioProgressNeedsUpdate: (): void => {
      dispatch(setAudioPlayerProgressNeedsUpdateAction(true));
    },
  };
};

export default connect(
  mapStateProps,
  mapDispatchProps,
)(Progress);
