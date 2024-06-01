const throttle = function (func, delay) {
  // debugger;
  let toThrottle = false;
  return function (...args) {
    console.log("call back", toThrottle);

    if (!toThrottle) {
      toThrottle = true;
      func.apply(this, args);
      setTimeout(() => {
        toThrottle = false;
      }, delay);
    }
  };
};

export const conditionThrottle = function (func, conditionFn, delay) {
  console.log(func, conditionFn, delay);
  let toThrottle = false;
  return function (...args) {
    console.log("call throttle", toThrottle);
    console.log("conditionFn", conditionFn());

    if (!toThrottle) {
      toThrottle = true;
      func.apply(this, args);
      setTimeout(() => {
        toThrottle = false;
      }, delay);
    }
  };
};

export default throttle;
