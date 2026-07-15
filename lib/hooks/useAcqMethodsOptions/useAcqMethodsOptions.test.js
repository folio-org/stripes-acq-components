import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  getAcqMethodLabel,
  useAcqMethodsOptions,
} from './useAcqMethodsOptions';

const records = [
  { id: '001', value: 'Test method' },
  { id: '002', value: 'Purchase' },
  { id: '003', value: 'Deprecated method', deprecated: true },
];

describe('useAcqMethodsOptions', () => {
  it('should return all acq methods options', () => {
    const { result } = renderHook(() => useAcqMethodsOptions(records));

    expect(result.current).toEqual([
      { label: records[0].value, value: records[0].id },
      { label: 'stripes-acq-components.acquisition_method.purchase', value: records[1].id },
      { label: records[2].value, value: records[2].id },
    ]);
  });

  it('should return empty list if there are no acq methods', () => {
    const { result } = renderHook(() => useAcqMethodsOptions());

    expect(result.current).toEqual([]);
  });

  it('should exclude deprecated methods when excludeDeprecated is set', () => {
    const { result } = renderHook(() => useAcqMethodsOptions(records, { excludeDeprecated: true }));

    expect(result.current).toEqual([
      { label: records[0].value, value: records[0].id },
      { label: 'stripes-acq-components.acquisition_method.purchase', value: records[1].id },
    ]);
  });

  it('should keep a deprecated method that matches the selected value', () => {
    const { result } = renderHook(() => useAcqMethodsOptions(records, {
      excludeDeprecated: true,
      selectedValue: '003',
    }));

    expect(result.current).toEqual([
      { label: records[0].value, value: records[0].id },
      { label: 'stripes-acq-components.acquisition_method.purchase', value: records[1].id },
      { label: records[2].value, value: records[2].id },
    ]);
  });

  it('should suffix deprecated methods when withDeprecatedSuffix is set', () => {
    const { result } = renderHook(() => useAcqMethodsOptions(records, { withDeprecatedSuffix: true }));

    expect(result.current).toEqual([
      { label: records[0].value, value: records[0].id },
      { label: 'stripes-acq-components.acquisition_method.purchase', value: records[1].id },
      { label: 'stripes-acq-components.acquisition_method.deprecatedSuffix', value: records[2].id },
    ]);
  });
});

describe('getAcqMethodLabel', () => {
  const intl = { formatMessage: ({ id }) => id };

  it('should return the raw value for a method without a localization key', () => {
    expect(getAcqMethodLabel({ value: 'Test method' }, { intl })).toBe('Test method');
  });

  it('should return the localized label for a known acq method', () => {
    expect(getAcqMethodLabel({ value: 'Purchase' }, { intl }))
      .toBe('stripes-acq-components.acquisition_method.purchase');
  });

  it('should not suffix an active method even when withDeprecatedSuffix is set', () => {
    expect(getAcqMethodLabel({ value: 'Test method', deprecated: false }, { intl, withDeprecatedSuffix: true }))
      .toBe('Test method');
  });

  it('should suffix a deprecated method when withDeprecatedSuffix is set', () => {
    expect(getAcqMethodLabel({ value: 'Test method', deprecated: true }, { intl, withDeprecatedSuffix: true }))
      .toBe('stripes-acq-components.acquisition_method.deprecatedSuffix');
  });

  it('should not suffix a deprecated method when withDeprecatedSuffix is not set', () => {
    expect(getAcqMethodLabel({ value: 'Test method', deprecated: true }, { intl }))
      .toBe('Test method');
  });
});
