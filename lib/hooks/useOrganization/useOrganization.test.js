import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { VENDORS_API } from '../../constants';
import { useOrganization } from './useOrganization';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const organization = {
  id: 'orgId',
  code: 'AMAZ',
  name: 'Azmazon',
};

describe('useOrganization', () => {
  const mockGet = jest.fn(() => ({
    json: () => organization,
  }));

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches organization', async () => {
    const { result } = renderHook(() => useOrganization(organization.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.organization).toEqual(organization);
    expect(mockGet).toHaveBeenCalledWith(`${VENDORS_API}/${organization.id}`, expect.any(Object));
  });
});
