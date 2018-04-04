// @flow
import * as React from "react";
import type { MapConfig, GameState } from "flowtypes";
import "./style.css";

const LAND_COLOR = "#CCCAB7";
const WATER_COLOR = "#6BBEEA";

type Props = {
  map: MapConfig,
  game: GameState
};

type State = {
  mapConfig: ?MapConfig,
  teams: { [string]: { color: string } },
  territories: Array<{
    id: string,
    type: "land" | "water",
    path: string,
    isSupply: Boolean,
    labelCoord: [number, number],
    spawnCoord: [number, number],
    coasts: Array<{
      name: string,
      path: string
    }>
  }>,
  regions: Array<{
    id: string,
    path: string,
    color: string
  }>
};

class Board extends React.Component<Props, State> {
  state = {
    mapConfig: null,
    teams: {},
    territories: [],
    regions: []
  };

  static getDerivedStateFromProps(newProps: Props, prevState: State) {
    if (newProps.map === prevState.mapConfig) return null;

    let nextState = {
      mapConfig: newProps.map,
      teams: {},
      territories: newProps.map.territories.map(t => ({
        id: t.id,
        path: t.border,
        isSupply: !!t.isSupply,
        labelCoord: t.labelCoord,
        spawnCoord: t.spawnCoord,
        type: t.type,
        coasts: t.coasts || []
      })),
      regions: newProps.map.teams.map(t => ({
        id: t.id,
        path: t.border,
        color: t.color
      }))
    };
    newProps.map.teams.forEach(t => {
      nextState.teams[t.id] = t;
    });

    return nextState;
  }

  render() {
    // shade territories that are occupied by a unit (or owned by a team)
    let occupiedBy = {};
    for (let uid in this.props.game.units) {
      const [team, type, idx] = uid.split("-");
      const [territory, coast] = this.props.game.units[uid].split(/ /);
      occupiedBy[territory] = this.state.teams[team].color;
    }

    return (
      <svg
        className="map"
        width={this.props.map.width * 0.7}
        height={this.props.map.height * 0.7}
        viewBox={`0 0 ${this.props.map.width} ${this.props.map.height}`}
      >
        <defs>
          {this.state.territories.map(t => (
            <clipPath id={`map-territory-${t.id}`} key={t.id}>
              <polygon points={t.path} />
            </clipPath>
          ))}
          {this.state.regions.map(t => (
            <clipPath id={`map-region-${t.id}`} key={t.id}>
              <polygon points={t.path} />
            </clipPath>
          ))}
        </defs>
        {this.state.territories.map(t => {
          const bgColor = t.type === "land" ? LAND_COLOR : WATER_COLOR;

          let territoryClass = "map__territory";
          if (t.isSupply) territoryClass += " map__territory--vp";
          return (
            <g key={t.id}>
              <g
                clipPath={`url(#map-territory-${t.id})`}
                className={territoryClass}
              >
                <g className="map__territory-bg">
                  <rect
                    x="0"
                    y="0"
                    width={this.props.map.width}
                    height={this.props.map.height}
                    fill={bgColor}
                  />
                  {/* {occupiedBy[t.id] ? ( */}
                  {this.props.game.control[t.id] ? (
                    <rect
                      x="0"
                      y="0"
                      width={this.props.map.width}
                      height={this.props.map.height}
                      fill={
                        this.state.teams[this.props.game.control[t.id]].color
                      }
                      className="map__occupied-territory"
                    />
                  ) : null}
                  {t.isSupply ? (
                    <polygon
                      className="map__vp"
                      points={calculateStarPoints(
                        t.labelCoord[0],
                        t.labelCoord[1],
                        10
                      )}
                    />
                  ) : null}
                </g>
                <polygon
                  points={t.path}
                  className="map__territory-border"
                  fill="transparent"
                />
              </g>
            </g>
          );
        })}
        {this.state.regions.map(r => {
          return (
            <polygon
              key={r.path}
              points={r.path}
              className="map__region"
              stroke={r.color}
              clipPath={`url(#map-region-${r.id})`}
            />
          );
        })}
        {this.state.territories.map(t => {
          let className = "map__territory-label";
          if (t.isSupply) className += " is-vp";
          return (
            <text
              key={t.id}
              className={className}
              textAnchor="middle"
              x={t.labelCoord[0]}
              y={t.labelCoord[1] + (t.isSupply ? 15 : 0)}
            >
              {t.id}
            </text>
          );
        })}
      </svg>
    );
  }
}

function calculateStarPoints(centerX, centerY, outerRadius) {
  var results = "";
  const arms = 5;
  const innerRadius = outerRadius / Math.PI;

  var angle = Math.PI / arms;

  for (var i = 0; i < 2 * arms; i++) {
    // Use outer or inner radius depending on what iteration we are in.
    var r = (i & 1) === 0 ? outerRadius : innerRadius;

    var currX = centerX + Math.cos(i * angle) * r;
    var currY = centerY + Math.sin(i * angle) * r;

    // Our first time we simply append the coordinates, subsequet times
    // we append a ", " to distinguish each coordinate pair.
    if (i === 0) {
      results = currX + "," + currY;
    } else {
      results += ", " + currX + "," + currY;
    }
  }

  return results;
}

export default Board;
