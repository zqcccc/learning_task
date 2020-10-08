const fp = require("lodash/fp");

// 简答题
// 谈谈你是如何理解 JS 异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

/* JS 是单线程的语言，如果所有的任务都是同步执行的话，那效率是很低的，所以需要用到多线程，JS 就是通过异步编程来利用多线程，当然 JS 本身还是只能单线程。EventLoop 就是消息队列，EventLoop 是一种执行机制，在不同的地方有不同的实现，在浏览器里分成两个队列，宏队列和微队列。我对它们的理解就是，在每次要执行下一个宏任务之前，要先执行完所有的微任务，如果是微任务中嵌套了微任务，也要把这微任务中的微任务执行完才能执行宏任务，总之，执行下一个宏任务的之前，微任务队列必须是空的。*/


// 练习一
new Promise((resolve => {
  var a = 'hello'
  setTimeout(() => resolve(a), 10)
}))
.then(a => {
  var b = 'lagou'
  return new Promise(resolve => setTimeout(() => resolve({ a, b }), 10))
})
.then(({ a, b }) => {
  var c = 'i love you'
  setTimeout(() => console.log(a, b, c), 10)
})

const cars = [
  { name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true },
  {
    name: "Spyker C12 Zagato",
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false,
  },
  {
    name: "Jaguar XKR-S",
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false,
  },
  { name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false },
  {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true,
  },
  {
    name: "Pagani Huayra",
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false,
  },
];
// 练习二练习1
const getLastInStock = fp.flowRight(
  (i) => i.name,
  (a) => a.pop()
);
// console.log(getLastInStock(cars))

// 练习二练习2
const getFirstName = fp.flowRight(
  (o) => fp.prop("name", o),
  (a) => fp.first(a)
);
console.log(getFirstName(cars));

// 练习二练习3
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length;
};
// let avarageDollarValue = function (cars) {
//   let dollar_values = fp.map(function (car) {
//     return car.dollar_value
//   }, cars)
//   return _average(dollar_values)
// }
const avarageDollarValue = fp.flowRight(
  _average,
  fp.map(fp.prop("dollar_value"))
);
console.log(avarageDollarValue(cars));

// 练习二练习4
let _underscore = fp.replace(/\W+/g, "-");
const sanitizeNames = fp.flowRight(
  fp.map(_underscore),
  fp.map(fp.lowerCase),
  fp.map(fp.prop("name"))
);
console.log(sanitizeNames(cars));

class Container {
  static of(value) {
    return new Container(value);
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return Container.of(fn(this._value));
  }
}
class Maybe {
  static of(value) {
    return new Maybe(value);
  }
  isNothing() {
    return this._value === null || this._value === undefined;
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value));
  }
}

// 三练习1
let maybe = Maybe.of([5, 6, 1]);
let ex1 = (n) => {
  const res = maybe.map(fp.map(fp.add(n)));
  console.log(res);
};
ex1(2);

// 三练习2
let xs = Container.of(["do", "ray", "me", "fa", "so", "la", "ti", "do"]);
let ex2 = () => {
  const res = xs.map(fp.first);
  console.log(res);
};
ex2();

// 三练习3
let safeProp = fp.curry(function (x, o) {
  return Maybe.of(o[x]);
});
let user = { id: 2, name: "Albert" };
let ex3 = () => {
  const res = Maybe.of(user)
    .map(safeProp("name"))
    .map((o) => o._value)
    .map(fp.first);
  console.log(res);
};
ex3();

// 三练习4
let ex4 = (n) => {
  // if (n) {
  //   return parseInt(n)
  // }
  const res = Maybe.of(n).map(parseInt);
  console.log(res);
};
ex4(12.1);


// 手写 Promise
class MyPromise {
  status = null;
  value = null;
  reason = null;
  successCallback = [];
  failedCallback = [];

  constructor(fn) {
    try {
      fn(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = (value) => {
    if (this.status) return;
    this.status = "success";
    this.value = value;
    // this.successCallback && this.successCallback(this.value)
    while (this.successCallback.length) {
      this.successCallback.shift()();
    }
  };

  reject = (reason) => {
    if (this.status) return;
    this.status = "fail";
    this.reason = reason;
    // this.failedCallback && this.failedCallback(this.reason)
    while (this.failedCallback.length) {
      this.failedCallback.shift()();
    }
  };

  finally(callback) {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }

  catch(failedCallback) {
    return this.then(undefined, failedCallback)
  }

  then(successHandle, failHandle) {
    successHandle = successHandle ? successHandle : (value) => value;
    failHandle = failHandle
      ? failHandle
      : (reason) => {
          throw reason;
        };
    let newPromise = new MyPromise((rs, rj) => {
      if (this.status === "success") {
        setTimeout(() => {
          try {
            const thenSuccessHandleRes = successHandle(this.value);
            resolvePromise(newPromise, thenSuccessHandleRes, rs, rj);
          } catch (error) {
            rj(error);
          }
        }, 0);
      } else if (this.status === "fail") {
        setTimeout(() => {
          try {
            const thenFailHandleRes = failHandle(this.reason);
            resolvePromise(newPromise, thenFailHandleRes, rs, rj);
          } catch (error) {
            rj(error);
          }
        }, 0);
      } else {
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              const thenSuccessHandleRes = successHandle(this.value);
              resolvePromise(newPromise, thenSuccessHandleRes, rs, rj);
            } catch (error) {
              rj(error);
            }
          }, 0);
        });
        this.failedCallback.push(() => {
          setTimeout(() => {
            try {
              const thenFailHandleRes = failHandle(this.reason);
              resolvePromise(newPromise, thenFailHandleRes, rs, rj);
            } catch (error) {
              rj(error);
            }
          }, 0);
        });
      }
    });
    return newPromise;
  }

  static all(array) {
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      // console.log('MyPromise: ');
      function addData(key, value) {
        result[key] = value;
        console.log("value: ", value);
        index += 1;
        // console.log('index: ', index);
        if (index === array.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          current.then(
            (value) => addData(i, value),
            (reason) => reject(reason)
          );
        } else {
          addData(i, current);
        }
      }
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }
}
function resolvePromise(p, v, rs, rj) {
  if (p === v) {
    console.log("p === v: ", p === v);
    return rj(new TypeError("Chaining cycle detected for promise #<Promise>"));
  }
  if (v instanceof MyPromise) {
    v.then(rs, rj);
  } else {
    rs(v);
  }
}

// const m = new MyPromise((resolve, reject) => {
//   // throw new Error("executor error");
//   setTimeout(() => {
//     reject("re 失败");
//   }, 2000);
// });
// MyPromise.resolve(p1()).then(console.log);
// function p1(a) {
//   return new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`p1 ${a}`);
//     }, 2000);
//   });
// }
// function p2(a) {
//   return new MyPromise((resolve, reject) => {
//     resolve(`p2 ${a}`);
//     // reject(`p2 ${a}`);
//   });
// }
// p2("resolve")
//   .finally(() => {
//     console.log("finally");
//     return p1();
//   })
//   .then(console.log, console.log);
// function p3(a) {
//   return new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`p3 ${a}`);
//     }, 1000);
//   });
// }
// MyPromise.all(["a", "b", p1(1), p2(2), p3(3), "c"]).then(console.log);
// let p1 = m
//   .then()
//   .then()
//   .then(
//     (a) => {
//       console.log(a);
//       return "aaa";
//     },
//     (reason) => {
//       console.log(reason);
//       return 10000;
//     }
//   )
//   .then(console.log);
// p1.then(()=>{}, console.error);
// m.then((a) => console.log(a, 1));
// m.then((a) => console.log(a, 3));
