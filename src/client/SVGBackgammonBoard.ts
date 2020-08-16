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

export default class SVGBackgammonBoard {
    
    #svgNode: SVGSVGElement
    #layout: BoardLayout

    constructor(layout:BoardLayout = SVGBackgammonBoard.START_LAYOUT) {
        this.#layout = layout
        this.#svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.#svgNode.setAttributeNS(null, 'viewBox', `0 0 ${boardWidth} ${boardHeight}`)
                
        this.#svgNode.appendChild(this.drawBoardBackground())
        this.#svgNode.appendChild(this.drawOffBoard())
        this.#svgNode.appendChild(this.drawBar())
        //this.#svgNode.appendChild(this.drawChecker())

        Array.from({length:24},(v,k)=>k+1).forEach(p => {
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
            const checkerCol = this.drawCheckerColumn(pointCheckers.isWhite, point, pointCheckers.count)
            this.#svgNode.appendChild(checkerCol)
        })
    }

    public updateLayout(layout:BoardLayout) {
        this.#layout = layout
        this.#svgNode.querySelectorAll(".checker").forEach(elem => elem.parentNode.removeChild(elem))
        this.drawLayout()
    }

    private drawBoardBackground():SVGRectElement {
        let bgRect = document.createElementNS("http://www.w3.org/2000/svg","rect")
        bgRect.setAttributeNS(null, 'id', 'background-rect')
        bgRect.setAttributeNS(null, 'width', `${boardWidth}`)
        bgRect.setAttributeNS(null, 'height', `${boardHeight}`)
        bgRect.setAttributeNS(null, 'fill', `#262626`)

        return bgRect
    }

    private drawOffBoard(): SVGRectElement {
        let offBoardRect = document.createElementNS("http://www.w3.org/2000/svg","rect")
        offBoardRect.setAttributeNS(null, 'id', 'offboard-rect')
        offBoardRect.setAttributeNS(null, 'width', `${offBoardWidth}`)
        offBoardRect.setAttributeNS(null, 'height', `${boardHeight}`)
        offBoardRect.setAttributeNS(null, 'fill', `#262626`) //
        offBoardRect.setAttributeNS(null, 'x', `${boardWidth - offBoardWidth}`)
        offBoardRect.setAttributeNS(null, 'y', `0`)

        return offBoardRect
    }

    private drawBar(): SVGRectElement {
        let barRect = document.createElementNS("http://www.w3.org/2000/svg","rect")
        barRect.setAttributeNS(null, 'id', 'bar')
        barRect.setAttributeNS(null, 'width', `${barWidth - (2 * barPadding)}`)
        barRect.setAttributeNS(null, 'x', `${(boardWidth - offBoardWidth) / 2 - barWidth / 2 + barPadding}`)
        barRect.setAttributeNS(null, 'height', `${boardHeight}`)
        barRect.setAttributeNS(null, 'fill', `#d9d9d9`)

        return barRect
    }

    private calculateXOffset(point: number) {
        let xOffset = (boardWidth - offBoardWidth) - ((point) * pointWidth)
        if(point > 6) {
            xOffset = xOffset - barWidth
        }
        if(point > 12) {
            xOffset = (point - 13) * pointWidth
            if(point > 18) {
                xOffset = xOffset + barWidth
            }
        }

        return xOffset
    }

    private drawPoint(point: number): SVGPolygonElement {        
        let pointTriangle = document.createElementNS("http://www.w3.org/2000/svg","polygon")
        pointTriangle.setAttributeNS(null, 'id', `point-${point}`)

        let bottom = boardHeight
        if(point > 12) {
            bottom = pointHeight
        }
        const xOffset = this.calculateXOffset(point)

        const point1 = `${xOffset},${bottom}`
        const point2 = `${pointWidth / 2 + xOffset},${bottom - pointHeight}`
        const point3 = `${pointWidth + xOffset},${bottom}`
        pointTriangle.setAttributeNS(null, "points", `${point1} ${point2} ${point3}`)
        if(point > 12) {
          pointTriangle.setAttributeNS(null, "transform", `rotate(180,${point2}) translate(0,-${pointHeight})`)
        }
        
        if(point % 2 != 0) {
            pointTriangle.setAttributeNS(null, 'fill', `#ebac00`)
        } else {
            pointTriangle.setAttributeNS(null, 'fill', `#c45200`)
        }

        return pointTriangle
    }

    private drawCheckerColumn(white: boolean, point: number, count: number): SVGGElement {

        let checkerColumn = document.createElementNS('http://www.w3.org/2000/svg', 'g')

        let xOffset = this.calculateXOffset(point) + (pointWidth / 2)

        for(let i = 0; i < count; i++) {   
            let yOffset = boardHeight - checkerRadius - (i * checkerRadius * 2)
            if(point > 12) {
                yOffset = checkerRadius + (i * checkerRadius * 2)
            }

            const checker = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            checker.setAttributeNS(null, 'class', 'checker')
            checker.setAttributeNS(null, 'cx', `${xOffset}`)
            checker.setAttributeNS(null, 'cy', `${yOffset}`)
            checker.setAttributeNS(null, 'r', `${checkerRadius}`)
            if(white) {
                checker.setAttributeNS(null, 'fill', '#dee0df')
            } else {
                checker.setAttributeNS(null, 'fill', '#153e70')
            }
            //circleNode.addEventListener("click", () => this.animate())

            checkerColumn.appendChild(checker)
        }      
        
        return checkerColumn
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
        barCheckers: [0,0],
        offBoardCheckers: [0,0]
    }
}

export interface BoardLayout {
    pointCheckers: { [ pointNumber: number]: CheckerColumn}
    barCheckers: [number, number]
    offBoardCheckers: [number, number]
}

export interface CheckerColumn {
    isWhite: boolean
    count: number
}