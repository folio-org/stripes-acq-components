import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../../test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';

import { useAcqRestrictions } from './useAcqRestrictions';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAcqRestrictions', () => {
  it('should return unrestricted permissions when no acq units defined', async () => {
    const { result, waitFor } = renderHook(() => useAcqRestrictions('uid', []), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.restrictions).toEqual({
      protectCreate: false,
      protectDelete: false,
      protectUpdate: false,
    });
  });

  it('should return unrestricted permissions when user is member of assigned units', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          acquisitionsUnitMemberships: [{ id: 'membershipuid' }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useAcqRestrictions('uid', ['unituid']), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.restrictions).toEqual({
      protectCreate: false,
      protectDelete: false,
      protectUpdate: false,
    });
  });

  it('should return restrictions based on assigned user when user is not a member', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          acquisitionsUnits: [{ id: 'unituid', protectDelete: true }, { id: 'unituid2', protectUpdate: true }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useAcqRestrictions('uid', ['unituid']), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.restrictions).toEqual({
      protectCreate: false,
      protectDelete: true,
      protectUpdate: true,
    });
  });
});
