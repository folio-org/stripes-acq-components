import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

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
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: mockGet });
  });

  it('should fetch tags', async () => {
    const { result, waitFor } = renderHook(() => useTags(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.tags).toEqual(tags);
    expect(mockGet).toHaveBeenCalledWith(TAGS_API, expect.objectContaining({}));
  });
});
