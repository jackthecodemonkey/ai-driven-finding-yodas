import { DFS, Algorithms } from './';

class PathAlgo {
    constructor(baseCells, gridSize) {
        this.baseCells = baseCells;
        this.gridSize = gridSize;
        this.nodes = null;
        this.currentNode = null;
        this.stack = [];
    }

    GetNewNodesFromBaseCells() {
        return this.baseCells.map(cell => {
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

    RestructPath() {
        let current = this.currentNode;
        let paths = [];
        while (current !== null) {
            paths.unshift({ i: current.i, j: current.j });
            current = current.parentNode;
        }
        return paths;
    }

    InitializePathAlgo(algoType) {
        this.nodes = this.GetNewNodesFromBaseCells();
        const AlgoClass = this.GetClassByName(algoType);
        return new AlgoClass(this.nodes, this.currentNode, this.stack, this.gridSize);
    }

    FindPath({ x: fromY, y: fromX }, { x: toY, y: toX }, algoType = Algorithms.DFS) {
        const pathFinder = this.InitializePathAlgo(algoType);
        this.currentNode = pathFinder.GetPath({ x: fromY, y: fromX }, { x: toY, y: toX });
        return this.RestructPath();
    }

    GetShortestDestinationFromCurrent(everyDestinations, fromX, fromY , algoType = Algorithms.DFS) {
        const pathFinder = this.InitializePathAlgo(algoType);
        const path = pathFinder.GetShortestDestinationFromCurrent(everyDestinations, fromX, fromY);
    }

    GetClassByName(algoType) {
        switch (algoType) {
            case Algorithms.DFS: {
                return DFS;
            }

            default: {
                return DFS;
            }
        }
    }
}

export default PathAlgo;
