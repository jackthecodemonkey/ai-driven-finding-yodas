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
        const pp = [];
        this.stack.push(currentNode);
        while (this.stack.length) {
            this.currentNode = this.stack.pop();

            const IsOneOfDestinations = everyDestinations.find(({ x, y }) => {
                return x === this.currentNode.j && y === this.currentNode.i
            });

            const filteredNeighbors = this.GetFilteredNeigbors(
                this.GetAllNeigbors(this.currentNode, this.nodes, this.gridSize),
                this.GetIndexOfMovablePath(this.currentNode.i, this.currentNode.j, this.currentNode.walls)
            );
            if (filteredNeighbors.length) {
                this.GetPathByDFS(filteredNeighbors)
            }

            if (IsOneOfDestinations) {
                let current = { ...this.currentNode };
                let paths = [];
                while (current !== null) {
                    paths.unshift({ y: current.i, x: current.j });
                    current = current.parentNode;
                }

                if (paths.find(p => p.x === fromX && p.y === fromY)) {
                    const hasDestPreviousDest = paths.filter(p => pp.find(preP => (p.x === preP.dest.j && p.y === preP.dest.i)))
                    if (!hasDestPreviousDest.length) {
                        pp.push({
                            dest: { ...this.currentNode },
                            total: paths.length,
                        })
                    } else {
                        const pre = hasDestPreviousDest[0];
                        pp.forEach((p) => {
                            if (p.dest.i === pre.y && p.dest.j === pre.x) {
                                p.total += paths.length
                            }
                        })
                    }
                }

                temp.push(paths)
            }
        }
        temp.sort((a, b) => {
            return a.length - b.length;
        })

        pp.sort((a, b) => {
            return a.total - b.total;
        })
        const short = temp.find(t => t[t.length - 1].y === pp[0].dest.i && t[t.length - 1].x === pp[0].dest.j)
        return short ? short : temp[0];
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
