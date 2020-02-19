class StatMonitor {
    constructor() {
        this.totalRobotMoves = 0;
        this.remainingTreasures = null;
    }

    IncrementRobotMove() {
        this.totalRobotMoves++;
    }

    DecrementTreasure() {
        if (this.remainingTreasures && this.remainingTreasures > 0) this.remainingTreasures--;
    }

    SetInitialTreasures(numOftreasures) {
        this.initialNumberOfTreasures = numOftreasures;
        this.remainingTreasures = numOftreasures;
    }

    ClearStats() {
        this.totalRobotMoves = 0;
        this.remainingTreasures = this.initialNumberOfTreasures || null;
    }
}

export default StatMonitor;
