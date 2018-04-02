const inquirer = require("inquirer");
const fs = require("fs");
const svgson = require("svgson");
const chalk = require("chalk");
const polylabel = require("polylabel");
const { polygon } = require("polygon-tools");

/*
<svg>
    <g id="territories">
        <g id="france|england|germany|italy|austria|russia|turkey|neutral|ocean">
            <g id="Pic|..." supply="">
                <path type="territory" d="m x,y x,y, ... z"/>
                <path type="coast" title="..." d="m x,y x,y, ... "/>
            </g>
        </g>
    </g>
</svg>
*/

// find all of the map-*.svg files in the assets folder and prompt the user to select one
const choices = fs
  .readdirSync("../assets/maps/source")
  .filter(fname => /^map-.+\.svg$/.test(fname))
  .map(fname => {
    const name = /^map-(.+)\.svg$/.exec(fname)[1];
    return { name, value: name };
  });
inquirer
  .prompt([
    {
      name: "file",
      type: "list",
      message: `Pick a map to regenerate:`,
      choices
    }
  ])
  .then(({ file }) => {
    // parse the SVG tags into a JSON document
    svgson(
      fs.readFileSync(`../assets/maps/source/map-${file}.svg`),
      {},
      json => {
        let mapConfig = Object.assign(
          {
            width: json.attrs.width,
            height: json.attrs.height,
            territories: []
          },
          JSON.parse(fs.readFileSync(`../assets/maps/source/map-${file}.json`))
        );
        let boundaries = {};

        // traverse the SVG file (now a JSON document) and create a "territory" object for each territory in the SVG
        json.childs
          .find(o => o.attrs.id === "territories")
          .childs.forEach(svgRegion => {
            const region = svgRegion.attrs.id;
            boundaries[region] = [];
            svgRegion.childs.forEach(svgTerritory => {
              const abbr = svgTerritory.attrs.id;
              const isSupply = svgTerritory.attrs.hasOwnProperty("supply");
              let obj = {
                id: abbr,
                // todo: add full territory name to SVG and load it here
                title: "",
                type: region === "ocean" ? "ocean" : "land",
                border: "",
                center: [0, 0],
                // todo: calculate best place to display where units sit in the territory
                spawnCoord: [],
                labelCoord: []
              };

              // todo: if needed, calculate best place to display "supply center" marker
              // supplyCoord: [],
              if (isSupply) obj.isSupply = true;

              svgTerritory.childs.forEach(svgTag => {
                switch (svgTag.attrs.type) {
                  // <path type="territory" .../> becomes border
                  case "territory":
                    const coords = convertPathToCoords(svgTag.attrs.d).join(
                      " "
                    );
                    let points = groupCoordsWithArrays(coords);
                    boundaries[region].push(points.slice());

                    obj.border = coords;
                    obj.labelCoord = getCenterPoint(...points);
                    // obj.spawnCoord = polygon
                    //   .centroid(points)
                    //   .map(x => Math.round(x));
                    obj.spawnCoord = getCenterPoint(
                      ...[...points, obj.labelCoord]
                    );

                    break;

                  // <path type="coast" .../> becomes coast entries
                  case "coast":
                    if (!obj.hasOwnProperty("coasts")) obj.coasts = [];
                    // todo: calculate spawn position
                    obj.coasts.push({
                      name: svgTag.attrs.name || "Coast",
                      path: convertPathToCoords(svgTag.attrs.d).join(" ")
                    });
                    // todo: if any coast points don't match a border point, add those points
                    // (and the two end coast points on either side) as a canal to the territory object
                    break;

                  default:
                    console.log(
                      chalk`{bgRed ${abbr}#${
                        svgTag.attrs.id
                      }} {red has no defined} {underline.red type}`
                    );
                }
              });

              // add this object to the global list of territories on this map
              mapConfig.territories.push(obj);
            });
          });

        // add "border" of home region for each player
        mapConfig.teams.forEach(p => {
          // console.log(boundaries[p.id]);
          // console.log('------------------------------------');
          // console.info(boundaries[p.id], polygon.union.call(null, boundaries[p.id]), '-------------------------------------------');
          p.border = polygon
            .union(...boundaries[p.id])[0]
            .map(c => c.join(" "))
            .join(" ");
        });

        // write complete mapConfig out to a JSON file
        fs.writeFile(
          `${__dirname}/../assets/maps/${file}.json`,
          JSON.stringify(mapConfig, null, " "),
          () => {}
        );
      }
    );
  });

// var inquirer = require('inquirer');
// inquirer.prompt([/* Pass your questions in here */]).then(answers => {
// 	// Use user feedback for... whatever!!
// });

function convertPathToCoords(path) {
  let coords = [];
  let nextIsCoords = false;
  path
    .trim()
    .toLowerCase()
    .split(" ")
    .forEach(p => {
      if (p === "m") nextIsCoords = true;
      else if (p === "z") {
      } else {
        const [x, y] = p.split(",");
        if (nextIsCoords) {
          coords.push(+x);
          coords.push(+y);
          nextIsCoords = false;
        } else {
          coords.push(+x + coords[coords.length - 2]);
          coords.push(+y + coords[coords.length - 2]);
        }
      }
    });
  return coords;
}

function groupCoordsWithArrays(path) {
  const src = path.split(" "),
    dst = [];
  for (var i = 0, z = src.length; i < z; i += 2) {
    dst.push([+src[i], +src[i + 1]]);
  }
  return dst;
}

function getCenterPoint(...points) {
  return polylabel([points], 1).map(p => Math.round(p));
}

function getCoastSpawnPoint(path, center) {
  // find point on path that is closest to center
  // return point 25% between path and center
  let closest = { point: [0, 0], distance: Infinity };
  groupCoordsWithArrays(path).forEach(p => {
    const dist = Math.sqrt(
      Math.pow(point[0] - center[0], 2) + Math.pow(point[1] - center[1], 2)
    );
    if (dist < closest.distance) closest = { point: p, distance: dist };
  });
  return [
    Math.round((closest.point[0] * 3 + center[0]) / 4),
    Math.round((closest.point[1] * 3 + center[1]) / 4)
  ];
}
