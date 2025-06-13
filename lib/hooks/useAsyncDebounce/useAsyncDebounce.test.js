import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useAsyncDebounce } from './useAsyncDebounce';

jest.useFakeTimers('modern');

const CALL_COUNT = 5;
const DELAY = 300;
const RESPONSE = 42;

const successFn = jest.fn(() => Promise.resolve(RESPONSE));
const failFn = jest.fn(() => Promise.reject(RESPONSE));

describe('useAsyncDebounce', () => {
  it('should debounce async function and return resolved value', async () => {
    const { result } = renderHook(() => useAsyncDebounce(successFn, DELAY));

    const debounced = result.current;
    const promises = new Array(CALL_COUNT).fill(null).map(() => debounced());

    jest.advanceTimersByTime(DELAY * 1.5);

    const responses = await Promise.all(promises);

    responses.every(res => expect(res).toEqual(RESPONSE));
    expect(successFn).toHaveBeenCalledTimes(1);
  });

  it('should debounce async function and return rejected value', async () => {
    const { result } = renderHook(() => useAsyncDebounce(failFn));

    const debounced = result.current;
    const promises = new Array(CALL_COUNT).fill(null).map(() => debounced());

    jest.advanceTimersByTime(DELAY * 1.5);

    const responses = Promise.all(promises);

    await expect(responses).rejects.toEqual(RESPONSE);
    expect(failFn).toHaveBeenCalledTimes(1);
  });
});
