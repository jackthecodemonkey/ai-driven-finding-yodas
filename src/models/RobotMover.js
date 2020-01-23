import Direction from './Direction';

class RobotMover {
    constructor(initialX, initialY) {
        this.x = initialX || 0;
        this.y = initialY || 0;
        this.currentDirection = null;
    }

    SetPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    ValidateKeyCode(keyCode) {
        return keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40
    }

    CanRobotMove(keyCode, grid) {
        let validMovement = true;
        const [top, right, bottom, left] = grid.GetCurrentCellWalls(this.y, this.x);
        switch (keyCode) {
            case 37: { if (this.x <= 0 || left) validMovement = false; break; }
            case 38: { if (this.y <= 0 || top) validMovement = false; break; }
            case 39: { if (this.x >= grid.gridX - 1 || right) validMovement = false; break; }
            case 40: { if (this.y >= grid.gridX - 1 || bottom) validMovement = false; break; }
            default: validMovement = false;
        }
        return validMovement;
    }

    GetCurrentPosition(width, height) {
        return {
            left: this.x * width + this.x,
            top: this.y * height + this.y,
        }
    }

    UpdateRobotPosition(keyCode) {
        if (keyCode === 37) this.x -= 1;
        if (keyCode === 38) this.y -= 1;
        if (keyCode === 39) this.x += 1;
        if (keyCode === 40) this.y += 1;
        return this;
    }

    UpdateDirection(keyCode) {
        if (keyCode === 37) this.currentDirection = Direction.LEFT;
        if (keyCode === 38) this.currentDirection = Direction.UP;
        if (keyCode === 39) this.currentDirection = Direction.RIGHT;
        if (keyCode === 40) this.currentDirection = Direction.DOWN;
        return this;
    }
}

export default RobotMover;
