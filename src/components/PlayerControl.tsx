import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";

interface PlayerControlProps {
  children?: React.ReactNode;
  className?: string;
  action?: () => void;
  active?: boolean;
  ripple?: boolean;
}

interface PlayerControlState {
  animated: boolean;
}

export default class PlayerControl extends Component<
  PlayerControlProps,
  PlayerControlState
> {
  static defaultProps = {
    ripple: true,
  };

  constructor(props: PlayerControlProps, state: PlayerControlState) {
    super(props, state);

    this.state = {
      animated: false,
    };
  }

  render = () => {
    let className = "control";

    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    if (this.props.active) {
      className += ` is-active`;
    }

    let ripple: React.ReactNode = "";

    if (this.props.ripple) {
      ripple = (
        <CSSTransition
          in={this.state.animated}
          classNames="ripple"
          timeout={300}
          onEntered={() => {
            this.setState({
              animated: false,
            });
          }}
        >
          <div className="ripple" />
        </CSSTransition>
      );
    }

    return (
      <div
        className={className}
        onMouseDownCapture={(e: React.MouseEvent | React.TouchEvent) => {
          e.preventDefault();

          this.setState({
            animated: true,
          });
        }}
        onTouchStartCapture={(e: React.MouseEvent | React.TouchEvent) => {
          e.preventDefault();

          this.setState({
            animated: true,
          });
        }}
        onMouseUpCapture={(e: React.MouseEvent | React.TouchEvent) => {
          e.preventDefault();

          if (this.props.action) {
            this.props.action();
          }
        }}
        onTouchEndCapture={(e: React.MouseEvent | React.TouchEvent) => {
          e.preventDefault();

          if (this.props.action) {
            this.props.action();
          }
        }}
      >
        {ripple}
        {this.props.children}
      </div>
    );
  };
}
