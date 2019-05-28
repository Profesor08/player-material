import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import PlayerControl from "./PlayerControl";
import Shuffle from "@material-ui/icons/Shuffle";
import SkipPrevious from "@material-ui/icons/SkipPrevious";
import SkipNext from "@material-ui/icons/SkipNext";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import Repeat from "@material-ui/icons/Repeat";
import RepeatOne from "@material-ui/icons/RepeatOne";
import {
  PlayerState,
  TracksState,
  playToggleAction,
  shuffleToggleAction,
  repeatToggleAction,
  setTrackAction,
} from "../store";
import { Track, next, prev } from "../lib/Tracks";

interface PlayerControlsDispatchToProps {
  togglePlay: (state: boolean) => void;
  toggleShuffle: (state: boolean) => void;
  toggleRepeat: (state: boolean) => void;
  setTrack: (track: Track) => void;
}

type PlayerControlsStateProps = PlayerState & TracksState;

type PlayerControlsProps = PlayerControlsStateProps &
  PlayerControlsDispatchToProps;

class PlayerControls extends Component<PlayerControlsProps> {
  playToggle = () => {
    this.props.togglePlay(!this.props.paused);
  };

  shuffleToggle = () => {
    this.props.toggleShuffle(!this.props.shuffle);
  };

  repeatToggle = () => {
    this.props.toggleRepeat(!this.props.repeat);
  };

  prevTrack = () => {
    const track = prev(this.props.tracks, this.props.track, this.props.shuffle);

    if (track) {
      this.props.setTrack(track);
    }
  };

  nextTrack = () => {
    const track = next(this.props.tracks, this.props.track, this.props.shuffle);

    if (track) {
      this.props.setTrack(track);
    }
  };

  componentDidUpdate = (prevProps: PlayerControlsProps) => {
    if (prevProps.track === this.props.track) {
      return;
    }
  };

  render = () => {
    const classNames = {
      shuffle: `control control-shuffle`,
      prev: `control control-prev`,
      play: `control control-play`,
      next: `control control-next`,
      repeat: `control control-repeat`,
    };

    classNames.play += !this.props.paused ? " is-active" : "";
    classNames.shuffle += this.props.shuffle ? " is-active" : "";
    classNames.repeat += this.props.repeat ? " is-active" : "";

    return (
      <div className="player-controls">
        <PlayerControl
          className="control-shuffle"
          active={this.props.shuffle}
          action={() => {
            this.shuffleToggle();
          }}
        >
          <Shuffle className="control-icon icon-shuffle" />
        </PlayerControl>

        <PlayerControl
          className={classNames.prev}
          action={() => {
            this.prevTrack();
          }}
        >
          <SkipPrevious className="control-icon icon-prev" />
        </PlayerControl>

        <PlayerControl
          className="control-play"
          active={!this.props.paused}
          action={() => {
            this.playToggle();
          }}
          ripple={false}
        >
          <PlayArrow className="control-icon icon-play" />
          <Pause className="control-icon icon-pause" />
        </PlayerControl>

        <PlayerControl
          className={classNames.next}
          action={() => {
            this.nextTrack();
          }}
        >
          <SkipNext className="control-icon icon-next" />
        </PlayerControl>

        <PlayerControl
          className="control-repeat"
          active={this.props.repeat}
          action={() => {
            this.repeatToggle();
          }}
        >
          <Repeat className="control-icon icon-repeat-inactive" />
          <RepeatOne className="control-icon icon-repeat-active" />
        </PlayerControl>
      </div>
    );
  };
}

interface State {
  player: PlayerState;
  tracks: TracksState;
}

const mapStateToProps = (state: State): PlayerControlsStateProps => {
  return {
    ...state.player,
    ...state.tracks,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
): PlayerControlsDispatchToProps => {
  return {
    togglePlay: (state: boolean): void => {
      dispatch(playToggleAction(state));
    },

    toggleShuffle: (state: boolean): void => {
      dispatch(shuffleToggleAction(state));
    },

    toggleRepeat: (state: boolean): void => {
      dispatch(repeatToggleAction(state));
    },

    setTrack: (track: Track): void => {
      dispatch(setTrackAction(track));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerControls);
