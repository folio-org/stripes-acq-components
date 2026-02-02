import { holdingsRelatedEntities } from 'fixtures';
import HoldingsAbandonmentAnalyzer from './HoldingsAbandonmentAnalyzer';

describe('HoldingsAbandonmentAnalyzer', () => {
  describe('constructor', () => {
    it('should create index from holdings details', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      expect(analyzer.index).toBeDefined();
      expect(analyzer.index.piecesByHolding).toBeInstanceOf(Map);
      expect(analyzer.index.itemsByHolding).toBeInstanceOf(Map);
      expect(analyzer.index.poLinesByHolding).toBeInstanceOf(Map);
      expect(analyzer.index.piecesByPoLine).toBeInstanceOf(Map);
      expect(analyzer.index.pieceById).toBeInstanceOf(Map);
    });

    it('should register strategies', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      expect(analyzer.strategies.has('PO_LINE')).toBe(true);
      expect(analyzer.strategies.has('PIECE')).toBe(true);
    });
  });

  describe('analyze with PO_LINE strategy', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
    });

    it('should handle multiple holdings with different strategies', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1'],
        holdingIds: ['holding-1', 'holding-2', 'holding-3'],
      });

      expect(results).toHaveLength(3);
      expect(results[0].abandoned).toBe(true);
      expect(results[1].abandoned).toBe(false);
      expect(results[2].abandoned).toBe(true);
    });
  });

  describe('analyze with PIECE strategy', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
    });

    it('should handle empty holdings', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-3'],
      });

      expect(results[0].abandoned).toBe(true);
    });
  });

  describe('createIndex', () => {
    it('should create empty index for empty holdings details', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer({});

      expect(analyzer.index.piecesByHolding.size).toBe(0);
      expect(analyzer.index.itemsByHolding.size).toBe(0);
      expect(analyzer.index.poLinesByHolding.size).toBe(0);
    });

    it('should handle holdings without pieces', () => {
      const holdings = {
        'holding-1': {
          items_detail_collection: { items_detail: [{ id: 'item-1' }] },
          poLines_detail_collection: { poLines_detail: [{ id: 'po-line-1' }] },
        },
      };

      const analyzer = new HoldingsAbandonmentAnalyzer(holdings);

      expect(analyzer.index.piecesByHolding.get('holding-1')).toEqual([]);
    });

    it('should handle holdings without items', () => {
      const holdings = {
        'holding-1': {
          pieces_detail_collection: { pieces_detail: [{ id: 'piece-1', poLineId: 'po-1' }] },
          poLines_detail_collection: { poLines_detail: [{ id: 'po-line-1' }] },
        },
      };

      const analyzer = new HoldingsAbandonmentAnalyzer(holdings);

      expect(analyzer.index.itemsByHolding.get('holding-1')).toEqual([]);
    });

    it('should handle holdings without poLines', () => {
      const holdings = {
        'holding-1': {
          pieces_detail_collection: { pieces_detail: [{ id: 'piece-1', poLineId: 'po-1' }] },
          items_detail_collection: { items_detail: [{ id: 'item-1' }] },
        },
      };

      const analyzer = new HoldingsAbandonmentAnalyzer(holdings);

      expect(analyzer.index.poLinesByHolding.get('holding-1')).toEqual([]);
    });

    it('should index pieces by their id', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      expect(analyzer.index.pieceById.has('piece-1')).toBe(true);
      expect(analyzer.index.pieceById.has('piece-2')).toBe(true);
      expect(analyzer.index.pieceById.get('piece-1').id).toBe('piece-1');
    });

    it('should index pieces by their poLineId', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      const piecesForPoLine1 = analyzer.index.piecesByPoLine.get('po-line-1');

      expect(piecesForPoLine1).toHaveLength(2);
      expect(piecesForPoLine1.map(p => p.id)).toContain('piece-1');
      expect(piecesForPoLine1.map(p => p.id)).toContain('piece-2');
    });
  });

  describe('error handling', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
    });

    it('should throw error for unknown strategy', () => {
      expect(() => {
        analyzer.analyze({
          strategy: 'UNKNOWN_STRATEGY',
          ids: [],
          holdingIds: ['holding-1'],
        });
      }).toThrow('Unknown strategy: UNKNOWN_STRATEGY');
    });

    it('should handle non-existent holding id gracefully', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['non-existent-holding'],
      });

      expect(results[0].id).toBe('non-existent-holding');
      expect(results[0].abandoned).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle empty holdings', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-3'],
      });

      expect(results[0].abandoned).toBe(true);
    });

    it('should handle multiple holdings with different strategies', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1'],
        holdingIds: ['holding-1', 'holding-2', 'holding-3'],
      });

      expect(results).toHaveLength(3);
      expect(results[0].abandoned).toBe(true);
      expect(results[1].abandoned).toBe(false);
      expect(results[2].abandoned).toBe(true);
    });

    it('should correctly process piece removal across holdings', () => {
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);

      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2', 'piece-3'],
        holdingIds: ['holding-1', 'holding-2'],
      });

      expect(results[0].abandoned).toBe(true);
      expect(results[1].abandoned).toBe(true);
    });
  });
});
