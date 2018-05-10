// @flow
import * as React from "react";
import type { GameState, MapConfig, Order } from "../flowtypes";
import { GameStateContext } from "../game-state-context";
import Game from "./Game";
import Board from "./Board";
import "./Game.css";


type Props = {
  // map: MapConfig,
  // initial: TurnState
};

type State = {
  game: GameState,
  map: MapConfig,
  turns: Array<GameState>,
  currentTurn: ?number
};

const map: MapConfig = require("../tmp/standard.json");
const game: GameState = require("../tmp/game.json");

class SandboxGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      game: game.state,
      map,
      turns: [game],
      currentTurn: 0
    };

    this.updateOrder = this.updateOrder.bind(this);
    this.clickProvince = this.clickProvince.bind(this);
  }

  updateOrder = (order:*, newData:*) => {};
  clickProvince = (id:string, withCtrl:boolean, withShift:boolean) => {};

  render() {
    return (
      <Game state={this.state.game} map={this.state.map} updateOrder={this.updateOrder} clickProvince={this.clickProvince}>
        <div className="game">
          <div className="game__head">
            <div>diplo++</div>
            <div className="game__title">Spring 1901</div>
          </div>
          <div className="game__board">
            <Board map={this.state.map} game={this.state.game}/>
          </div>
          <div className="game__side">
            Orders Panel
          </div>
        </div>
      </Game>
    );
    // const state = this.state.turns[this.state.currentTurn];

    // return (
    //   <Game state={state} map={this.props.map}/>
    //   <div className="game">
    //     <div className="game__head">
    //       <div>diplo++</div>
    //       <div className="game__title">Spring 1901</div>
    //       <div className="game__sidelink">Orders</div>
    //       <div className="game__sidelink">Messages</div>
    //       <div className="game__sidelink">History</div>
    //     </div>
    //     <div className="game__board">
    //       <div
    //         className="game__map"
    //         style={{
    //           width: this.props.map.width + "px",
    //           height: this.props.map.height + "px"
    //         }}
    //       >
    //         <Board
    //           zoom={1}
    //           size={{
    //             width: this.props.map.width,
    //             height: this.props.map.height
    //           }}
    //           provinces={provinces}
    //         />
    //         {units.map(u => {
    //           return (
    //             <div
    //               key={u.id}
    //               style={{
    //                 left: `${u.point[0]}px`,
    //                 top: `${u.point[1]}px`,
    //                 color: u.color
    //               }}
    //               className="game__unit"
    //             >
    //               {u.icon}
    //             </div>
    //           );
    //         })}
    //       </div>
    //       <div className="game__minimap">minimap</div>
    //       <div className="game__unit-info">Unit Info Panel</div>
    //     </div>
    //     <div className="game__side">
    //       <OrdersPanel/>
    //     </div>
    // );
  }
}

export default SandboxGame;
