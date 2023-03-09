import { generateQueryConstructor } from '../Utils/object.utils.js'

class GridCell{
    constructor(){
        generateQueryConstructor.call(this, ...arguments)
    }
    get position(){
        return `${this.row}-${this.col}`
    }

    render(){
        this.#renderElement()
        this.#renderGridCell()
        this.#renderHTML()
        this.#renderOutInCells()
        this.#renderEvents()
    }
    #renderElement(){
        const {grid:{gridElement}}=this
        const gridcellElement=document.createElement('div')
        gridcellElement.classList.add('gridcell') 
        gridcellElement.setAttribute('position', this.position)
        gridElement.append(gridcellElement)
        this.gridcellElement = gridcellElement
    }
    
    #renderGridCell(){
        const {grid:{numCols , numRows}} =this
       
        this.isBlocked=false
        this.isOutCell=this.position ==='0-0'
        this.isInCell =this.position ===`${numRows -1}-${numCols-1}`
    }
    
    #renderHTML(){
        const {gridcellElement,grid:{settings:{cellSize,borderSize,borderColor}}}=this
       
        Object.assign(gridcellElement.style, {
            width : `${cellSize}px`,
            height : `${cellSize}px`,
            border : `${borderSize}px solid ${borderColor}`
        })

        gridcellElement.setAttribute('draggable', true)
    }
    
    #renderOutInCells(){
        this.gridcellElement.classList[this.isInCell ? 'add' : 'remove']('inCell')
        this.gridcellElement.classList[this.isOutCell ? 'add' : 'remove']('outCell')

    }

    renderBlockedCells(){
        this.gridcellElement.classList[this.isBlocked ? 'add' : 'remove']('blocked')
    }
    
    //////////////////////////////////////

    #renderEvents(){
        this.#renderClickEvents()
        this.#renderHoverEvents()
        this.#renderDragDropEvents()
    }

    
    #renderClickEvents(){
        const{gridcellElement}=this

        gridcellElement.addEventListener('click', _=>{
            if(this.isOutCell || this.isInCell) return
           
            this.isBlocked= !this.isBlocked
            this.renderBlockedCells()
            this.grid.draw()
        })
    }
    #renderHoverEvents(){
        const{gridcellElement}=this
        gridcellElement.addEventListener('mouseover',_=>{
            if(this.isOutCell || this.isInCell){
                gridcellElement.style.cursor='grab'
            } else if (! this.isBlocked){
                gridcellElement.style.cursor='pointer'
            } else{
                gridcellElement.style.cursor='crosshair'
            }
        })
    }
    #renderDragDropEvents(){
        const {gridcellElement,grid}=this
        gridcellElement.addEventListener('dragover',event =>{
            if(dontAllowDrop(this)) return
            event.preventDefault()
        })

        gridcellElement.addEventListener('dragstart', event=>{
            if(dontAllowDrag(this)){
                event.preventDefault()
                return
            }
            grid.draggedGridcell= this
        })

        gridcellElement.addEventListener('drop', _=>{
            this.resetCell()
            this.isOutCell=grid.draggedGridcell.isOutCell
            this.isInCell=grid.draggedGridcell.isInCell
            this.#renderOutInCells()
            grid.draggedGridcell.resetCell()
            grid.draw()
        })

        function dontAllowDrag(obj){
            return(!obj.isOutCell && !obj.isInCell)
        }
        function dontAllowDrop(obj){
            const { gridcellElement ,grid}=obj

            if(grid.draggedGridcell.gridcellElement === gridcellElement) return true
            if(grid.draggedGridcell.isOutCell && obj.isInCell ) return true
            if(grid.draggedGridcell.isInCell && obj.isOutCell ) return true
        }
    }

    resetCell(){
        this.isInCell=false
        this.isOutCell=false
        this.isBlocked=false

        this.#renderOutInCells()
        this.renderBlockedCells()
    }

}

export default GridCell
