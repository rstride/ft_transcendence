/* Window size */
export function debounce(fn: any, ms: any) {
  let timer: any;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      fn.apply(window.self, arguments);
    }, ms);
  };
}
