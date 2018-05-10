// @flow
import * as React from "react";
import type { GameState, MapConfig, OrderCommand } from "flowtypes";

export type GameStateContextType = {
    map: MapConfig,
    state: GameState,
    updateOrder: (order:Order, newData:Order) => void,
    clickProvince: (id:string, withCtrl:boolean, withShift:boolean) => void
};

// This is the "shared state" that is used by all components that have anything
// to do with rendering game state.
// It is "provided" at the highest level by the Game component, and then
// "consumed" by any nested component within the Game component
// (such as the Board component, which displays the units on the board)
// see https://reactjs.org/docs/context.html for more information
export const GameStateContext = React.createContext({
    state: null,
    map: null,
    clickProvince: (id, withCtrlKey, withShiftKey) => {},
    updateOrder: (order, newData) => {}
}: GameStateContextType);

export const withGameState = Component => (props) => <GameStateContext.Consumer>{gsc => <Component {...props} game={gsc}/>}</GameStateContext.Consumer>
