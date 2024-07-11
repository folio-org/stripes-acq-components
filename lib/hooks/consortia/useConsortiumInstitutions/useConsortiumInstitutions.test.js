import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { institution } from '../../../../test/jest/fixtures';
import { getConsortiumCentralTenantId } from '../../../utils';
import { useConsortiumInstitutions } from './useConsortiumInstitutions';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  getConsortiumCentralTenantId: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumInstitutions', () => {
  beforeEach(() => {
    getConsortiumCentralTenantId
      .mockClear()
      .mockReturnValue('centralTenantId');
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ institutions: [institution] }),
        }),
      });
  });

  it('should return list of consortium institutions', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumInstitutions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.institutions).toEqual([institution]);
  });
});
