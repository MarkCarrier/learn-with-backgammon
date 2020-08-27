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

const SVG_NAMESPACE_URI = 'http://www.w3.org/2000/svg'

import {
  concatMap,
  takeUntil
} from 'rxjs/operators'

import { fromEvent, Observable } from 'rxjs'

export default class SVGBackgammonBoard {

  #svgNode: SVGSVGElement
  #layout: BoardLayout

  constructor(layout: BoardLayout = SVGBackgammonBoard.START_LAYOUT) {
    this.#layout = layout
    this.#svgNode = document.createElementNS(SVG_NAMESPACE_URI, 'svg')
    this.#svgNode.setAttributeNS(null, 'viewBox', `0 0 ${boardWidth} ${boardHeight}`)

    this.#svgNode.appendChild(this.drawBoardBackground())
    this.#svgNode.appendChild(this.drawOffBoard())
    this.#svgNode.appendChild(this.drawBar())
    //this.#svgNode.appendChild(this.drawChecker())

    Array.from({ length: 24 }, (v, k) => k + 1).forEach(p => {
      this.#svgNode.appendChild(this.drawPoint(p))
    })

    this.drawLayout()
  }

  get svgNode(): SVGSVGElement {
    return this.#svgNode
  }

  private drawLayout(): void {
    Object.keys(this.#layout.pointCheckers).map(pointKey => {
      const point = parseInt(pointKey)
      const pointCheckers = this.#layout.pointCheckers[point]
      const checkerCol = this.drawCheckerColumn(
          pointCheckers.isWhite,
          point,
          pointCheckers.count)
      checkerCol.forEach(checker => this.#svgNode.appendChild(checker))   
    })
  }

  public updateLayout(layout: BoardLayout): void {
    this.#layout = layout
    this.#svgNode
      .querySelectorAll(".checker")
      .forEach(
        elem => elem.parentNode.removeChild(elem)
      )
    this.drawLayout()
  }

  public moveChecker(sourcePoint: number, targetPoint: number): void {
    const sourcePointCol = this.#layout.pointCheckers[sourcePoint]
    if (sourcePointCol && sourcePointCol.count) {
      const targetPointCol = 
        this.#layout.pointCheckers[targetPoint] || 
        { isWhite: sourcePointCol.isWhite, count: 0 }

      const startPos: [number,number] = [
        this.calculateXOffset(sourcePoint),
        this.calculateYOffset(sourcePoint, sourcePointCol.count - 1)
      ]
      const endPos: [number,number] = [
        this.calculateXOffset(targetPoint),
        this.calculateYOffset(targetPoint, targetPointCol.count)
      ]
      const path = this.drawPath(startPos, endPos)
      this.#svgNode.appendChild(path)      
      const checkerToMove = this
        .#svgNode
        .querySelector(`#checker-${sourcePoint}-${sourcePointCol.count - 1}`)
      
      let animation = document.createElementNS(SVG_NAMESPACE_URI,"animateMotion")
      animation.setAttribute("dur", "2s")            
      animation.setAttribute("fill", "freeze")
      //animation.setAttribute("values", `${startPos[0]};${startPos[0] - 100}`)
      animation.setAttribute("path", path.getAttribute("d"))
      
      checkerToMove.parentElement.removeChild(checkerToMove)
      let newChecker = this.drawChecker(
          null,
          null,
          "red",
          "newGuy")
      
      newChecker.appendChild(animation)
      this.#svgNode.appendChild(newChecker)      
    }
  }

  private drawPath(from: [number,number], to: [number,number]): SVGElement {
    let path = document.createElementNS(SVG_NAMESPACE_URI, "path")

    const y = to[1] - from[1]
    const x = to[0] - from[0]
    const h = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
    const pathAngle = Math.atan(y / x)
    const lh = h / 2
    const lx = Math.cos(pathAngle) * lh
    const ly = Math.sin(pathAngle) * lh
    const midPointX = lx + to[0]
    const midPointY = ly + to[1]
    const midPointXP = Math.sin(-1 * pathAngle) * 50
    const midPointYP = Math.cos(-1 * pathAngle) * 50
    const dX = midPointX - midPointXP
    const dY = midPointY - midPointYP

    console.log(`from: ${from},  to: ${to}`)
    console.log(`h: ${h}   pathAngle: ${pathAngle / Math.PI * 180}`)
    console.log(`lx: ${lx}   ly: ${ly}`)


    // let p1 = document.createElementNS(SVG_NAMESPACE_URI, 'circle')
    // p1.setAttributeNS(null, 'cx', `${dX}`)
    // p1.setAttributeNS(null, 'cy', `${dY}`)
    // p1.setAttributeNS(null, 'r', "5")
    // p1.setAttributeNS(null, 'fill', "red")
    // this.#svgNode.appendChild(p1)

    // let p2 = document.createElementNS(SVG_NAMESPACE_URI, 'circle')
    // p2.setAttributeNS(null, 'cx', `${from[0]}`)
    // p2.setAttributeNS(null, 'cy', `${from[1]}`)
    // p2.setAttributeNS(null, 'r', "5")
    // p2.setAttributeNS(null, 'fill', "green")
    // this.#svgNode.appendChild(p2)

    // let p3 = document.createElementNS(SVG_NAMESPACE_URI, 'circle')
    // p3.setAttributeNS(null, 'cx', `${to[0]}`)
    // p3.setAttributeNS(null, 'cy', `${to[1]}`)
    // p3.setAttributeNS(null, 'r', "5")
    // p3.setAttributeNS(null, 'fill', "blue")
    // this.#svgNode.appendChild(p3)



    path.setAttribute("d",`M ${from[0]} ${from[1]} Q ${dX} ${dY} ${to[0]} ${to[1]}`)
    //path.setAttributeNS(null,"d",`M${from[0]},${from[1]} L ${to[0]},${to[1]}`)
    //path.setAttributeNS(null,"d",`M100,100 C100,0 500,0 500,100`)
    path.setAttribute("fill","none")
    path.setAttribute("id","wire")
    path.setAttribute("stroke","none")
    //path.setAttribute("stroke-width","3")    

    return path
  }

  private drawBoardBackground(): SVGElement {
    let bgRect = document.createElementNS(SVG_NAMESPACE_URI, "rect")
    bgRect.setAttributeNS(null, 'id', 'background-rect')
    bgRect.setAttributeNS(null, 'width', `${boardWidth}`)
    bgRect.setAttributeNS(null, 'height', `${boardHeight}`)
    bgRect.setAttributeNS(null, 'fill', `#262626`)

    return bgRect
  }

  private drawOffBoard(): SVGElement {
    let offBoardRect = document.createElementNS(SVG_NAMESPACE_URI, "rect")
    offBoardRect.setAttributeNS(null, 'id', 'offboard-rect')
    offBoardRect.setAttributeNS(null, 'width', `${offBoardWidth}`)
    offBoardRect.setAttributeNS(null, 'height', `${boardHeight}`)
    offBoardRect.setAttributeNS(null, 'fill', `#262626`) //
    offBoardRect.setAttributeNS(null, 'x', `${boardWidth - offBoardWidth}`)
    offBoardRect.setAttributeNS(null, 'y', `0`)

    return offBoardRect
  }

  private drawBar(): SVGElement {
    let barRect = document.createElementNS(SVG_NAMESPACE_URI, "rect")
    barRect.setAttributeNS(null, 'id', 'bar')
    barRect.setAttributeNS(null, 'width', `${barWidth - (2 * barPadding)}`)
    barRect.setAttributeNS(null, 'x', `${(boardWidth - offBoardWidth) / 2 - barWidth / 2 + barPadding}`)
    barRect.setAttributeNS(null, 'height', `${boardHeight}`)
    barRect.setAttributeNS(null, 'fill', `#d9d9d9`)

    return barRect
  }

  private calculateXOffset(point: number): number {
    let xOffset = (boardWidth - offBoardWidth) - ((point) * pointWidth)
    if (point > 6) {
      xOffset = xOffset - barWidth
    }
    if (point > 12) {
      xOffset = (point - 13) * pointWidth
      if (point > 18) {
        xOffset = xOffset + barWidth
      }
    }

    return xOffset + (pointWidth / 2)
  }

  private calculateYOffset(point: number, checkerIndex: number): number {
    let yOffset = boardHeight - checkerRadius - (checkerIndex * checkerRadius * 2)
    if (point > 12) {
      yOffset = checkerRadius + (checkerIndex * checkerRadius * 2)
    }
    return yOffset
  }

  private drawPoint(point: number): SVGElement {
    let pointTriangle = document.createElementNS(SVG_NAMESPACE_URI, "polygon")
    pointTriangle.setAttributeNS(null, 'id', `point-${point}`)

    let bottom = boardHeight
    if (point > 12) {
      bottom = pointHeight
    }
    const xOffset = this.calculateXOffset(point) - (pointWidth / 2)

    const point1 = `${xOffset},${bottom}`
    const point2 = `${pointWidth / 2 + xOffset},${bottom - pointHeight}`
    const point3 = `${pointWidth + xOffset},${bottom}`
    pointTriangle.setAttributeNS(null, "points", `${point1} ${point2} ${point3}`)
    if (point > 12) {
      pointTriangle.setAttributeNS(null, "transform", `rotate(180,${point2}) translate(0,-${pointHeight})`)
    }

    if (point % 2 != 0) {
      pointTriangle.setAttributeNS(null, 'fill', `#ebac00`)
    } else {
      pointTriangle.setAttributeNS(null, 'fill', `#c45200`)
    }

    return pointTriangle
  }

  private drawCheckerColumn(white: boolean, point: number, count: number): Array<SVGElement> {

    let checkerColumn = new Array<SVGElement>()

    let xOffset = this.calculateXOffset(point)

    for (let i = 0; i < count; i++) {
      const yOffset = this.calculateYOffset(point, i)

      let fillColor = "#153e70"
      if (white) {
        fillColor = "#dee0df"
      }
      const checker = this.drawChecker(xOffset, yOffset, fillColor, `checker-${point}-${i}`)
      checkerColumn.push(checker)
    }

    return checkerColumn
  }

  private drawChecker(xOffset: number, yOffset: number, fillColor: string, id: string): SVGElement {
    let checker = document.createElementNS(SVG_NAMESPACE_URI, 'circle')
    checker.setAttributeNS(null, 'class', 'checker')
    checker.setAttributeNS(null, 'id', id)
    if(xOffset > 0)
        checker.setAttributeNS(null, 'cx', `${xOffset}`)
    if(yOffset > 0)
        checker.setAttributeNS(null, 'cy', `${yOffset}`)
    checker.setAttributeNS(null, 'r', `${checkerRadius}`)
    checker.setAttributeNS(null, 'fill', `${fillColor}`)

    let animation = document.createElementNS(SVG_NAMESPACE_URI,"animateMotion")
      animation.setAttributeNS(null, "dur", "3s")      
      animation.setAttributeNS(null, "fill", "freeze")
      animation.setAttributeNS(null, "path", `M${xOffset},${yOffset} L${xOffset - 100},${yOffset}`)

    //checker.appendChild(animation)
    //circleNode.addEventListener("click", () => this.animate())
    //this.makeCheckerDraggable(checker)


    return checker
  }

  private makeCheckerDraggable(checker: SVGElement): void {
    const checkerMouseDown$ = fromEvent(checker, "mousedown")
    const checkerMouseUp$ = fromEvent(checker, "mouseup")
    const checkerMouseMove$ = fromEvent<MouseEvent>(checker, "mousemove")

    const getCheckerMove$ = () => {
      return checkerMouseMove$.pipe(
        takeUntil(checkerMouseUp$)
      )
    }

    const drag$ = checkerMouseDown$
      .pipe(
        concatMap(getCheckerMove$)
      )

    drag$.subscribe(event => {
      let point = this.#svgNode.createSVGPoint()
      point.x = event.clientX
      point.y = event.clientY
      let relativePoint = point.matrixTransform(this.#svgNode.getScreenCTM().inverse())
      checker.setAttributeNS(null, 'cx', `${relativePoint.x}`)
      checker.setAttributeNS(null, 'cy', `${relativePoint.y}`)
    })
  }

  // private animate(): void {
  //     let circleNode = this.#svgNode.getElementById("circleB")
  //     let startTime = 0
  //     const totalTime = 1000 // 1000ms = 1s
  //     const animateStep = (timestamp: number) => {
  //     if (!startTime) startTime = timestamp
  //     // progress goes from 0 to 1 over 1s
  //     const progress = (timestamp - startTime) / totalTime
  //     // move right 100 px
  //     circleNode.setAttributeNS(null, 'cx', (50 + (100 * progress)).toString())
  //     if (progress < 1) {
  //         window.requestAnimationFrame(animateStep)
  //     }
  //     }
  //     window.requestAnimationFrame(animateStep)
  // }

  static readonly START_LAYOUT: BoardLayout = {
    pointCheckers: {
      1: {
        isWhite: false,
        count: 2
      },
      6: {
        isWhite: true,
        count: 5
      },
      8: {
        isWhite: true,
        count: 3
      },
      12: {
        isWhite: false,
        count: 5
      },
      13: {
        isWhite: true,
        count: 5
      },
      17: {
        isWhite: false,
        count: 3
      },
      19: {
        isWhite: false,
        count: 5
      },
      24: {
        isWhite: true,
        count: 2
      }
    },
    barCheckers: [0, 0],
    offBoardCheckers: [0, 0]
  }
}

export interface BoardLayout {
  pointCheckers: { [pointNumber: number]: CheckerColumn }
  barCheckers: [number, number]
  offBoardCheckers: [number, number]
}

export interface CheckerColumn {
  isWhite: boolean
  count: number
}