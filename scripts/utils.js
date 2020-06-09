
export const debounce = (func, timeout) => {
  let timer;

  return (...args) => {
    const next = () => func(...args);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(next, timeout > 0 ? timeout : 300);
    return timer;
  };
};
