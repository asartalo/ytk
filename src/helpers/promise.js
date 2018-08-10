export function resolvesTo(value, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout, value);
  });
}

export function rejectsWith(value, timeout = 0) {
  return new Promise((_, reject) => {
    setTimeout(reject, timeout, value);
  });
}

export function fnResolvesTo(value, timeout = 0) {
  return fnFactory(resolvesTo, value, timeout);
}

export function fnRejectsWith(value, timeout = 0) {
  return fnFactory(rejectsWith, value, timeout);
}

function fnFactory(fn, ...args) {
  return () => fn(...args);
}
