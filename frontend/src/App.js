import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const map = require('./standard.json');

let owners = {
  neutral: { color:map.neutralColor },
  ocean: { color:map.waterColor }
};
map.players.forEach(p => owners[p.id] = p);

class App extends Component {
  render() {
    return (
      <div className="App">
        <svg className="map" width={map.width} height={map.height} viewBox={`0 0 ${map.width} ${map.height}`}>
          {map.territories.map(t => {
            return (
              <polygon
                className="map__territory"
                points={t.border}
                fill={owners[t.region].color}
                />
            );
          })}
        </svg>
      </div>
    );
  }
}

export default App;
