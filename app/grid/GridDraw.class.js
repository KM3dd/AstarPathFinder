import { generateQueryConstructor } from '../Utils/object.utils.js'
import GridPathFinder from './GridPathFinder.class.js'
class GridDraw{
    constructor(){
        generateQueryConstructor.call(this, ...arguments)
    }

    get outCell(){
        const gridcells=Object.values(this.grid.gridCells)
        return gridcells.find(gridcell=> gridcell.isOutCell)
    }
    get inCell(){
        const gridcells=Object.values(this.grid.gridCells)
        return gridcells.find(gridcell=> gridcell.isInCell)
    }

   

    draw(){
        const {outCell,inCell,grid,grid:{svgElement}}=this
        console.log(inCell)
        const gridPathFinder = new GridPathFinder({grid , outCell, inCell})

        this.helperPath = gridPathFinder.generateHelperPath()
        const pathElement = svgElement.querySelector('path')
        pathElement.setAttribute('d',this.buildPathD())
    }
    buildPathD(){
        const {outCell,inCell,grid:{settings:{cellSize,borderSize}}}=this
        const [rowOut,colOut]=outCell.position.split('-')
        const [rowIn,colIn]=inCell.position.split('-')

        function generateM(startPos){
            return ((startPos *cellSize)-(cellSize/2) + (startPos*borderSize*2))
        }

        const m1=generateM(parseInt(colOut)+1)
        const m2=generateM(parseInt(rowOut)+1)

        const distance = cellSize + borderSize*2

        let pathD =`M${m1} ${m2}`

        for(let  i=0;i<this.helperPath.length-1;i++){
            const [col,row]=this.helperPath[i]
            const [colNext,rowNext]=this.helperPath[i+1]
            if (colNext<col) pathD+=`h-${distance}`
           else if (colNext>col) pathD+=`h${distance}`
           else if (rowNext<row) pathD+=`v-${distance}`
           else if (rowNext>row) pathD+=`v${distance}`

        }

        return pathD
    }
}

export default  GridDraw