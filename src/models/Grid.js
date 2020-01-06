import Cell from './Cell';

class Grid {
    constructor(board = {}) {
        this.gridWidth = board.gridWidth || 100;
        this.gridHeight = board.gridHeight || 100;
        this.gridX = board.gridX || 5;
        this.gridY = board.gridY || 5;
        this.validateGrid();

        this.totalGridCells = this.gridX * this.gridY;
        this.gridCells = this.initializeGridCells();
        this.flattenCells = this.gridCells.flat();

        this.currentCell = null;

        this.stack = [];
        this.GenerateMaze();
    }

    get GetGridCells() {
        return this.gridCells;
    }

    GetDirection(nextI, nextJ, currentI, currentJ) {
        if (nextI > currentI) return [2, 0]; // current: remove top, next remove bottom
        if (nextI < currentI) return [0, 2]; // current: remove bottom, next remove top
        if (nextJ < currentJ) return [3, 1]; // current: remove left, next remove right
        if (nextJ > currentJ) return [1, 3]; // current: remove right, next remove left
    }

    GenerateMaze() {
        const initialCell = this.flattenCells[0];
        initialCell.visited = true;
        this.stack.push(initialCell);
        while (this.stack.length) {
            this.currentCell = this.stack.pop();
            const allNeigbors = this.GetAllNeigbors(this.currentCell);
            if (allNeigbors.length) {
                this.stack.push(this.currentCell);
                const next = this.GetNeigborsOfCurrentCell(allNeigbors);
                const { i: nextI, j: nextJ } = next;
                const { i: currentI, j: currentJ } = this.currentCell;
                const [currentNodeWall, nextNodeWall] = this.GetDirection(nextI, nextJ, currentI, currentJ);
                this.currentCell.walls[currentNodeWall] = false;
                next.walls[nextNodeWall] = false;
                next.visited = true;
                this.stack.push(next);
            }
        }
    }

    GetCellIndex(i, j) {
        return i * this.gridX + j;
    }

    GetCurrentCellWalls(i, j) {
        const cellIndex = this.GetCellIndex(i, j);
        const currentCell = this.flattenCells[cellIndex];
        return currentCell.walls;
    }

    GetNeigborsOfCurrentCell(unvisitedNeigbors) {
        if(unvisitedNeigbors.length === 1) return unvisitedNeigbors[0]
        const c = Math.round(Math.random(0, unvisitedNeigbors.length - 1));
        const n = unvisitedNeigbors[c];
        return n;
    }

    GetAllNeigbors(cell) {
        const unvisitedNeigbors = [];
        const { i, j } = cell;
        const top = i - 1 >= 0 && this.flattenCells[this.GetCellIndex(i - 1, j)];
        const right = j + 1 < this.gridX && this.flattenCells[this.GetCellIndex(i, j + 1)];
        const bottom = i + 1 < this.gridX && this.flattenCells[this.GetCellIndex(i + 1, j)];
        const left = j - 1 >= 0 && this.flattenCells[this.GetCellIndex(i, j - 1)];

        if (top && !top.visited) unvisitedNeigbors.push(top);
        if (right && !right.visited) unvisitedNeigbors.push(right);
        if (bottom && !bottom.visited) unvisitedNeigbors.push(bottom);
        if (left && !left.visited) unvisitedNeigbors.push(left);

        return unvisitedNeigbors;
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
