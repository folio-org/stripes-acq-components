import { useCallback, useRef } from 'react';

const useGetLatest = (obj) => {
  const ref = useRef();

  ref.current = obj;

  return useCallback(() => ref.current, []);
};

export const useAsyncDebounce = (fn, wait = 0) => {
  const debounceRef = useRef({});

  const getLatestFn = useGetLatest(fn);
  const getLatestWait = useGetLatest(wait);

  return useCallback(
    async (...args) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve;
          debounceRef.current.reject = reject;
        });
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout);
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout;
        try {
          debounceRef.current.resolve(await getLatestFn()(...args));
        } catch (err) {
          debounceRef.current.reject(err);
        } finally {
          delete debounceRef.current.promise;
        }
      }, getLatestWait());

      return debounceRef.current.promise;
    },
    [getLatestFn, getLatestWait],
  );
};
