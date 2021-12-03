import { renderHook } from '@testing-library/react-hooks';

import { useAcqMethodsOptions } from './useAcqMethodsOptions';

const records = [
  { id: '001', value: 'Test method' },
  { id: '002', value: 'Purchase' },
];

describe('useAcqMethodsOptions', () => {
  it('should return all acq methods options', () => {
    const { result } = renderHook(() => useAcqMethodsOptions(records));

    expect(result.current).toEqual([
      { label: records[0].value, value: records[0].id },
      { label: 'ui-orders.acquisition_method.purchase', value: records[1].id },
    ]);
  });

  it('should return empty list if there is no acq methods', () => {
    const { result } = renderHook(() => useAcqMethodsOptions());

    expect(result.current).toEqual([]);
  });
});
