// @flow
import * as React from "react";
import type { MapConfig, GameState, MapProvinces } from "flowtypes";
import OrderSelect from "./OrderSelect";
import UnitTag from "./UnitTag";
import { withGameState, type GameStateContext } from "../game-state-context";
import "./OrdersPanel.css";

type Props = {
    game: GameStateContext
};

type State = {
};

function CommandOrderForm({order}) {
    let showTarget = false, showTargetCommand = false, showDestination = false;
    /*
            <OrderSelect value={<span className="unit-tag">F ORT</span>}/>
            <div className="order-select">
                move to
            </div>
            <div className="order-select">
                <span className="province-tag">Kuq</span></div>
            </div>
    */
    return (
        <div className="order-form">
            <UnitTag unit={order.unit}/>
            <OrderSelect value={order.command} placeholder="do what?"/>
        </div>
    );
}

class OrdersPanel extends React.Component<Props, State> {
  state = {
  };

  render() {
    return (
        <div className="orders-panel">
            {this.props.game.state.orders.map(o => {
                switch (o.type) {
                    case "command":
                    return <CommandOrderForm order={o}/>;
                    case "build":

                    case "retreat":
                }
                return null;
            })}
        </div>
    );
  }
}

export default withGameState(OrdersPanel);
