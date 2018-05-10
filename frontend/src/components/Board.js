// @flow
import * as React from "react";
import blender from "color-blend";
import ResizeObserver from 'resize-observer-polyfill';
import Game from "./Game";
import { isSameProvince } from "../utils";
import { withGameState, type GameStateContext } from "../game-state-context";
import type { MapConfig, GameState, MapProvinces, Order, OrderCommand } from "flowtypes";
import "./Board.css";

type Props = {
  game: GameState,
  map: MapConfig,
  containerWidth: number,
  containerHeight: number
};

type State = {
  view: {width:number, height:number}
};

type KeyEvent = {
  key: string
};

class Board extends React.Component<Props, State> {
  viewport = null;
  ro = null;

  constructor(props:Props) {
    super(props);
    this.state = { view:{width:-1, height:-1} };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.viewport = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, false);
    document.addEventListener("keyup", this.onKeyUp, false);
    this.ro = new ResizeObserver((entries, observer) => {
      const { width, height } = entries[0].contentRect;
      this.setState({view:{width, height}});
    });
    this.ro.observe(this.viewport.current);
  }

  componentWillUnmount() {
    // this.clearPendingOrder();
    document.removeEventListener("keydown", this.onKeyDown, false);
    document.removeEventListener("keyup", this.onKeyUp, false);
    this.ro.disconnect();
    this.ro = null;
  }

  onKeyDown = (e:KeyEvent): void => {
    switch (e.key) {
      // case "Control": return this.setState({ctrlKeyDown:true});
      // case "Shift": return this.setState({shiftKeyDown:true});
      // case "Escape": return this.clearPendingOrder();
    }
  }

  onKeyUp = (e:KeyEvent): void => {
    switch (e.key) {
      // case "Control": return this.setState({ctrlKeyDown:false});
      // case "Shift": return this.setState({shiftKeyDown:false});
    }
  }

  clickProvince(clickedProvinceId: string, modifierKey:string): void {
  }

  render() {
    const { map, game } = this.props;
    const { view } = this.state;
    console.log(game);


    // const { provinces, size, zoom, ...other } = this.props;
    // // shade territories that are occupied by a unit (or owned by a team)
    // let occupiedBy = {};
    // for (let uid in this.props.game.units) {
    //   const [team, type, idx] = uid.split("-");
    //   const [territory, coast] = this.props.game.units[uid].split(/ /);
    //   occupiedBy[territory] = this.state.teams[team].color;
    // }

    // figure out the scale to render the board at that allows it to fit completely in the available space
    // map.width, map.height is the "native" size
    // view.width, view.height is the size of the available viewport
    const scale = Math.min(view.width / map.width, view.height / map.height);
    const css = {
      width: map.width + 'px',
      height: map.height + 'px',
      transform: `translate3d(-50%, -50%, 0) scale(${scale})`
    };

    // prepare the list of units to draw on the map
    let spawns = {}, colors = {}, units=[];
    map.provinces.forEach(t => spawns[t.id] = t.spawnCoord);
    map.teams.forEach(t => colors[t.id] = t.color);
    for (let uid in game.units) {
      const [team, type, origin, num] = uid.split("-");
      units.push({
        id: uid,
        point: spawns[ game.units[uid].split(' ')[0] ],
        color: colors[team],
        icon: type === "fleet" ? "⯆" : "⚈"
      });
    }

    return (
      <div className="board" ref={this.viewport}>
        <div className="board__map" style={css}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${map.width} ${map.height}`}
            className="board__svg"
            preserveAspectRatio="xMidYmid meet"
          >
          {map.provinces.map(t => {
            // const bgColor =
            //   t.type === "land" ? t.color || LAND_COLOR : WATER_COLOR;

            // let territoryClass = "map__territory";
            // if (t.isVP) territoryClass += " map__territory--vp";

            const bgColor = t.type === "land" ? map.landColor : map.waterColor;
            const points = t.border.map(c => c.join(',')).join(' ');

            return (
              <polygon
                key={t.id}
                points={points}
                className="map__territory"
                fill={bgColor}
              />
            );
          })}
          </svg>
          {units.map(u => {
            return (
              <div
                key={u.id}
                style={{
                  left: `${u.point[0]}px`,
                  top: `${u.point[1]}px`,
                  color: u.color
                }}
                className="game__unit"
              >
                {u.icon}
              </div>
            );
          })}
          {map.provinces.map(t => {
            let className = "board__label";
            let text = t.id;
            if (t.isVP) {
              className += " is-vp";
            }
            return (
              <span
                key={t.id}
                className={className}
                style={{
                  left: t.labelCoord[0] + "px",
                  top: t.labelCoord[1] + "px"
                }}
              >{text}</span>
            );
          })}
        </div>
      </div>
    );
        // {`Hello. [${this.state.size.width}x${this.state.size.height}]`}
  }
        // <Game state={this.props.game} map={map}>
        //   {`This is the board. [${containerWidth}x${containerHeight}]`}
        // </Game>
  
        // {/* <div className="board">
        //   <div className="board__map" style={{width:`${map.width}px`, height:`${map.height}px`}}>
        //   </div>
        // </div> */}
}

export default Board;
// export default Board; MeasureIt()(Board);
