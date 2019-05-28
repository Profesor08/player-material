import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Tracks, { Track } from "../lib/Tracks";
import {
  TracksState,
  PlayerState,
  setTracksAction,
  togglePlaylistAction,
  setTrackAction,
} from "../store";

import TrackImages from "./TrackImages";
import PlayerControls from "./PlayerControls";
import TrackInfo from "./TrackInfo";
import Playlist from "./Playlist";
import Progress from "./Progress";
import AudioPlayer from "./AudioPlayer";
import SidebarButton from "./SidebarButton";
import Sidebar from "./Sidebar";

interface PlayerDispatchToProps {
  loadTracks: () => void;
  togglePlaylist: (state: boolean) => void;
  setTrack: (track: Track) => void;
}

type PlayerStateProps = TracksState & PlayerState;

type PlayerProps = PlayerStateProps & PlayerDispatchToProps;

class Player extends Component<PlayerProps> {
  componentDidMount = async () => {
    await this.props.loadTracks();
  };

  componentDidUpdate = () => {
    if (!this.props.track && this.props.tracks.length > 0) {
      this.props.setTrack(this.props.tracks[0]);
    }
  };

  render = () => {
    let className = "player";

    if (this.props.playlistActive) {
      className += " playlist-active";
    }

    return (
      <div className={className}>
        <SidebarButton />
        <Sidebar />
        <TrackImages />
        <TrackInfo />
        <Progress />
        <AudioPlayer />
        <PlayerControls />
        <Playlist />
      </div>
    );
  };
}

interface State {
  player: PlayerState;
  tracks: TracksState;
}

const mapStateToProps = (state: State): PlayerStateProps => {
  return {
    ...state.player,
    ...state.tracks,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): PlayerDispatchToProps => {
  return {
    loadTracks: async (): Promise<void> => {
      if (process.env.REACT_APP_PRODUCTION === "true") {
        dispatch(
          setTracksAction(
            await Tracks.profileLikes(
              `https://soundcloud.com/profesor08`,
              tracks => {
                dispatch(setTracksAction(tracks));
              },
            ),
          ),
        );
      } else {
        dispatch(setTracksAction(await Tracks.demo()));
      }
    },

    togglePlaylist: (state: boolean) => {
      dispatch(togglePlaylistAction(state));
    },

    setTrack: (track: Track): void => {
      dispatch(setTrackAction(track));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Player);
