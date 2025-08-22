import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { TAGS_API } from '../../constants';
import { useTagsMutation } from './useTagsMutation';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTagsMutation', () => {
  const mockKyPost = jest.fn(() => ({ json: jest.fn().mockResolvedValue({ id: 'tag1' }) }));

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      post: mockKyPost,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ky.post with correct arguments in mutationFn', async () => {
    const { result } = renderHook(() => useTagsMutation(), { wrapper });

    await act(async () => {
      await result.current.createTag({ data: { name: 'tag1' } });
    });

    expect(mockKyPost).toHaveBeenCalledWith(TAGS_API, { json: { name: 'tag1' } });
  });
});
