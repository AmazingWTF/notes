class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        if (index >= 0) {
            this.subs.splice(index, 1);
        }
    }

    notify() {
        // this.subs.forEach(func => func(newVal, oldVal);
        this.subs.forEach(watcher => watcher.update());
    }
}
Dep.target = null;

let defineReactive = function(obj, key, value) {
    let dep = new Dep();
    observe(value);
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function() {
            if (Dep.target) {
                dep.addSub(Dep.target);
                Dep.target.addDep(dep);
            }
            return value;
        },
        set: function(newVal) {
            if (newVal !== value) {
                value = newVal;
                dep.notify();
            }
        }
    })
}

class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })
    }

    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]]);
        }
    }
}

function observe(value) {
    if (typeof obj !== 'object') {
        return;
    }
    let ob;
    if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (Object.isExtensible(value)) {
        ob = new Observer(value);
    }
    return ob;
}

class Watcher {
    constructor(obj, getter, callback) {
        this.obj = obj;
        this.getter = getter;
        this.cb = callback;
        this.deps = [];
        // this.value = undefined;
        this.value = this.get();
    }

    // 将当前watcher实例赋值给Dep.target，完成依赖收集
    get() {
        Dep.target = this;
        let value = this.getter.call(this.obj);
        Dep.target = null
        return value;
    }
        
    addDep(dep) {
        this.deps.push(dep);
    }

    // 依赖变化时，执行回调
    update() {
        const value = this.getter.call(this.obj);
        const oldVal = this.value;
        this.value = value;
        this.cb.call(this.obj, value, oldVal);
    }

    // 取消所有依赖
    tearDown() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].removeSub(this);
        }
        this.deps = [];
    }
}

// let obj = {};
// defineReactive(obj, 'num1', 1);
// defineReactive(obj, 'num2', 2);

// let watcher = new Watcher(obj, function () {
//     return this.num1 + this.num2;
// }, function (newVal, oldVal) {
//     console.log(`监听函数，${this.num1} + ${this.num2} = ${newVal};`);
// });

// obj.num1 = 11;
// obj.num2 = 22;

// watcher.tearDown();

// obj.num1 = 1111;

// let arr = [];
// defineReactive(arr, 0, 1);
// defineReactive(arr, 1, 2);

// let watcher = new Watcher(arr, function () {
//     return this[0] + this[1];
// }, function (newVal, oldVal) {
//     console.log(`监听函数，${this[0]} + ${this[1]} =${newVal}`);
// });

// arr[0] = 11;
// arr[1] = 22;


let object = {
    num1: 1,
    num2: 1,
    objectTest: {
        num3: 1
    }
}

observe(object)

let watcher = new Watcher(object, function () {
    return this.num1 + this.num2 + this.objectTest.num3
}, function (newValue, oldValue) {
    console.log(`监听函数，${object.num1} + ${object.num2} + ${object.objectTest.num3} = ${newValue}`)
})

object.num1 = 2
// 监听函数，2 + 1 + 1 = 4
object.objectTest.num3 = 2
// 监听函数，2 + 1 + 2 = 5