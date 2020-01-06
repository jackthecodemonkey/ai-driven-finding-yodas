class Cell {
    constructor(cell = {}) {
        this.width = cell.width;
        this.height = cell.height;
        this.gridIndex = cell.gridIndex;
        this.gridX = cell.gridX;
        this.j = cell.gridIndex % cell.gridX;
        this.i = Math.floor(cell.gridIndex / cell.gridX);
        this.visited = false;
        this.ShouldDisplayTop = this.ShouldShowBorderTop();
        this.ShouldDisplayLeft = this.ShouldShowBorderLeft();
        this.walls = [true, true, true, true];
    }

    ShouldShowBorderTop() {
        return this.gridIndex < this.gridX;
    }

    ShouldShowBorderLeft() {
        return (this.gridIndex % this.gridX) === 0
    }

    Clone() {
        return new Cell({
            width: this.width,
            height: this.height,
            gridIndex: this.gridIndex,
            gridX: this.gridX,
            j: this.j,
            i: this.i,
            visited: this.visited,
        })
    }
}

export default Cell;
