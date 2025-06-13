import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { institution } from '../../../test/jest/fixtures';
import { useConsortiumInstitutions } from '../consortia';
import { useInstitutions } from '../useInstitutions';
import { useInstitutionsQuery } from './useInstitutionsQuery';

jest.mock('../consortia', () => ({
  ...jest.requireActual('../consortia'),
  useConsortiumInstitutions: jest.fn(),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: false })),
}));

jest.mock('../useInstitutions', () => ({
  useInstitutions: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const institutionsMock = [institution];

describe('useInstitutionsQuery', () => {
  beforeEach(() => {
    useConsortiumInstitutions.mockReturnValue({ institutions: institutionsMock });
    useInstitutions.mockReturnValue({ institutions: institutionsMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of institutions in non-ECS mode', async () => {
    const { result } = renderHook(
      async () => useInstitutionsQuery({ consortium: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { institutions } = await result.current;

    expect(institutions).toEqual(institutionsMock);
    expect(useInstitutions).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
    expect(useConsortiumInstitutions).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('should return list of institutions in ECS mode', async () => {
    const { result } = renderHook(
      async () => useInstitutionsQuery({ consortium: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { institutions } = await result.current;

    expect(institutions).toEqual(institutionsMock);
    expect(useInstitutions).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    expect(useConsortiumInstitutions).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });
});
