// @flow

import * as React from "react";
import type { GameState, MapConfig, MapProvinces } from "flowtypes";
import { GameStateContext } from "../game-state-context";

type Props = GameStateContext;
type State = GameStateContext;

class Game extends React.Component<Props, State> {
  state = {
    state: null,
    map: null,
    updateOrder: null
  };

  static getDerivedStateFromProps(nextProps:GameStateContext, prevState:GameStateContext): ?GameStateContext {
    if (nextProps.map === prevState.map && nextProps.state === prevState.state) return null;
    return {
      state: nextProps.state,
      map: nextProps.map,
      updateOrder: nextProps.updateOrder
    };
  }

  render() {
    return (
      <GameStateContext.Provider value={this.state}>
        {this.props.children}
      </GameStateContext.Provider>
    );
  }
}

export default Game;
