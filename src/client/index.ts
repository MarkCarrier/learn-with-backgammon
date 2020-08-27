import SVGBackgammonBoard from './SVGBackgammonBoard'
import { BoardLayout } from './SVGBackgammonBoard'

const bgBoard = new SVGBackgammonBoard(SVGBackgammonBoard.START_LAYOUT)
const targetDiv = document.getElementById('svg-target');
targetDiv.appendChild(bgBoard.svgNode);

let nextLayout:BoardLayout  = JSON.parse(JSON.stringify(SVGBackgammonBoard.START_LAYOUT))
nextLayout.pointCheckers[1] = {
  isWhite: false,
  count: 1
}
nextLayout.pointCheckers[2] = {
  isWhite: false,
  count: 1
}
setTimeout(() => {
  //bgBoard.updateLayout(nextLayout)
  bgBoard.moveChecker(1,2)
},2000)
