import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return unrestricted permissions when no acq units defined', async () => {
    const { result } = renderHook(() => useAcqRestrictions('uid', []), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.restrictions).toEqual({
      protectCreate: false,
      protectDelete: false,
      protectUpdate: false,
    });
  });

  it('should return unrestricted permissions when user is member of assigned units', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => ({
          acquisitionsUnitMemberships: [{ id: 'membershipuid' }],
        }),
      }),
    });

    const { result } = renderHook(() => useAcqRestrictions('uid', ['unituid']), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.restrictions).toEqual({
      protectCreate: false,
      protectDelete: false,
      protectUpdate: false,
    });
  });

  it('should return restrictions based on assigned user when user is not a member', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => ({
          acquisitionsUnits: [{ id: 'unituid', protectDelete: true }, { id: 'unituid2', protectUpdate: true }],
        }),
      }),
    });

    const { result } = renderHook(() => useAcqRestrictions('uid', ['unituid']), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.restrictions).toEqual({
      protectCreate: false,
      protectDelete: true,
      protectUpdate: true,
    });
  });
});
