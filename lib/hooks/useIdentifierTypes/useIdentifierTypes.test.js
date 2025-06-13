import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { IDENTIFIER_TYPES_API } from '../../constants';
import { useIdentifierTypes } from './useIdentifierTypes';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const identifierTypes = [
  { id: 'identifier-type-1' },
  { id: 'identifier-type-2' },
];
const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      identifierTypes,
      totalRecords: identifierTypes.length,
    }),
  })),
};

describe('useIdentifierTypes', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return identifier types list', async () => {
    const { result } = renderHook(() => useIdentifierTypes(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(IDENTIFIER_TYPES_API, expect.objectContaining({}));
    expect(result.current.identifierTypes).toEqual(identifierTypes);
  });
});
