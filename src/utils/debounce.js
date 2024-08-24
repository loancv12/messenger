export const throttle = function (func, delay) {
  let toThrottle = false;
  return function (...args) {
    if (!toThrottle) {
      toThrottle = true;
      func.apply(this, args);
      setTimeout(() => {
        toThrottle = false;
      }, delay);
    }
  };
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
