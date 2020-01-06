const Event = () => {
    let events = {};
    return {
        on: (eventName, fn) => {
            if (!events[eventName]) events[eventName] = [];
            events[eventName].push(fn);
            return this;
        },
        off: (eventName = null) => {
            if (eventName) events[eventName] = [];
            return this;
        },
        clear: () => {
            events = {};
        },
        emit: (eventName, ...args) => {
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
