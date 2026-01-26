import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { holdingsRelatedEntities } from 'fixtures';
import {
  fetchHoldingsRelatedEntities,
  HoldingsAbandonmentPOLineStrategy,
} from '../../utils';
import { useHoldingsAbandonmentAnalyzer } from './useHoldingsAbandonmentAnalyzer';

jest.mock('../../utils/api', () => ({
  ...jest.requireActual('../../utils/api'),
  fetchHoldingsRelatedEntities: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useHoldingsAbandonmentAnalyzer', () => {
  beforeEach(() => {
    fetchHoldingsRelatedEntities.mockReturnValue(() => Promise.resolve(holdingsRelatedEntities));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return holdings abandonment analyzer', async () => {
    useOkapiKy.mockReturnValue({});

    const { result } = renderHook(() => useHoldingsAbandonmentAnalyzer(), { wrapper });

    let analyzer;
    let results;

    await act(async () => {
      analyzer = await result.current.analyzerFactory({ holdingIds: ['holding-1'] });
    });

    await act(async () => {
      results = await analyzer.analyze({
        explain: false,
        holdingIds: ['holding-1'],
        ids: ['po-line-2'],
        strategy: HoldingsAbandonmentPOLineStrategy.name,
      });
    });

    expect(results).toEqual([{
      id: 'holding-1',
      abandoned: false,
    }]);
  });
});
