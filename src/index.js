// 抑制 ResizeObserver 警告
const originalConsoleError = console.error;
console.error = function (msg) {
  if (typeof msg === "string" && msg.includes("ResizeObserver") && msg.includes("loop completed with undelivered notifications")) {
    // 忽略 ResizeObserver 循环警告
    return;
  }
  originalConsoleError.apply(this, arguments);
};
