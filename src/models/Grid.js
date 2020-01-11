import Cell from './Cell';

const Algorithms = Object.freeze({
    DFS: 'DFS',
    BFS: 'BFS',
    ASTAR: 'ASTAR',
})

class PathAlgo {
    constructor() {
        this.nodes = null;
        this.currentNode = null;
        this.stack = [];
    }

    InitializeNodes() {
        this.nodes = this.GetNewNodesFromCurrentCells();
    }

    RestructPath() {
        let current = this.currentNode;
        let paths = [];
        while (current !== null) {
            paths.unshift({ i: current.i, j: current.j });
            current = current.parentNode;
        }
        return paths;
    }

    FindShortestPath({ x: fromY, y: fromX }, { x: toY, y: toX }, algoType = Algorithms.DFS) {
        this.InitializeNodes();
        const currentNodeIndex = this.GetCellIndex(fromX, fromY);
        const currentNode = this.nodes[currentNodeIndex];

        currentNode.visited = true;
        this.stack.push(currentNode);
        while (this.stack.length) {
            this.currentNode = this.stack.pop();
            if (this.currentNode.i === toX && this.currentNode.j === toY) {
                break;
            }
            const allNeigbors = this.GetAllNeigbors(this.currentNode, this.nodes);
            const possibleIndexes = this.GetIndexOfMovablePath(this.currentNode.i, this.currentNode.j, this.currentNode.walls)
            const filteredNeighbors = this.GetFilteredNeigbors(allNeigbors, possibleIndexes);
            if (filteredNeighbors.length) {
                this.stack.push(this.currentNode);
                const next = this.GetNeigborsOfCurrentCell(filteredNeighbors);
                const { i: nextI, j: nextJ } = next;
                const { i: currentI, j: currentJ } = this.currentNode;
                const [currentNodeWall, nextNodeWall] = this.GetDirection(nextI, nextJ, currentI, currentJ);
                this.currentNode.walls[currentNodeWall] = false;
                next.walls[nextNodeWall] = false;
                next.visited = true;
                next.parentNode = this.currentNode;
                this.stack.push(next);
            }
        }
        return this.RestructPath();

    }
}


class Grid extends PathAlgo {
    constructor(board = {}) {
        super();
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

    GetPathFromTo(from, to) {
        return this.FindShortestPath(from, to);
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

    GetFilteredNeigbors(allNeigbors, possibleIndexes) {
        return allNeigbors.filter(neigbor => {
            return possibleIndexes.find(index => index.i === neigbor.i && index.j === neigbor.j);
        })
    }

    GetIndexOfMovablePath(i, j, walls) {
        return walls.reduce((acc, next, index) => {
            if (next === false) {
                let nextI = i;
                let nextJ = j;
                switch (index) {
                    case 0: nextI = nextI - 1; break;
                    case 1: nextJ = nextJ + 1; break;
                    case 2: nextI = nextI + 1; break;
                    case 3: nextJ = nextJ - 1; break;
                }
                acc.push({ i: nextI, j: nextJ });
            }
            return acc;
        }, [])
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
        if (unvisitedNeigbors.length === 1) return unvisitedNeigbors[0]
        const c = Math.round(Math.random(0, unvisitedNeigbors.length - 1));
        const n = unvisitedNeigbors[c];
        return n;
    }

    GetAllNeigbors(cell, nodes = this.flattenCells) {
        const unvisitedNeigbors = [];
        const { i, j } = cell;
        const top = i - 1 >= 0 && nodes[this.GetCellIndex(i - 1, j)];
        const right = j + 1 < this.gridX && nodes[this.GetCellIndex(i, j + 1)];
        const bottom = i + 1 < this.gridX && nodes[this.GetCellIndex(i + 1, j)];
        const left = j - 1 >= 0 && nodes[this.GetCellIndex(i, j - 1)];

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

    GetNewNodesFromCurrentCells() {
        return this.flattenCells.map(cell => {
            return {
                j: cell.j,
                i: cell.i,
                parentNode: null,
                visited: false,
                gridIndex: cell.gridIndex,
                walls: cell.walls,
            }
        })
    }
}

export default Grid;
