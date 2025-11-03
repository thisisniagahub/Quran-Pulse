/**
 * Creates a debounced function that delays invoking func until after delay milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * 
 * @param func The function to debounce
 * @param delay The number of milliseconds to delay
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func The function to throttle
 * @param delay The number of milliseconds to throttle executions to
 * @returns A throttled function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastExecutionTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecutionTime >= delay) {
      lastExecutionTime = currentTime;
      func(...args);
    }
  };
}