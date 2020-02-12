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

    InitializePathAlgo(algoType) {
        this.nodes = this.GetNewNodesFromBaseCells();
        const AlgoClass = this.GetClassByName(algoType);
        return new AlgoClass(this.nodes, this.currentNode, this.stack, this.gridSize);
    }

    GetDestinationFromCurrent(everyDestinations, fromX, fromY , algoType = Algorithms.DFS) {
        const pathFinder = this.InitializePathAlgo(algoType);
        return pathFinder.GetDestinationFromCurrent(everyDestinations, fromX, fromY);
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
