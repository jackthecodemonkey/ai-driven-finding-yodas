import Cell from './Cell';
import { BasePathFinder, PathAlgo } from './PathFinders';

class Grid extends BasePathFinder {
    constructor(board = {}) {
        super();
        this.gridWidth = board.gridWidth || 80;
        this.gridHeight = board.gridHeight || 80;
        this.gridX = board.gridX || 9;
        this.gridY = board.gridY || 9;
        this.validateGrid();

        this.totalGridCells = this.gridX * this.gridY;
        this.gridCells = this.initializeGridCells();
        this.flattenCells = this.gridCells.flat();

        this.currentCell = null;

        this.stack = [];
        this.GenerateMaze();
    }

    get BoardGridCells() {
        return this.gridCells;
    }

    IsInValidMove(x, y) {
        return (x < 0)
            || (x >= this.gridX)
            || (y < 0)
            || (y >= this.gridY)
    }

    GetDestinationFromCurrent(everyDestinations, fromX, fromY) {
        return new PathAlgo(this.flattenCells, this.gridX).GetDestinationFromCurrent(everyDestinations, fromX, fromY);
    }

    GenerateMaze() {
        const initialCell = this.flattenCells[0];
        initialCell.visited = true;
        this.stack.push(initialCell);
        while (this.stack.length) {
            this.currentCell = this.stack.pop();
            const allNeigbors = this.GetAllNeigbors(this.currentCell, this.flattenCells, this.gridX);
            if (allNeigbors.length) {
                this.stack.push(this.currentCell);
                const next = this.GetNeigborsOfCurrentCell(allNeigbors);
                const { i: nextI, j: nextJ } = next;
                const { i: currentI, j: currentJ } = this.currentCell;
                const [currentNodeWall, nextNodeWall] = this.GetDirection(nextI, nextJ, currentI, currentJ);
                this.currentCell.walls[currentNodeWall] = false;
                next.walls[nextNodeWall] = false;
                next.visited = true;
                next.parentNode = this.currentCell;
                this.stack.push(next);
            }
        }
    }

    GetCurrentCellWalls(i, j) {
        const cellIndex = this.GetCellIndex(i, j, this.gridX);
        const currentCell = this.flattenCells[cellIndex];
        return currentCell.walls;
    }

    initializeGridCells() {
        return Array(this.totalGridCells)
            .fill(0)
            .reduce((acc, next, index) => {
                if (!acc[index % this.gridX]) acc[index % this.gridX] = [];
                acc[Math.floor(index / this.gridX)].push(new Cell({
                    width: this.gridWidth,
                    height: this.gridHeight,
                    gridIndex: index,
                    gridX: this.gridX,
                }))
                return acc;
            }, Array(this.gridX))
    }

    validateGrid() {
        if (this.gridX !== this.gridY) {
            throw new Error("Invalid grid values. Expected Grid X and Y value is equal");
        }
    }
}

export default Grid;
