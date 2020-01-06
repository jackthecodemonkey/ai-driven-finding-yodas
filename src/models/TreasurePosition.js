class TreasurePosition {
    constructor(robotX, robotY, gridX) {
        this.robotX = robotX;
        this.robotY = robotY;
        this.gridX = gridX;
        this.tresurePositions = [];
    }

    RemoveTreasue(deletedX, deletedY) {
        this.tresurePositions = this.tresurePositions.filter(({ x, y }) => !(x === deletedX && y === deletedY));
    }

    GetPositionPixels(width) {
        return this.tresurePositions.map(({ x, y }) => { return { left: x * width + x, top: y * width + y, demension: width } });
    }

    GetRandomPositionOfTresure(noOfTresures = 1, width) {
        const takenPositions = [{ x: this.robotX, y: this.robotY }];
        this.tresurePositions = [];
        const GetTreasurePosition = (min, max) => {
            return Math.round(Math.random() * (max - min) + min);
        }
        while (this.tresurePositions.length < noOfTresures) {
            const newX = GetTreasurePosition(0, this.gridX - 1);
            const newY = GetTreasurePosition(0, this.gridX - 1);
            const hasSame = takenPositions.filter(position => position.x === newX && position.y === newY);
            if (!hasSame.length) {
                takenPositions.push({ x: newX, y: newY });
                this.tresurePositions.push({ x: newX, y: newY })
            }
        }
        return this.GetPositionPixels(width);
    }
}

export default TreasurePosition;
