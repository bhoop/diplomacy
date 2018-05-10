// @flow
import * as React from "react";
// import Game from "./components/Game";
import Sandbox from "./components/Sandbox";
import "./App.css";

import type { MapConfig, GameState } from "./flowtypes";

// let owners = {
//   neutral: { color: map.neutralColor },
//   ocean: { color: map.waterColor }
// };
// map.players.forEach(p => (owners[p.id] = p));

class App extends React.Component<*, *> {
  render() {
    return <Sandbox/>;
    // return <Game state={game.state} map={map} />;

    // return (
    //   <div className="App">
    //     <svg className="map" width={map.width} height={map.height} viewBox={`0 0 ${map.width} ${map.height}`}>
    //       <defs>
    //         {map.territories.map(t => (
    //           <clipPath id={`map-terrpath-${t.id}`} key={t.id}>
    //             <polygon points={t.border}/>
    //           </clipPath>
    //         ))}
    //       <clipPath id="myClip">
    //         <circle cx="30" cy="30" r="20"/>
    //         <circle cx="70" cy="70" r="20"/>
    //       </clipPath>

    //       </defs>
    //       {map.territories.map(t => (
    //         <g>

    //         </g>
    //         // <g clip-path=
    //         // return (
    //         //   <polygon
    //         //     className="map__territory"
    //         //     points={t.border}
    //         //     fill={owners[t.region].color}
    //         //     />
    //         // );
    //       ))}
    //     </svg>
    //   </div>
    // );
  }
}

export default App;
