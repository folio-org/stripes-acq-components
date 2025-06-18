import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { TAGS_API } from '../../constants';
import { useTags } from './useTags';

const tags = [
  {
    id: '00b9f58d-8bc2-4b32-ae51-9d343f279a86',
    label: 'important',
  },
];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTags', () => {
  const mockGet = jest.fn(() => ({
    json: () => ({ tags }),
  }));

  beforeEach(() => {
    useOkapiKy.mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tags', async () => {
    const { result } = renderHook(() => useTags(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.tags).toEqual(tags);
    expect(mockGet).toHaveBeenCalledWith(TAGS_API, expect.objectContaining({}));
  });
});
