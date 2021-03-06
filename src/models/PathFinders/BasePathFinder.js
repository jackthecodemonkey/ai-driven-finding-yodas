class BasePathFinder {
    constructor(nodes, currentNode, stack, gridSize) {
        this.gridSize = gridSize;
        this.nodes = nodes;
        this.currentNode = currentNode;
        this.stack = stack;
    }

    /**
     * @everyDestinations Array of path object {x,y}
     * Find the shortest destination among everyDestinations from (X,Y)
     * @return Array of path object which direct from(x,y) to the destination
     */
    GetDestinationFromCurrent(everyDestinations, fromX, fromY) {
        throw new Error("Derived class must implement GetDestinationFromCurrent method");
    }

    GetCellIndex(i, j, grid) {
        return i * grid + j;
    }

    GetAllNeigbors(cell = this.currentNode, nodes = this.nodes, gridX = this.gridSize) {
        const unvisitedNeigbors = [];
        const { i, j } = cell;
        const top = i - 1 >= 0 && nodes[this.GetCellIndex(i - 1, j, gridX)];
        const right = j + 1 < gridX && nodes[this.GetCellIndex(i, j + 1, gridX)];
        const bottom = i + 1 < gridX && nodes[this.GetCellIndex(i + 1, j, gridX)];
        const left = j - 1 >= 0 && nodes[this.GetCellIndex(i, j - 1, gridX)];

        if (top && !top.visited) unvisitedNeigbors.push(top);
        if (right && !right.visited) unvisitedNeigbors.push(right);
        if (bottom && !bottom.visited) unvisitedNeigbors.push(bottom);
        if (left && !left.visited) unvisitedNeigbors.push(left);

        return unvisitedNeigbors;
    }

    RestructPath(currentNode) {
        let current = currentNode;
        let paths = [];
        while (current !== null) {
            paths.unshift({ y: current.i, x: current.j });
            current = current.parentNode;
        }
        return paths;
    }

    GetNeigborsOfCurrentCell(unvisitedNeigbors) {
        if (unvisitedNeigbors.length === 1) return unvisitedNeigbors[0]
        const c = Math.round(Math.random(0, unvisitedNeigbors.length - 1));
        const n = unvisitedNeigbors[c];
        return n;
    }

    GetIndexOfMovablePath(i = this.currentNode.i, j = this.currentNode.j, walls = this.currentNode.walls) {
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

    GetFilteredNeigbors(allNeigbors, possibleIndexes) {
        return allNeigbors.filter(neigbor => {
            return possibleIndexes.find(index => index.i === neigbor.i && index.j === neigbor.j);
        })
    }

    GetDirection(nextI, nextJ, currentI, currentJ) {
        if (nextI > currentI) return [2, 0]; // current: remove top, next remove bottom
        if (nextI < currentI) return [0, 2]; // current: remove bottom, next remove top
        if (nextJ < currentJ) return [3, 1]; // current: remove left, next remove right
        if (nextJ > currentJ) return [1, 3]; // current: remove right, next remove left
    }
}

export default BasePathFinder;
