
class Event {
    constructor() {
        this._events = {};
    }

    $on(eventName, func) {
        let events = this._events[eventName];
        if (events) {
            events.push(func);
        } else {
            this._events[eventName] = [func];
        }
    }

    $off(eventName) {
        this._events[eventName] = null;
    }

    $once(eventName, func) {
        let ctx = this;
        function fn() {
            ctx.$off(eventName);
            func.apply(ctx, arguments);
        }
        ctx.$on(eventName, fn);
    }

    $emit(eventName, ...args) {
        let ctx = this;
        if (!ctx._events[eventName]) return;
        this._events[eventName].forEach(cb => cb.apply(ctx, args));
    }
}


let event = new Event();

event.$on('test', function(...args) {
    console.log('hahhhh' + args.join(' - '));
});

event.$emit('test');
event.$emit('test', 1, 2, 4);
event.$emit('test');


event.$once('change', function() {
    console.log('value had changed');
})
event.$emit('change');
event.$emit('change');
event.$emit('change');
event.$emit('change');