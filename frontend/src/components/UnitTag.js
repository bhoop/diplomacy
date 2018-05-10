// @flow
import * as React from "react";
import type { MapConfig, GameState, MapProvinces } from "flowtypes";
import { withGameState, type GameStateContext } from "../game-state-context";
import "./UnitTag.css";

type Props = {
    unit: string,
    game: GameStateContext
};

type State = {
};

class UnitTag extends React.Component<Props, State> {
  state = {
  };

  render() {
    const [team, type, ...junk] = this.props.unit.split('-');
    const text = type[0].toUpperCase() + ' ' + this.props.game.state.units[this.props.unit];
    console.log(this.props.unit);
    return (<span className="unit-tag" style={{backgroundColor:this.props.game.teams[team].color}}>{text}</span>);
  }
}

export default withGameState(UnitTag);
