import React, { Component } from "react";
import { connect } from "react-redux";

type InputRangeProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  className?: string;
  onStart?: (value: number) => void;
  onEnd?: (value: number) => void;
  onChange?: (value: number) => void;
};

interface InputRangeState {
  value: number;
  changing: boolean;
}

class InputRange extends Component<InputRangeProps, InputRangeState> {
  inputValue: number;
  trackWidth: number;

  constructor(props: InputRangeProps, state: InputRangeState) {
    super(props, state);
    this.inputValue = 0;
    this.trackWidth = 0;

    this.state = {
      value: this.props.value,
      changing: false,
    };
  }

  changeStart = (e: React.MouseEvent | React.TouchEvent) => {
    this.setState({
      value: this.props.value,
      changing: true,
    });

    if (this.props.onStart) {
      this.props.onStart(this.state.value);
    }
  };

  changeStop = (e: React.MouseEvent | React.TouchEvent) => {
    this.setState({
      changing: false,
    });

    if (this.props.onEnd) {
      this.props.onEnd(this.state.value);
    }
  };

  render = () => {
    let inputValue = this.props.value;

    if (this.state.changing) {
      inputValue = this.state.value;
    }

    const trackWidth = (inputValue / this.props.max) * 100;

    let className = "input-range";

    if (this.props.className) {
      className += " " + this.props.className;
    }

    return (
      <div className={className}>
        <div className="input-range-bar">
          <div
            className="input-range-track"
            style={{ width: `${trackWidth}%` }}
          />
        </div>
        <input
          className="input-element"
          type="range"
          value={inputValue}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          onChange={e => {
            const value = parseFloat(e.target.value);

            this.setState({
              value,
            });

            if (this.props.onChange) {
              this.props.onChange(value);
            }
          }}
          onMouseDownCapture={e => {
            this.changeStart(e);
          }}
          onTouchStartCapture={e => {
            this.changeStart(e);
          }}
          onMouseUpCapture={e => {
            this.changeStop(e);
          }}
          onTouchEndCapture={e => {
            this.changeStop(e);
          }}
        />
      </div>
    );
  };
}

export default connect()(InputRange);
