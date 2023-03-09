import { generateQueryConstructor } from '../Utils/object.utils.js'
import GridCell from './GridCell.class.js'
import GridDraw from './GridDraw.class.js'
class Grid{
    constructor(){
        generateQueryConstructor.call(this, ...arguments)
    }

    get gridElement(){
        //this to return the grid element from HTML
        return document.querySelector(this.settings.gridSelector)
    }
    get svgElement(){
        //this to return the grid element from HTML
        return document.querySelector(this.settings.svgSelector)
    }

    build(){
        this.#buildGridLayout()
        this.#buildGridCells()
        this.#buildGridSvg()
    }
    // # means private methods
    #buildGridLayout(){
        const { settings } = this // ===  settings= this.settings 
        const { cellSize, borderSize, borderColor}= settings
        const { innerWidth, innerHeight}= window // this is predifined object 
        const fullCellSize= cellSize + borderSize*2

        this.numCols = Math.floor( innerWidth/fullCellSize)
        this.numRows = Math.floor( innerHeight/fullCellSize)

        this.gridWidth = this.numCols * fullCellSize
        this.gridHeight = this.numRows * fullCellSize
        
        this.gridMarginX =( innerWidth - this.gridWidth - borderSize*2) / 2
        this.gridMarginY =( innerHeight - this.gridHeight - borderSize*2) / 2

        Object.assign(this.gridElement.style, {
            width : `${this.gridWidth}px`,
            height : `${this.gridHeight}px`,

            marginLeft :`${this.gridMarginX}px`,
            marginTop :`${this.gridMarginY}px`,

            border : `${borderSize}px solid ${borderColor}`
        })


        console.log(innerWidth, this.numCols,this.numRows, this.gridWidth, this.gridHeight)
    }
    #buildGridCells(){

        const { numRows, numCols}=this
        this.gridCells={}

        for(let row=0; row<numRows; row++){
        for(let col=0; col<numCols; col++){
            const gridCell = new GridCell({ grid : this, row, col})
            gridCell.render()
            this.gridCells[gridCell.position] = gridCell

        }
    }


    }
    #buildGridSvg(){
        const {svgElement,gridWidth,gridHeight,gridMarginX,gridMarginY}=this
        Object.assign(svgElement.style, {
            width:`${gridWidth}px`,
            height:`${gridHeight}px`,
            left:`${gridMarginX}px`,
            top:`${gridMarginY}px`
        })

        svgElement.setAttribute('viewbox',`0 0 ${gridWidth} ${gridHeight}`)
    }

    draw(){
        const gridDraw =new GridDraw({grid :this})
        gridDraw.draw()
    }
}

export default Grid