const EventTypes = Object.freeze({
    SetRobotPosition: 'SetRobotPosition',
    MoveRobot: 'MoveRobot',
    GetGrid: 'GetGrid',
    PassGrid: 'PassGrid',
    InvalidKeyPressed: 'InvalidKeyPressed',
    WrongDirection: 'WrongDirection',
    ValidKeyPressed: 'ValidKeyPressed',
    RobotDemension: 'RobotDemension',
    SetTreasure: 'SetTreasure',
    TreasureInitialized: 'TreasureInitialized',
    FoundTreasure: 'FoundTreasure',
});

export default EventTypes;
