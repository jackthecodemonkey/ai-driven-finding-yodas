class FasterMove {
    constructor(start, paths) {
        this.start = start;
        this.paths = paths;
    }

    /**
     * Get an array like this
     * [
     *   {x:0,y:0},
     *   {x:0,y:1},
     *   {x:0,y:2},
     *   {x:0,y:3},
     *   {x:0,y:4},
     *   {x:1,y:4},
     *   {x:2,y:4},
     *   {x:3,y:4},
     *   {x:4,y:4},
     * ]
     * 
     * returns [
     *   {x:0, y:0},
     *   {x:0, y:4},
     *   {x:1, y:4},
     *   {x:4, y:4},
     * ]
     * 
     * It reduces a number of straight paths
     * Refactoring required :( remove dups 
     */
    GetReducedPath(start = this.start, arr = this.paths, acc = []) {
        if (!start) return acc;
        let { x: currentX, y: currentY } = start;
        for (let ix = 0; ix < arr.length; ix++) {
            const { x, y } = arr[ix];
            if (x === currentX) {
                const nextPaths = arr.slice(ix + 1);
                let i;
                for (i = 0; i < nextPaths.length; i++) {
                    if (nextPaths[i]['x'] !== currentX) {
                        i -= 1;
                        break;
                    }
                }
                if (i > 0 && i === nextPaths.length) i -= 1;
                if (i > -1) {
                    return this.GetReducedPath(nextPaths[i] || arr[ix], nextPaths.slice(i + 1), [...acc, start]);
                } else {
                    const nextPaths = arr.slice(ix);
                    return this.GetReducedPath(nextPaths[0], nextPaths.slice(ix + 1), [...acc, start])
                }
            } else if (y === currentY) {
                const nextPaths = arr.slice(ix + 1);
                let i;
                for (i = 0; i < nextPaths.length; i++) {
                    if (nextPaths[i]['y'] !== currentY) {
                        i -= 1;
                        break;
                    }
                }
                if (i > 0 && i === nextPaths.length) i -= 1;
                if (i > -1) {
                    return this.GetReducedPath(nextPaths[i] || arr[ix], nextPaths.slice(i + 1), [...acc, start]);
                } else {
                    const nextPaths = arr.slice(ix);
                    return this.GetReducedPath(nextPaths[0], nextPaths.slice(ix + 1), [...acc, start])
                }
            } else {
                const nextPaths = arr.slice(ix);
                return this.GetReducedPath(nextPaths[0], nextPaths.slice(ix + 1), [...acc, start])
            }
        }
        if (start) acc.push(start);
        return acc;
    }
}

export default FasterMove;
