const EventTypes = Object.freeze({
    SetRobotPosition: 'SetRobotPosition',
    MoveRobot: 'MoveRobot',
    BoardGrid: 'BoardGrid',
    RobotControllerInitialized: 'RobotControllerInitialized',
    RobotDemension: 'RobotDemension',
    SetTreasure: 'SetTreasure',
    TreasureInitialized: 'TreasureInitialized',
    FoundTreasure: 'FoundTreasure',
    RegenerateMap: 'RegenerateMap',
    ChangeMapSize: 'ChangeMapSize',
});

export default EventTypes;
