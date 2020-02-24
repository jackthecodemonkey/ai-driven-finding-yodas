const MapType = Object.freeze({
    MAZE: 'MAZE',
})

const MapSizeSelectOptions = {
    Default: {
        display: "Small",
        value: "Default",
    },
    Mid: {
        display: "Medium",
        value: "MD"
    },
    Lg: {
        display: "Large",
        value: "LG"
    }
};

const Default = [9, 9, 80, 80, MapType.MAZE];

const MD = [12, 12, 60, 60, MapType.MAZE];

const LG = [15, 15, 50, 50, MapType.MAZE];

const getObject = ([gridX, gridY, gridWidth, gridHeight, mapType]) => ({
    gridWidth,
    gridHeight,
    gridX,
    gridY,
    mapType,
})

const MapOptions = {
    Default: getObject(Default),
    MD: getObject(MD),
    LG: getObject(LG),
}

export {
    MapType,
    MapOptions,
    MapSizeSelectOptions,
}