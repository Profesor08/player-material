import { createStore, combineReducers } from "redux";
import { Track } from "../lib/Tracks";

const PLAY_ACTION = "PLAY_ACTION";
const SHUFFLE_ACTION = "SHUFFLE_ACTION";
const REPEAT_ACTION = "REPEAT_ACTION";
const SET_TRACKS_ACTION = "SET_TRACKS_ACTION";
const SET_TRACK_ACTION = "SET_TRACK_ACTION";
const TOGGLE_PLAYLIST_ACTION = "TOGGLE_PLAYLIST_ACTION";
const SET_PROGRESS = "SET_PROGRESS";
const SET_AUDIO_PROGRESS_UPDATE_STATE = "SET_AUDIO_PROGRESS_UPDATE_STATE";
const TOGGLE_SIDEBAR_ACTION = "TOGGLE_SIDEBAR_ACTION";
const SET_VOLUME_ACTION = "SET_VOLUME_ACTION";

export interface PlayerState {
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  paused: boolean;
  track: Track | null;
  playlistActive: boolean;
  audioPlayerProgressNeedsUpdate: boolean;
}

export interface TracksState {
  tracks: Track[];
}

export interface SidebarState {
  sidebarActive: boolean;
}

export interface ProgressState {
  progress: number;
}

export interface PlayToggleAction {
  type: "PLAY_ACTION";
  state: boolean;
}

export interface ShuffleToggleAction {
  type: "SHUFFLE_ACTION";
  state: boolean;
}

export interface RepeatToggleAction {
  type: "REPEAT_ACTION";
  state: boolean;
}

export interface SetTracksAction {
  type: "SET_TRACKS_ACTION";
  tracks: Track[];
}

export interface SetTrackAction {
  type: "SET_TRACK_ACTION";
  track: Track;
}

export interface TogglePlaylistAction {
  type: "TOGGLE_PLAYLIST_ACTION";
  state: boolean;
}

export interface SetProgressAction {
  type: "SET_PROGRESS";
  progress: number;
}

export interface SetAudioPlayerProgressNeedsUpdateAction {
  type: "SET_AUDIO_PROGRESS_UPDATE_STATE";
  state: boolean;
}

export interface ToggleSidebarAction {
  type: "TOGGLE_SIDEBAR_ACTION";
  state: boolean;
}

export interface SetVolumeAction {
  type: "SET_VOLUME_ACTION";
  volume: number;
}

type PlayerAction =
  | PlayToggleAction
  | ShuffleToggleAction
  | RepeatToggleAction
  | SetTrackAction
  | TogglePlaylistAction
  | SetAudioPlayerProgressNeedsUpdateAction
  | SetVolumeAction;

type TracksAction = SetTracksAction;

type ProgressAction = SetProgressAction;

type SidebarAction = ToggleSidebarAction;

export function playToggleAction(state: boolean): PlayToggleAction {
  return {
    type: PLAY_ACTION,
    state: state,
  };
}

export function shuffleToggleAction(state: boolean): ShuffleToggleAction {
  return {
    type: SHUFFLE_ACTION,
    state: state,
  };
}

export function repeatToggleAction(state: boolean): RepeatToggleAction {
  return {
    type: REPEAT_ACTION,
    state: state,
  };
}

export function setTrackAction(track: Track): SetTrackAction {
  return {
    type: SET_TRACK_ACTION,
    track: track,
  };
}

export function setTracksAction(tracks: Track[]): SetTracksAction {
  return {
    type: SET_TRACKS_ACTION,
    tracks: tracks,
  };
}

export function togglePlaylistAction(state: boolean): TogglePlaylistAction {
  return {
    type: TOGGLE_PLAYLIST_ACTION,
    state: state,
  };
}

export function setProgressAction(progress: number): SetProgressAction {
  return {
    type: SET_PROGRESS,
    progress: progress,
  };
}

export function setAudioPlayerProgressNeedsUpdateAction(
  state: boolean,
): SetAudioPlayerProgressNeedsUpdateAction {
  return {
    type: SET_AUDIO_PROGRESS_UPDATE_STATE,
    state: state,
  };
}

export function toggleSidebarAction(state: boolean): ToggleSidebarAction {
  return {
    type: TOGGLE_SIDEBAR_ACTION,
    state: state,
  };
}

export function setVolumeAction(volume: number): SetVolumeAction {
  return {
    type: SET_VOLUME_ACTION,
    volume: volume,
  };
}

const initialPlayerState: PlayerState = {
  volume: 0.2,
  shuffle: false,
  repeat: false,
  paused: true,
  track: null,
  playlistActive: false,
  audioPlayerProgressNeedsUpdate: true,
};

const initialTracksState: TracksState = {
  tracks: [],
};

const initialProgressState: ProgressState = {
  progress: 0,
};

const initialSidebarState: SidebarState = {
  sidebarActive: true,
};

try {
  const json = localStorage.getItem("playerConfiguration");

  if (json) {
    const config: PlayerState = JSON.parse(json);

    initialPlayerState.shuffle = config.shuffle;
    initialPlayerState.repeat = config.repeat;
  }
} catch (err) {}

function player(
  state: PlayerState = initialPlayerState,
  action: PlayerAction,
): PlayerState {
  switch (action.type) {
    case PLAY_ACTION: {
      return {
        ...state,
        paused: action.state,
      };
    }

    case SHUFFLE_ACTION: {
      return {
        ...state,
        shuffle: action.state,
      };
    }

    case REPEAT_ACTION: {
      return {
        ...state,
        repeat: action.state,
      };
    }

    case SET_TRACK_ACTION: {
      return {
        ...state,
        track: action.track,
      };
    }

    case TOGGLE_PLAYLIST_ACTION: {
      return {
        ...state,
        playlistActive: action.state,
      };
    }

    case SET_AUDIO_PROGRESS_UPDATE_STATE: {
      return {
        ...state,
        audioPlayerProgressNeedsUpdate: action.state,
      };
    }

    case SET_VOLUME_ACTION: {
      return {
        ...state,
        volume: action.volume,
      };
    }
  }

  return state;
}

function tracks(state: TracksState = initialTracksState, action: TracksAction) {
  switch (action.type) {
    case SET_TRACKS_ACTION: {
      return {
        ...state,
        tracks: action.tracks,
      };
    }
  }

  return state;
}

function progress(
  state: ProgressState = initialProgressState,
  action: ProgressAction,
) {
  switch (action.type) {
    case SET_PROGRESS: {
      return {
        ...state,
        progress: action.progress,
      };
    }
  }

  return state;
}

function sidebar(
  state: SidebarState = initialSidebarState,
  action: SidebarAction,
) {
  switch (action.type) {
    case TOGGLE_SIDEBAR_ACTION: {
      return {
        ...state,
        sidebarActive: action.state,
      };
    }
  }

  return state;
}

const store = createStore(
  combineReducers({
    player,
    tracks,
    progress,
    sidebar,
  }),
);

export default store;
