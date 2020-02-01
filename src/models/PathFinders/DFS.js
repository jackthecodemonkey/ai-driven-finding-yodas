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

    IsOneOfDestinations(destinations) {
        return destinations.find(({ x, y }) => this.IsDestination(x,y));
    }
    
    GetShortestDestinationFromCurrent(everyDestinations, fromX, fromY) {
        const currentNode = this.nodes[this.GetCellIndex(fromY, fromX, this.gridSize)];
        const directionPaths = [];
        const nearestDests = [];
        currentNode.visited = true;
        this.stack.push(currentNode);
        while (this.stack.length) {
            this.currentNode = this.stack.pop();
            
            const filteredNeighbors = this.GetFilteredNeigbors(
                this.GetAllNeigbors(this.currentNode, this.nodes, this.gridSize),
                this.GetIndexOfMovablePath(this.currentNode.i, this.currentNode.j, this.currentNode.walls)
            );

            if (filteredNeighbors.length) this.GetPathByDFS(filteredNeighbors)

            if (this.IsOneOfDestinations(everyDestinations)) {
                let paths = this.RestructPath({ ...this.currentNode });

                if (paths.find(p => p.x === fromX && p.y === fromY)) {
                    const hasDestPreviousDest = paths.filter(p => nearestDests.find(preP => (p.x === preP.dest.j && p.y === preP.dest.i)))
                    if (!hasDestPreviousDest.length) /* This node is the first branch from root */ {
                        nearestDests.push({
                            dest: { ...this.currentNode },
                            total: paths.length,
                        })
                    } else { /* The node has parent node which was one of destinations. we sum paths length */
                        nearestDests.forEach((p) => {
                            if (p.dest.i === hasDestPreviousDest[0].y && p.dest.j === hasDestPreviousDest[0].x) {
                                p.total += paths.length
                            }
                        })
                    }
                }
                directionPaths.push(paths)
            }
        }

        nearestDests.sort((a, b) => {
            return a.total - b.total;
        })
        const short = directionPaths.find(t => t[t.length - 1].y === nearestDests[0].dest.i && t[t.length - 1].x === nearestDests[0].dest.j)
        return short ? short : directionPaths[0];
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
