import { EventEmitter } from "events"

export interface IMoveEvent {
  isWhitePlayer: boolean
  diceValue: number
  targetPoint: number
}

export interface IDiceRoll {
  isWhitePlayer: boolean
  diceValues: [number, number]
}

export interface IBackgammonGameState {
  layout: Array<IChecker>,
  moves: Array<IMoveEvent | IDiceRoll>
}

export interface IBoardProps {
  layout: Array<IChecker>
}

export interface ICheckerColumn {
  isWhite: boolean
  count: number
}

export interface IMoveEvent {
  diceValue: number
  targetPoint: number
}

export interface ICheckerProps {
  id: string
  fill: string
  position: [number, number]
  radius: number
}

export interface IPointProps {
  pointId: number
  fill: string
  vertex1: [number, number]
  vertex2: [number, number]
  vertex3: [number, number]
  rotated: boolean
}

export interface IChecker {
  id: number
  isWhite: boolean
  location: CheckerLocation
  pointNumber?: number
  stackIndex?: number
}

enum CheckerLocation {
  Point,
  Bar,
  Offboard,
}

export const START_LAYOUT: Readonly<Array<IChecker>> = [
  {
    id: 1,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 1,
    stackIndex: 0,
  },
  {
    id: 2,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 1,
    stackIndex: 1,
  },
  {
    id: 3,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 6,
    stackIndex: 0,
  },
  {
    id: 4,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 6,
    stackIndex: 1,
  },

  {
    id: 5,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 6,
    stackIndex: 2,
  },

  {
    id: 6,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 6,
    stackIndex: 3,
  },

  {
    id: 7,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 6,
    stackIndex: 4,
  },

  {
    id: 8,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 8,
    stackIndex: 0,
  },
  {
    id: 9,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 8,
    stackIndex: 1,
  },
  {
    id: 10,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 8,
    stackIndex: 2,
  },
  {
    id: 11,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 12,
    stackIndex: 0,
  },
  {
    id: 12,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 12,
    stackIndex: 1,
  },
  {
    id: 13,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 12,
    stackIndex: 2,
  },
  {
    id: 14,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 12,
    stackIndex: 3,
  },
  {
    id: 15,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 12,
    stackIndex: 4,
  },
  {
    id: 16,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 13,
    stackIndex: 0,
  },
  ,
  {
    id: 17,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 13,
    stackIndex: 1,
  },
  ,
  {
    id: 18,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 13,
    stackIndex: 2,
  },
  ,
  {
    id: 19,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 13,
    stackIndex: 3,
  },
  ,
  {
    id: 20,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 13,
    stackIndex: 4,
  },
  {
    id: 21,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 17,
    stackIndex: 0,
  },
  {
    id: 22,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 17,
    stackIndex: 1,
  },
  {
    id: 23,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 17,
    stackIndex: 2,
  },
  {
    id: 24,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 19,
    stackIndex: 0,
  },
  {
    id: 25,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 19,
    stackIndex: 1,
  },
  {
    id: 26,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 19,
    stackIndex: 2,
  },
  {
    id: 27,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 19,
    stackIndex: 3,
  },
  {
    id: 28,
    isWhite: false,
    location: CheckerLocation.Point,
    pointNumber: 19,
    stackIndex: 4,
  },
  {
    id: 29,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 24,
    stackIndex: 0,
  },

  {
    id: 30,
    isWhite: true,
    location: CheckerLocation.Point,
    pointNumber: 24,
    stackIndex: 1,
  },
]
