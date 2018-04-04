// @flow
import * as React from "react";
import type { GameState } from "flowtypes";
// import "./style.css";

type Props = {
  state: GameState
};

type State = {};

class Game extends React.Component<Props, State> {
  state = {};

  render() {
    return (
      <div class="game">
        <div class="game__head">Header Goes Here</div>
        <div class="game__board">Game Board</div>
        <div class="game__side">Game Sidebar</div>
      </div>
    );
  }
}

export default Game;
