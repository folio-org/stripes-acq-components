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

    it('should return results for all requested holdings', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-999'],
        holdingIds: ['holding-1', 'holding-2', 'holding-3'],
      });

      expect(results).toHaveLength(3);
      expect(results[0].id).toBe('holding-1');
      expect(results[1].id).toBe('holding-2');
      expect(results[2].id).toBe('holding-3');
    });

    it('should mark holding as abandoned when all PO lines are removed', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(true);
    });

    it('should mark holding as not abandoned when PO line is not removed', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(false);
    });

    it('should handle multiple holdings with PO_LINE removal', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1'],
        holdingIds: ['holding-1', 'holding-2'],
      });

      expect(results[0].abandoned).toBe(true);
      expect(results[1].abandoned).toBe(false);
    });

    it('should mark holding as not abandoned when only one of multiple PO lines is removed', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-3'],
        holdingIds: ['holding-4'],
      });

      expect(results[0].abandoned).toBe(false);
    });
  });

  describe('analyze with PIECE strategy', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
    });

    it('should mark holding as abandoned when all pieces are removed', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(true);
    });

    it('should mark holding as not abandoned when some pieces remain', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(false);
    });

    it('should handle empty piece list', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: [],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(false);
    });
  });

  describe('analyzeHolding without explain', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
    });

    it('should return compact result object without explain', () => {
      const closure = {
        pieces: new Set(),
        items: new Set(),
        poLines: new Set(),
      };

      const result = analyzer.analyzeHolding('holding-1', closure, false);

      expect(result).toEqual({
        id: 'holding-1',
        abandoned: expect.any(Boolean),
      });
      expect(result).not.toHaveProperty('explain');
    });

    it('should return abandoned status correctly', () => {
      const closure = {
        pieces: new Set(['piece-1', 'piece-2']),
        items: new Set(['item-1', 'item-2']),
        poLines: new Set(['po-line-1']),
      };

      const result = analyzer.analyzeHolding('holding-1', closure, false);

      expect(result.abandoned).toBe(true);
    });
  });

  describe('analyzeHolding with explain', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
    });

    it('should return detailed result with explain', () => {
      const closure = {
        pieces: new Set(['piece-1']),
        items: new Set(['item-1']),
        poLines: new Set(),
      };

      const result = analyzer.analyzeHolding('holding-1', closure, true);

      expect(result).toHaveProperty('explain');
      expect(result.explain).toHaveProperty('related');
      expect(result.explain).toHaveProperty('remaining');
    });

    it('should show all related entities', () => {
      const closure = {
        pieces: new Set(),
        items: new Set(),
        poLines: new Set(),
      };

      const result = analyzer.analyzeHolding('holding-1', closure, true);

      expect(result.explain.related.pieces).toEqual(['piece-1', 'piece-2']);
      expect(result.explain.related.items).toEqual(['item-1', 'item-2']);
      expect(result.explain.related.poLines).toEqual(['po-line-1']);
    });

    it('should show remaining entities after removal', () => {
      const closure = {
        pieces: new Set(['piece-1']),
        items: new Set(['item-1']),
        poLines: new Set(),
      };

      const result = analyzer.analyzeHolding('holding-1', closure, true);

      expect(result.explain.remaining.pieces).toEqual(['piece-2']);
      expect(result.explain.remaining.items).toEqual(['item-2']);
      expect(result.explain.remaining.poLines).toEqual(['po-line-1']);
    });

    it('should include id and abandoned in explain result', () => {
      const closure = {
        pieces: new Set(),
        items: new Set(),
        poLines: new Set(),
      };

      const result = analyzer.analyzeHolding('holding-1', closure, true);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('abandoned');
      expect(result.id).toBe('holding-1');
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
