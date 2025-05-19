import { useEffect, useState } from "react";

/**
 * useDebounce Hook
 * Returns a debounced version of the input value after a delay.
 * Helpful for limiting API calls or heavy operations while typing.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Time in ms to wait before applying the value
 * @returns {any} - Debounced value that updates after delay
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout to update debouncedValue after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes before delay completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
