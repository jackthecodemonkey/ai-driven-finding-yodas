class MinimizeMove {
    constructor(start, paths) {
        this.start = start;
        this.paths = paths;
    }

    GetReducedPath(start = this.start, arr = this.paths, acc = []) {
        if (!start) return acc;
        let { x: currentX, y: currentY } = start;
        for (let ix = 0; ix < arr.length; ix++) {
            const { x, y } = arr[ix];
            if (x === currentX) {
                const tempArr = arr.slice(ix + 1);
                let i;
                for (i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].x !== currentX) {
                        i -= 1;
                        break;
                    }
                }
                if (i > 0 && i === tempArr.length) i -= 1;
                if (i > -1) {
                    acc = [...acc, start];

                    return this.GetReducedPath(tempArr[i] || arr[ix], tempArr.slice(i + 1), acc);
                } else {
                    const tempArr = arr.slice(ix);
                    acc = [...acc, start];
                    return this.GetReducedPath(tempArr[0], tempArr.slice(ix + 1), acc)
                }
            } else if (y === currentY) {
                const tempArr = arr.slice(ix + 1);
                let i;
                for (i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].y !== currentY) {
                        i -= 1;
                        break;
                    }
                }
                if (i > 0 && i === tempArr.length) i -= 1;
                if (i > -1) {
                    acc = [...acc, start];
                    return this.GetReducedPath(tempArr[i] || arr[ix], tempArr.slice(i + 1), acc);
                } else {
                    const tempArr = arr.slice(ix);
                    acc = [...acc, start];
                    return this.GetReducedPath(tempArr[0], tempArr.slice(ix + 1), acc)
                }
            } else {
                const tempArr = arr.slice(ix);
                acc = [...acc, start];
                return this.GetReducedPath(tempArr[0], tempArr.slice(ix + 1), acc)
            }
        }
        if (start) acc.push(start);
        return acc;
    }
}

export default MinimizeMove;
