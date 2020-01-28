import BasePathFinder from './BasePathFinder';

class DFS extends BasePathFinder {
    constructor(nodes, currentNode, stack, gridSize) {
        super();
        this.gridSize = gridSize;
        this.nodes = nodes;
        this.currentNode = currentNode;
        this.stack = stack;
    }

    GetPath({ x: fromY, y: fromX }, { x: toY, y: toX }) {
        const currentNode = this.nodes[this.GetCellIndex(fromX, fromY, this.gridSize)];
        currentNode.visited = true;
        this.stack.push(currentNode);
        while (this.stack.length) {
            this.currentNode = this.stack.pop();
            if (this.IsDestination(toX, toY)) break;
            const filteredNeighbors = this.GetFilteredNeigbors(
                this.GetAllNeigbors(this.currentNode, this.nodes, this.gridSize),
                this.GetIndexOfMovablePath(this.currentNode.i, this.currentNode.j, this.currentNode.walls)
            );
            if (filteredNeighbors.length) this.GetPathByDFS(filteredNeighbors)
        }
        return this.currentNode;
    }

    IsDestination(toX, toY) {
        return this.currentNode.i === toX && this.currentNode.j === toY
    }

    // Find shortest destination(x,y) from all possible destination (array) with from x,y
    // using dfs,  
    // return all path from current position to the selected destination
    // and this will replace logic written in MoveToTreasure ( GetPathFromTo )
    GetShortestDestinationFromCurrent(everyDestinations, fromX, fromY) {
        console.log(everyDestinations, fromX, fromY)
    }

    GetPathByDFS(neighbors) {
        this.stack.push(this.currentNode);
        const next = this.GetNeigborsOfCurrentCell(neighbors);
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

export default DFS;
