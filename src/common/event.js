const Event = () => {
    let events = {};
    return {
        on: function (eventName, fn) {
            if (!events[eventName]) events[eventName] = [];
            events[eventName].push(fn);
            return this;
        },
        off: function (eventName = null) {
            if (eventName) events[eventName] = [];
            return this;
        },
        clear: function () {
            events = {};
        },
        emit: function (eventName, ...args) {
            if (eventName && events[eventName] && events[eventName].length) {
                events[eventName].forEach((fn) => {
                    setTimeout(() => { fn(...args); });
                });
            }
            return this;
        },
        getEvent: () => events,
    };
};

export default Event;
