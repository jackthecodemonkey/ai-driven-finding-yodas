class TaskQueue {
    constructor(concurrent = 1) {
        this.concurrent = concurrent;
        this.queue = [];
        this.running = 0;
        this.done = this.done.bind(this);
    }

    done() {
        this.running--;
        this.Run();
    }

    AddTask(fn) {
        return (...args) => {
            this.queue.push(() => {
                fn.apply(null, [...args, this.done]);
            });
            this.Run();
        }
    }

    Run() {
        if (this.queue.length && this.running < this.concurrent) {
            this.running++;
            const nextTask = this.queue.shift();
            if (nextTask) nextTask();
        }
    }
}

export default TaskQueue;
