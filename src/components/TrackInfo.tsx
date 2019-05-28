import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { PlayerState, togglePlaylistAction } from "../store";
import Utils from "../lib/Utils";

interface TrackInfoDispatchProps {
  togglePlaylist: (state: boolean) => void;
}

interface TrackInfoControlsOptionsProps {}

interface TrackShortInfo {
  title: string;
  user: string;
  duration: number;
}

type TrackInfoProps = PlayerState &
  TrackInfoDispatchProps &
  TrackInfoControlsOptionsProps;

class TrackInfo extends Component<TrackInfoProps> {
  render = () => {
    const track: TrackShortInfo = {
      title: this.props.track ? this.props.track.title : "No Track",
      user: this.props.track ? this.props.track.user.username : "No User",
      duration: this.props.track ? this.props.track.duration : 0,
    };

    return (
      <div
        className="track-info"
        onClick={() => {
          this.props.togglePlaylist(!this.props.playlistActive);
        }}
      >
        <div className="visualization-waves">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>
        <div className="track-title">{track.title}</div>
        <div className="track-user">{track.user}</div>
        <div className="track-time">
          <div className="current-time">0:00</div>
          <div className="separator">/</div>
          <div className="current-duration">
            {Utils.formatTimestamp(track.duration)}
          </div>
        </div>
      </div>
    );
  };
}

interface State {
  player: PlayerState;
}

const mapStateProps = (state: State): PlayerState => {
  return {
    ...state.player,
  };
};

const mapDispatchProps = (dispatch: Dispatch): TrackInfoDispatchProps => {
  return {
    togglePlaylist: (state: boolean) => {
      dispatch(togglePlaylistAction(state));
    },
  };
};

export default connect(
  mapStateProps,
  mapDispatchProps,
)(TrackInfo);
