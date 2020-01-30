import BasePathFinder from './BasePathFinder';

class DFS extends BasePathFinder {
    constructor(nodes, currentNode, stack, gridSize) {
        super();
        this.gridSize = gridSize;
        this.nodes = nodes;
        this.currentNode = currentNode;
        this.stack = stack;
    }

    IsDestination(toX, toY) {
        return this.currentNode.i === toY && this.currentNode.j === toX
    }

    GetShortestDestinationFromCurrent(everyDestinations, fromX, fromY) {
        const currentNode = this.nodes[this.GetCellIndex(fromY, fromX, this.gridSize)];
        const temp = [];
        currentNode.visited = true;
        this.stack.push(currentNode);
        while (this.stack.length) {
            this.currentNode = this.stack.pop();
            const IsOneOfDestinations = everyDestinations.find(({ x, y }) => {
                return x === this.currentNode.j && y === this.currentNode.i
            });
            if (IsOneOfDestinations) {
                let current = { ...this.currentNode };
                let paths = [];
                while (current !== null) {
                    paths.unshift({ y: current.i, x: current.j });
                    current = current.parentNode;
                }
                temp.push(paths)
                continue;
            }

            const filteredNeighbors = this.GetFilteredNeigbors(
                this.GetAllNeigbors(this.currentNode, this.nodes, this.gridSize),
                this.GetIndexOfMovablePath(this.currentNode.i, this.currentNode.j, this.currentNode.walls)
            );
            if (filteredNeighbors.length) this.GetPathByDFS(filteredNeighbors)
        }
        temp.sort((a, b) => {
            return a.length - b.length;
        })

        return temp[0];
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
