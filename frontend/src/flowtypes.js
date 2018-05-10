export type MapConfig = {
  width: number,
  height: number,
  territories: Array<{
    id: string,
    name: string,
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

export type Season = "spring" | "spring-resolve" | "fall" | "fall-resolve" | "winter";

export type OrderCommand = "" | "M" | "H" | "S"| "C";

type OrderMeta = {
  status: "pending" | "valid" | "invalid" | "successful" | "failed",
  statusMessage: string
}
type CommandOrder = {
  type: "command",
  unit: string,
  command: OrderCommand,
  target: string,
  targetCommand: OrderCommand,
  destination: string,
} & OrderMeta;
type RetreatOrder = {
  type: "retreat",
  unit: string,
  destination: string,
} & OrderMeta;
type BuildOrder = {
  type: "build",
  unitType: "A" | "F" | "",
  destination: string
};
export type Order = CommandOrder | RetreatOrder | BuildOrder;

export type GameState = {
  year: number,
  season: Season,
  units: { [string]: string },
  control: { [string]: string },
  orders: Array<Order>,
};

export type MapProvinces = Array<{
  id: string,
  path: string,
  name: string,
  labelPoint: [number, number],
  type: "land" | "water",
  isSupply: boolean
}>;
