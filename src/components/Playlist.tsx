import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  PlayerState,
  TracksState,
  ProgressState,
  setTrackAction,
  setProgressAction,
  playToggleAction,
} from "../store";
import { Track } from "../lib/Tracks";
import Utils from "../lib/Utils";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";

interface PlaylistStateProps {
  shuffle: boolean;
  repeat: boolean;
  paused: boolean;
  playlistActive: boolean;
  progress: number;
  track: Track | null;
  tracks: Track[];
}

interface PlaylistDispatchProps {
  setTrack: (track: Track) => void;
  togglePLay: (state: boolean) => void;
}

type PlaylistProps = PlaylistStateProps & PlaylistDispatchProps;

class Playlist extends Component<PlaylistProps> {
  playlist: HTMLDivElement | null;

  constructor(props: PlaylistProps) {
    super(props);

    this.playlist = null;
  }

  componentDidUpdate = (prevProps: PlaylistProps) => {
    if (prevProps.track !== this.props.track) {
      this.scrollToTrack();
    }
  };

  playTrack = (track: Track) => {
    if (!this.props.track || this.props.track.id !== track.id) {
      this.props.setTrack(track);
      this.props.togglePLay(false);
    } else {
      this.props.togglePLay(!this.props.paused);
    }
  };

  scrollToTrack = () => {
    if (this.playlist) {
      const id = this.props.tracks.findIndex(
        track => track === this.props.track,
      );
      const trackHeight = 50;
      const top =
        id * trackHeight - this.playlist.offsetHeight / 2 + trackHeight / 2;

      this.playlist.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
  };

  render = () => {
    return (
      <div
        className="playlist"
        ref={ref => {
          this.playlist = ref;
        }}
      >
        <div className="tracks-list">
          {this.props.tracks.map((track, id) => {
            let className: string = "track-item";
            let progressWidth: number = 0;

            if (this.props.track && track.id === this.props.track.id) {
              className += " is-active";

              if (this.props.paused === false) {
                className += " is-playing";
              }

              if (this.props.progress > 0) {
                progressWidth =
                  (this.props.progress / this.props.track.duration) * 100;
              }
            }

            return (
              <div
                className={className}
                key={`track-item-${id}`}
                onClick={() => this.playTrack(track)}
              >
                <div
                  className="track-progress"
                  style={{ width: `${progressWidth}%` }}
                />
                <div className="play-track">
                  <PlayArrow className="play-icon" />
                  <Pause className="pause-icon" />
                </div>
                <div className="track-meta">
                  <div className="track-title">{track.title}</div>
                  <div className="track-user">{track.user.username}</div>
                </div>
                <div className="track-duration">
                  {Utils.formatTimestamp(track.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}

interface State {
  player: PlayerState;
  tracks: TracksState;
  progress: ProgressState;
}

const mapStateProps = (state: State): PlaylistStateProps => {
  return {
    shuffle: state.player.shuffle,
    repeat: state.player.repeat,
    paused: state.player.paused,
    playlistActive: state.player.playlistActive,
    track: state.player.track,
    progress: state.progress.progress,
    tracks: state.tracks.tracks,
  };
};

const mapDispatchProps = (dispatch: Dispatch): PlaylistDispatchProps => {
  return {
    setTrack: (track: Track) => {
      dispatch(setTrackAction(track));
      dispatch(setProgressAction(0));
    },

    togglePLay: (state: boolean) => {
      dispatch(playToggleAction(state));
    },
  };
};

export default connect(
  mapStateProps,
  mapDispatchProps,
)(Playlist);
