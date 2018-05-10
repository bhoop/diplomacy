// @flow
import * as React from "react";
import type { MapConfig, GameState, MapProvinces } from "flowtypes";
import "./OrderSelect.css";

type Props = {
    value: string,
    placeholder?: string
};

type State = {
};

class OrderSelect extends React.Component<Props, State> {
  state = {
  };

  render() {
    const value = this.props.value === '' ?
        (<div className="order-select__value order-select__value--placeholder">{this.props.placeholder}</div>)
        : (<div className="order-select__value">{this.porps.value}</div>);

    return (
        <div className="order-select">
            {value}
        </div>
    );
  }
}

export default OrderSelect;
