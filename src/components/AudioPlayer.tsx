import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  PlayerState,
  ProgressState,
  TracksState,
  setTrackAction,
  setProgressAction,
  setAudioPlayerProgressNeedsUpdateAction,
} from "../store";
import throttle from "lodash/throttle";
import { Track, next } from "../lib/Tracks";

interface AudioPlayerDispatchProps {
  updateProgress: (progress: number) => void;
  audioProgressUpdated: () => void;
  setTrack: (track: Track) => void;
}

type AudioPlayerStateProps = PlayerState & ProgressState & TracksState;

type AudioPlayerProps = AudioPlayerDispatchProps & AudioPlayerStateProps;

interface AudioPlayerState {
  canplay: boolean;
}

class AudioPlayer extends Component<AudioPlayerProps, AudioPlayerState> {
  audio: HTMLAudioElement | null;

  constructor(props: AudioPlayerProps, state: AudioPlayerState) {
    super(props, state);

    this.audio = null;

    this.state = {
      canplay: false,
    };
  }

  componentDidMount = () => {
    if (this.audio) {
      this.audio.addEventListener("error", (err: ErrorEvent) => {
        if (this.audio && this.props.track) {
          this.audio.src = this.props.track.stream_url;
        }
      });

      this.audio.addEventListener("canplay", () => {
        this.setState({
          canplay: true,
        });
      });

      this.audio.addEventListener("loadstart", () => {
        this.setState({
          canplay: false,
        });
      });

      this.audio.addEventListener(
        "timeupdate",
        throttle(() => {
          if (this.audio) {
            this.props.updateProgress(this.audio.currentTime * 1000);
          }
        }, 16),
      );

      this.audio.addEventListener("ended", () => {
        if (!this.props.repeat) {
          const track = next(
            this.props.tracks,
            this.props.track,
            this.props.shuffle,
          );

          if (track) {
            this.props.setTrack(track);
          }
        } else {
          if (this.props.track) {
            this.props.setTrack(this.props.track);
          }
        }
      });
    }
  };

  componentDidUpdate = async (prevProps: AudioPlayerProps) => {
    if (this.props.track && this.audio) {
      if (prevProps.track !== this.props.track) {
        this.audio.src = this.props.track.stream_url;
      }

      this.audio.loop = this.props.repeat;

      this.audio.volume = this.props.volume;

      if (this.props.audioPlayerProgressNeedsUpdate) {
        if (prevProps.progress !== this.props.progress) {
          this.audio.currentTime = this.props.progress / 1000;
        }

        this.props.audioProgressUpdated();
      }

      if (this.state.canplay) {
        if (this.props.paused) {
          await this.audio.pause();
        } else {
          try {
            await this.audio.play();
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  };

  render = () => {
    return (
      <audio
        ref={ref => {
          this.audio = ref;
        }}
        style={{ display: "none" }}
      />
    );
  };
}

interface State {
  player: PlayerState;
  progress: ProgressState;
  tracks: TracksState;
}

const mapStateProps = (state: State): AudioPlayerStateProps => {
  return {
    ...state.player,
    ...state.progress,
    ...state.tracks,
  };
};

const mapDispatchProps = (dispatch: Dispatch): AudioPlayerDispatchProps => {
  return {
    updateProgress: (progress: number): void => {
      dispatch(setProgressAction(progress));
    },

    audioProgressUpdated: (): void => {
      dispatch(setAudioPlayerProgressNeedsUpdateAction(false));
    },

    setTrack: (track: Track): void => {
      dispatch(setTrackAction(track));
    },
  };
};

export default connect(
  mapStateProps,
  mapDispatchProps,
)(AudioPlayer);
