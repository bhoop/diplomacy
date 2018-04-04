export type MapConfig = {
  width: number,
  height: number,
  territories: Array<{
    id: string,
    type: "land" | "water",
    border: string,
    labelCoord: [number, number],
    isSupply?: true
  }>,
  teams: Array<{
    id: string,
    name: string,
    adjective: string,
    color: string,
    border: string
  }>,
  setup: {
    [string]: {
      owner: string,
      unit?: "army" | "fleet"
    }
  }
};

export type GameState = {
  map: MapConfig,
  year: number,
  season: "spring" | "spring-resolve" | "fall" | "fall-resolve" | "winter",
  units: { [string]: string }
};
