import * as React from "react"
import { useSelector } from "react-redux"
import {
  IBackgammonGameState,
  ICheckerProps,
  IChecker,
  IPointProps,
} from "./backgammon"

const boardWidth = 800
const offBoardWidthRatio = 8
const boardHeight = 600
const middlePaddingHeight = 100
const barWidth = 50
const barPadding = 10
const checkerRadius = 25
const offBoardWidth = boardWidth / offBoardWidthRatio
const pointWidth = (boardWidth - offBoardWidth - barWidth) / 12
const pointHeight = (boardHeight - middlePaddingHeight) / 2

export default function SVGBackgammonBoard() {
  
  const calculateXOffset = function (point: number): number {
    let xOffset = boardWidth - offBoardWidth - point * pointWidth
    if (point > 6) {
      xOffset = xOffset - barWidth
    }
    if (point > 12) {
      xOffset = (point - 13) * pointWidth
      if (point > 18) {
        xOffset = xOffset + barWidth
      }
    }

    return xOffset + pointWidth / 2
  }

  const calculateYOffset = function (
    point: number,
    checkerIndex: number
  ): number {
    let yOffset = boardHeight - checkerRadius - checkerIndex * checkerRadius * 2
    if (point > 12) {
      yOffset = checkerRadius + checkerIndex * checkerRadius * 2
    }
    return yOffset
  }

  const createCheckerProps = (checker: IChecker): ICheckerProps => {
    
    const fill = checker.isWhite ? "#dee0df" : "#153e70"
    const xOffset = calculateXOffset(checker.pointNumber)
    const yOffset = calculateYOffset(checker.pointNumber, checker.stackIndex)

    return {
      id: checker.id.toString(),
      fill,
      position: [xOffset, yOffset],
      radius: checkerRadius,
    }
  }

  const layout = useSelector<IBackgammonGameState, Array<IChecker>>(state => state.layout)
  // const handleCheckerMove = (e: IMoveEvent) => {
  //   let newLayout = {
  //     ...layout,
  //   }
  //   let from = newLayout.pointCheckerGroups[e.targetPoint]
  //   if (from && from.count) {
  //     from.count = from.count - 1

  //     let to = newLayout.pointCheckerGroups[e.targetPoint + e.diceValue]
  //     if (to) {
  //       newLayout.pointCheckerGroups[e.targetPoint + e.diceValue] = {
  //         isWhite: to.isWhite,
  //         count: to.count + 1,
  //       }
  //     } else {
  //       newLayout.pointCheckerGroups[e.targetPoint + e.diceValue] = {
  //         count: 1,
  //         isWhite: from.isWhite,
  //       }
  //     }
  //   }
  //   setLayout(newLayout)
  // }
  // props.gameEvents.on("move", handleCheckerMove)

  const getPointProps = function (point: number): IPointProps {
    const fill = point % 2 != 0 ? "#ebac00" : "#c45200"
    const rotated = point > 12

    let bottom = boardHeight
    if (point > 12) {
      bottom = pointHeight
    }

    const xOffset = calculateXOffset(point) - pointWidth / 2

    const vertex1: [number, number] = [xOffset, bottom]
    const vertex2: [number, number] = [
      pointWidth / 2 + xOffset,
      bottom - pointHeight,
    ]
    const vertex3: [number, number] = [pointWidth + xOffset, bottom]

    return {
      pointId: point,
      fill,
      rotated,
      vertex1,
      vertex2,
      vertex3,
    }
  }

  const points = Array.from({ length: 24 }, (v, k) => k + 1)
    .map((p) => getPointProps(p))
    .map(SVGBackgammonPoint)
  

  const checkers = layout.map(createCheckerProps)
    .map(SVGBackgammonChecker)

  return (
    <svg viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
      <rect
        id="background-rect"
        width={boardWidth}
        height={boardHeight}
        fill="#262626"
      />
      <rect
        id="offboard-rect"
        width={offBoardWidth}
        height={boardHeight}
        fill="#262626"
        x={boardWidth - offBoardWidth}
        y="0"
      />

      <rect
        id="bar"
        width={barWidth - 2 * barPadding}
        x={(boardWidth - offBoardWidth) / 2 - barWidth / 2 + barPadding}
        height={boardHeight}
        fill="#d9d9d9"
      />

      <g id="points">{points}</g>
      <g id="checkers">{checkers}</g>
    </svg>
  )
}

function SVGBackgammonPoint(props: IPointProps) {
  const point1 = `${props.vertex1[0]},${props.vertex1[1]}`
  const point2 = `${props.vertex2[0]},${props.vertex2[1]}`
  const point3 = `${props.vertex3[0]},${props.vertex3[1]}`
  const points = `${point1} ${point2} ${point3}`
  const pointHeight = Math.abs(props.vertex2[1] - props.vertex1[1])
  const transform = props.rotated
    ? `rotate(180,${point2}) translate(0,-${pointHeight})`
    : ""
  return (
    <polygon
      id={`point-${props.pointId}`}
      key={`point-${props.pointId}`}
      fill={props.fill}
      points={points}
      transform={transform}
    />
  )
}

function SVGBackgammonChecker(props: ICheckerProps) {
  return (
    <circle
      key={props.id}
      className="checker"
      fill={props.fill}
      r={props.radius}
      cx={props.position[0]}
      cy={props.position[1]}
    />
  )
}
