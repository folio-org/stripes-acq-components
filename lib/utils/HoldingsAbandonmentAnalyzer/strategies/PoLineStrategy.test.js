import { holdingsRelatedEntities } from 'fixtures';
import HoldingsAbandonmentAnalyzer from '../HoldingsAbandonmentAnalyzer';

describe('HoldingsAbandonmentPOLineStrategy', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new HoldingsAbandonmentAnalyzer(holdingsRelatedEntities);
  });

  describe('basic PO_LINE strategy', () => {
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

  describe('synchronized vs independent lines', () => {
    it('should mark holding as abandoned when removing synchronized line with auto-removed pieces/items', () => {
      // holding-1 has synchronized line (auto-removes pieces/items)
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1'],
        holdingIds: ['holding-1'],
      });

      // Should be abandoned because synchronized line removes pieces/items automatically
      expect(results[0].abandoned).toBe(true);
    });

    it('should not abandon holding when removing independent line with remaining pieces/items', () => {
      // holding-5 has only independent line (pieces/items stay)
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
      });

      // Should NOT be abandoned because pieces and items remain (not auto-removed for independent lines)
      expect(results[0].abandoned).toBe(false);
    });

    it('should not abandon holding when removing independent line but synchronized line remains', () => {
      // holding-6 has both synchronized and independent lines
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-7'],
        holdingIds: ['holding-6'],
      });

      // Should NOT be abandoned because synchronized line still has connections
      expect(results[0].abandoned).toBe(false);
    });

    it('should not abandon holding when removing synchronized line if other lines remain', () => {
      // holding-6 has both synchronized and independent lines
      // Remove the synchronized line
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-6'],
        holdingIds: ['holding-6'],
      });

      // Should NOT be abandoned because independent line remains
      expect(results[0].abandoned).toBe(false);
    });

    it('should not abandon holding when removing independent line but synchronized line with pieces remains', () => {
      // holding-4 has one independent and one synchronized line with pieces/items
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-3'],
        holdingIds: ['holding-4'],
      });

      // Should NOT be abandoned because synchronized line has pieces/items
      expect(results[0].abandoned).toBe(false);
    });

    it('should handle multiple holdings with different line types', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5', 'po-line-7'],
        holdingIds: ['holding-5', 'holding-6'],
      });

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('holding-5');
      expect(results[0].abandoned).toBe(false); // Items from independent line remain
      expect(results[1].id).toBe('holding-6');
      expect(results[1].abandoned).toBe(false); // Synchronized line remains
    });

    it('should not abandon holding with only independent lines for DEFAULT action type', () => {
      // holding-7 has only independent lines (POL-8, POL-9)
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-8', 'po-line-9'],
        holdingIds: ['holding-7'],
      });

      // Items from independent receiving remain
      expect(results[0].abandoned).toBe(false);
    });

    it('should not abandon holding when removing independent line with no pieces attached', () => {
      // holding-8 has independent line with no pieces, but items exist independently
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-10'],
        holdingIds: ['holding-8'],
      });

      // Line has no pieces, so nothing removed from closure
      // Items remain independent of line → NOT ABANDONED
      expect(results[0].abandoned).toBe(false);
    });

    it('should abandon holding for both synchronized and independent lines with all pieces removed', () => {
      // holding-6 has mixed lines (POL-6 synchronized, POL-7 independent)
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-6', 'po-line-7'],
        holdingIds: ['holding-6'],
      });

      // POL-6 is synchronized → piece-6, item-6 removed
      // POL-7 is independent → piece-7 removed, but item-7 STAYS
      // Item-7 remains → NOT ABANDONED
      expect(results[0].abandoned).toBe(false);
    });
  });

  describe('DELETE operation - remove all connections including independent pieces', () => {
    it('should clear independent pieces when DELETE action is used', () => {
      // holding-5 has independent line with pieces and items
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DELETE',
      });

      // With DELETE: independent pieces are cleared along with items
      expect(results[0].abandoned).toBe(true);
    });

    it('should preserve independent pieces with DEFAULT action (unopen)', () => {
      // Same line, same holding, but with DEFAULT action
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DEFAULT',
      });

      // With DEFAULT (unopen): independent pieces are preserved
      expect(results[0].abandoned).toBe(false);
    });

    it('should clear all pieces on mixed line deletion with DELETE action', () => {
      // holding-6 has synchronized + independent lines
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-6', 'po-line-7'],
        holdingIds: ['holding-6'],
        actionType: 'DELETE',
      });

      // DELETE clears both synchronized and independent pieces
      expect(results[0].abandoned).toBe(true);
    });

    it('should preserve independent pieces on mixed line DEFAULT', () => {
      // Same setup but with DEFAULT (unopen) action
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-6', 'po-line-7'],
        holdingIds: ['holding-6'],
        actionType: 'DEFAULT',
      });

      // DEFAULT preserves independent items
      expect(results[0].abandoned).toBe(false);
    });

    it('should clear independent-only lines on DELETE', () => {
      // holding-7 has only independent lines
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-8', 'po-line-9'],
        holdingIds: ['holding-7'],
        actionType: 'DELETE',
      });

      // DELETE on all independent lines clears all pieces
      expect(results[0].abandoned).toBe(true);
    });

    it('should show cleared entities in explain for DELETE', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DELETE',
        explain: true,
      });

      expect(results[0].explain).toBeDefined();
      expect(results[0].explain.actionType).toBe('DELETE');
      expect(results[0].explain.cleared).toBeDefined();
      expect(results[0].explain.cleared.pieces.length).toBeGreaterThan(0);
    });

    it('should show remaining items in explain for DEFAULT', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DEFAULT',
        explain: true,
      });

      expect(results[0].explain).toBeDefined();
      expect(results[0].explain.actionType).toBe('DEFAULT');
      expect(results[0].explain.remaining.items.length).toBeGreaterThan(0);
    });

    it('should throw on invalid action type', () => {
      expect(() => {
        analyzer.analyze({
          strategy: 'PO_LINE',
          ids: ['po-line-1'],
          holdingIds: ['holding-1'],
          actionType: 'INVALID_TYPE',
        });
      }).toThrow('Unknown action type: INVALID_TYPE');
    });
  });
});
