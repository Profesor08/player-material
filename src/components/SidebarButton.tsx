import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { SidebarState, toggleSidebarAction } from "../store";
import PlayerControl from "./PlayerControl";

interface SidebarButtonDispatchProps {
  toggleSidebar: (state: boolean) => void;
}

interface SidebarButtonStateProps {
  sidebarActive: boolean;
}

type SidebarButtonProps = SidebarButtonDispatchProps & SidebarButtonStateProps;

class SidebarButton extends Component<SidebarButtonProps> {
  render = () => {
    return (
      <PlayerControl
        className="sidebar-button"
        active={this.props.sidebarActive}
        action={() => {
          this.props.toggleSidebar(!this.props.sidebarActive);
        }}
      >
        <div className="line line-1" />
        <div className="line line-2" />
        <div className="line line-3" />
      </PlayerControl>
    );
  };
}

interface State {
  sidebar: SidebarState;
}

const mapStateProps = (state: State): SidebarButtonStateProps => {
  return {
    sidebarActive: state.sidebar.sidebarActive,
  };
};

const mapDispatchProps = (dispatch: Dispatch): SidebarButtonDispatchProps => {
  return {
    toggleSidebar: (state: boolean): void => {
      dispatch(toggleSidebarAction(state));
    },
  };
};

export default connect(
  mapStateProps,
  mapDispatchProps,
)(SidebarButton);
