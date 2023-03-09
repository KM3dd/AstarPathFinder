import { generateQueryConstructor } from '../Utils/object.utils.js'
import AStarFinder from '../../libFromGitHub/AStarFinder.js'
import PathFindingGrid from '../../libFromGitHub/Grid.js'
class GridPathFinder{
    constructor(){
        generateQueryConstructor.call(this, ...arguments)
    }

    generateHelperGrid(){
         const {grid:{gridCells, numRows, numCols}} = this
         const helperGrid=[]
        console.log(gridCells)
         for(let i=0; i<numRows;i++){ // rows
            const helperRow =[]
            for(let j=0;j<numCols;j++){ // cols
                const position=`${i}-${j}`
                const cell=gridCells[position]
                helperRow.push(cell.isBlocked ? 1 : 0)
            }
            helperGrid.push(helperRow)

         }
         return helperGrid

    }

    generateHelperPath(){
        const helperGrid = this.generateHelperGrid()
        const pathFindingGrid = new PathFindingGrid(helperGrid)
        console.log(this)
        const outColRow= this.generateColRow(this.outCell.position) //our start node col and row
        const inColRow = this.generateColRow(this.inCell.position) //our target node col and row

        const aStarFinderConfig={
            weight: 5000

        }
        const aStarFinder = new AStarFinder(aStarFinderConfig)
        const helperPath= aStarFinder.findPath(
            ...outColRow,
            ...inColRow,
            pathFindingGrid
        )
            return helperPath

    }

    generateColRow(position){
        return position.split('-').map(item=> parseInt(item)).reverse()
    }
}

export default  GridPathFinder