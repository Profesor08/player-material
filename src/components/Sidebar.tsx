import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  PlayerState,
  SidebarState,
  toggleSidebarAction,
  setVolumeAction,
} from "../store";
import VolumeMute from "@material-ui/icons/VolumeMute";
import VolumeUp from "@material-ui/icons/VolumeUp";
import InputRange from "./InputRange";
import PlayerControl from "./PlayerControl";
import throttle from "lodash/throttle";

interface SidebarDispatchProps {
  toggleSidebar: (state: boolean) => void;
  setVolume: (volume: number) => void;
}

interface SidebarStateProps {
  sidebarActive: boolean;
  volume: number;
}

type SidebarProps = SidebarDispatchProps & SidebarStateProps;

class Sidebar extends Component<SidebarProps> {
  updateVolume = throttle((volume: number) => {
    this.props.setVolume(volume);
  }, 20);

  render = () => {
    let className = "sidebar";
    let volumeClassName = "volume";

    if (this.props.sidebarActive) {
      className += " is-active";
    }

    if (this.props.volume === 0) {
      volumeClassName += " is-muted";
    }

    return (
      <div className={className}>
        <div
          className="sidebar-back"
          onClick={() => {
            this.props.toggleSidebar(false);
          }}
        />
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="profile">
              <img
                className="profile-image"
                src="/icon-128.png"
                alt=""
                width="64"
                height="64"
              />
              <div className="profile-info">
                <div className="profile-name">Prof</div>
                <div className="profile-email">online7890@gmail.com</div>
              </div>
            </div>
          </div>
          <div className="sidebar-controls">
            <div className={volumeClassName}>
              <PlayerControl
                className="volume-button"
                action={() => {
                  this.props.setVolume(0);
                }}
                ripple={true}
              >
                <VolumeUp className="volume-icon volume-up" />
                <VolumeMute className="volume-icon volume-mute" />
              </PlayerControl>
              <InputRange
                min={0}
                max={1}
                step={0.01}
                value={this.props.volume}
                onChange={volume => this.updateVolume(volume)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
}

interface State {
  sidebar: SidebarState;
  player: PlayerState;
}

const mapStateProps = (state: State): SidebarStateProps => {
  return {
    sidebarActive: state.sidebar.sidebarActive,
    volume: state.player.volume,
  };
};

const mapDispatchProps = (dispatch: Dispatch): SidebarDispatchProps => {
  return {
    toggleSidebar: (state: boolean): void => {
      dispatch(toggleSidebarAction(state));
    },
    setVolume: (volume: number): void => {
      dispatch(setVolumeAction(volume));
    },
  };
};

export default connect(
  mapStateProps,
  mapDispatchProps,
)(Sidebar);
