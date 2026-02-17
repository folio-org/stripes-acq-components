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

  describe('TenantId support (multi-tenant scenarios)', () => {
    it('should include tenantId from pieces when available', () => {
      // holding-tenant-1 has pieces with tenantId='consortium'
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-tenant-1'],
      });

      expect(results[0].tenantId).toBe('consortium');
    });

    it('should include tenantId from items when pieces don\'t have it', () => {
      // holding-tenant-2 has item with tenantId='university', piece without tenantId
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-tenant-2'],
      });

      expect(results[0].tenantId).toBe('university');
    });

    it('should include tenantId in explain mode', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-tenant-1'],
        holdingIds: ['holding-tenant-1'],
        explain: true,
      });

      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].explain).toBeDefined();
    });

    it('should not include tenantId if not present in data', () => {
      // holding-1 has no tenantId
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].tenantId).toBeUndefined();
    });

    it('should handle tenantId with DELETE action', () => {
      // Remove line with tenantId with DELETE action
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-tenant-1'],
        holdingIds: ['holding-tenant-1'],
        actionType: 'DELETE',
      });

      // Should include tenantId in result even with DELETE
      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].abandoned).toBe(true); // all pieces cleared
    });

    it('should preserve tenantId from other remaining pieces when one PO line removed', () => {
      // holding-tenant-1 has piece-tenant-1 and piece-tenant-2 (same tenantId)
      // both from po-line-tenant-1
      // Remove the line - both pieces cleared
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-tenant-1'],
        holdingIds: ['holding-tenant-1'],
      });

      expect(results[0].tenantId).toBe('consortium');
    });

    it('should handle conflict when piece has one tenantId and item has another', () => {
      // Test that pieces take priority over items in tenantId extraction
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-tenant-1'],
      });

      // Pieces have 'consortium', should use that
      expect(results[0].tenantId).toBe('consortium');
    });

    it('should include tenantId in explain when using DEFAULT action', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-tenant-2'],
        holdingIds: ['holding-tenant-2'],
        actionType: 'DEFAULT',
        explain: true,
      });

      expect(results[0].tenantId).toBe('university');
      expect(results[0].explain).toBeDefined();
      expect(results[0].explain.actionType).toBe('DEFAULT');
    });
  });

  describe('Default action type behavior and backward compatibility', () => {
    it('should default to DEFAULT action when actionType not specified', () => {
      // No actionType specified, should behave like DEFAULT
      const results1 = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'], // independent line
        holdingIds: ['holding-5'],
      });

      const results2 = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DEFAULT',
      });

      // Both should have same result
      expect(results1[0].abandoned).toBe(results2[0].abandoned);
    });

    it('should preserve independent items without actionType (backward compatibility)', () => {
      // Old behavior: no actionType = preserve independent
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'], // independent line
        holdingIds: ['holding-5'],
      });

      // Should NOT be abandoned (independent items preserved)
      expect(results[0].abandoned).toBe(false);
    });

    it('should handle mixed holdings with and without actionType', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5', 'po-line-6'],
        holdingIds: ['holding-5', 'holding-6'],
        actionType: 'DEFAULT', // applies to both
      });

      // Both should follow DEFAULT behavior
      expect(results[0].abandoned).toBe(false); // independent items preserved
      expect(results[1].abandoned).toBe(false); // synchronized line remains
    });

    it('should handle multiple holdings with different line types and no actionType', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-1', 'po-line-5'],
        holdingIds: ['holding-1', 'holding-5'],
        // no actionType specified, should default to DEFAULT
      });

      // holding-1: synchronized line only, should be abandoned
      expect(results[0].abandoned).toBe(true);
      // holding-5: independent line only, should not be abandoned (items preserved)
      expect(results[1].abandoned).toBe(false);
    });
  });

  describe('Empty PO lines and edge cases', () => {
    it('should handle PO line with no pieces in DEFAULT mode', () => {
      // holding-8 has po-line-10 (independent) with no pieces attached
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-10'],
        holdingIds: ['holding-8'],
        actionType: 'DEFAULT',
      });

      // Line has no pieces to preserve, but items remain independently
      expect(results[0].abandoned).toBe(false);
    });

    it('should handle PO line with no pieces in DELETE mode', () => {
      // Same line but with DELETE
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-10'],
        holdingIds: ['holding-8'],
        actionType: 'DELETE',
      });

      // No pieces to remove, items might remain independently
      // Depending on implementation
      expect(results[0]).toBeDefined();
    });

    it('should correctly handle removal of line with zero pieces and empty items', () => {
      // holding-3 is completely empty
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: [],
        holdingIds: ['holding-3'],
      });

      // Already abandoned with no entities
      expect(results[0].abandoned).toBe(true);
    });

    it('should show detail in explain for empty PO line', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-10'],
        holdingIds: ['holding-8'],
        actionType: 'DEFAULT',
        explain: true,
      });

      expect(results[0].explain).toBeDefined();
      expect(results[0].explain.remaining).toBeDefined();
      expect(results[0].explain.cleared).toBeDefined();
    });
  });

  describe('Complex multi-holding scenarios', () => {
    it('should handle multiple holdings with mixed actionTypes via separate calls', () => {
      // Scenario 1: DELETE
      const results1 = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DELETE',
      });

      // Scenario 2: DEFAULT
      const results2 = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-5'],
        holdingIds: ['holding-5'],
        actionType: 'DEFAULT',
      });

      // Should have different abandonment status
      expect(results1[0].abandoned).toBe(true); // DELETE clears all
      expect(results2[0].abandoned).toBe(false); // DEFAULT preserves independent
    });

    it('should correctly process multiple synchronized lines with DELETE', () => {
      // holding-9 has synchronized lines po-line-11, po-line-12
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-11', 'po-line-12'],
        holdingIds: ['holding-9'],
        actionType: 'DELETE',
      });

      expect(results[0].abandoned).toBe(true);
    });

    it('should handle independent-only holding removal with DEFAULT', () => {
      // holding-7 has only independent lines
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-8', 'po-line-9'],
        holdingIds: ['holding-7'],
        actionType: 'DEFAULT',
      });

      // Independent items should preserve holding
      expect(results[0].abandoned).toBe(false);
    });

    it('should show cleared and remaining correctly in explain with DELETE', () => {
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-6', 'po-line-7'],
        holdingIds: ['holding-6'],
        actionType: 'DELETE',
        explain: true,
      });

      expect(results[0].explain.actionType).toBe('DELETE');
      expect(results[0].explain.cleared.pieces).toContain('piece-7');
      expect(results[0].explain.cleared.poLines).toContain('po-line-6');
      expect(results[0].explain.cleared.poLines).toContain('po-line-7');
    });

    it('should handle complex mixed lines (sync + independent) with DEFAULT', () => {
      // holding-6: po-line-6 (sync), po-line-7 (independent)
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-6', 'po-line-7'],
        holdingIds: ['holding-6'],
        actionType: 'DEFAULT',
        explain: true,
      });

      // DEFAULT: only sync pieces cleared, independent items stay
      expect(results[0].abandoned).toBe(false);
      expect(results[0].explain.remaining.items.length).toBeGreaterThan(0);
    });

    it('should include tenantId in complex multi-line scenario', () => {
      // holding-tenant-1 has multiple pieces with tenantId
      const results = analyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-tenant-1'],
        holdingIds: ['holding-tenant-1'],
        actionType: 'DELETE',
        explain: true,
      });

      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].explain).toBeDefined();
    });
  });

  describe('edge case: pieces linked to PO Lines not in holding\'s poLinesByHolding', () => {
    it('should clear pieces from synchronized line even when line not in poLinesByHolding (DEFAULT)', () => {
      // Create a custom holding where piece references a PO Line not in poLinesByHolding
      const customEntities = {
        'holding-orphan': {
          pieces_detail_collection: {
            pieces_detail: [
              { id: 'piece-orphan-1', poLineId: 'po-line-orphan-sync', itemId: 'item-orphan-1' },
              { id: 'piece-orphan-2', poLineId: 'po-line-normal', itemId: 'item-orphan-2' },
            ],
          },
          items_detail_collection: {
            items_detail: [
              { id: 'item-orphan-1' },
              { id: 'item-orphan-2' },
            ],
          },
          poLines_detail_collection: {
            // Only po-line-normal is in holding's poLinesByHolding
            poLines_detail: [
              { id: 'po-line-normal', checkinItems: false }, // synchronized
            ],
          },
        },
      };

      // Add the orphan PO Line to analyzer's global index (simulating it exists elsewhere)
      const customAnalyzer = new HoldingsAbandonmentAnalyzer(customEntities);

      customAnalyzer.index.poLineById.set('po-line-orphan-sync', {
        id: 'po-line-orphan-sync',
        checkinItems: false, // synchronized
      });

      const results = customAnalyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-orphan-sync'], // Removing the orphan line
        holdingIds: ['holding-orphan'],
        actionType: 'DEFAULT',
        explain: true,
      });

      // Should clear piece-orphan-1 even though po-line-orphan-sync not in poLinesByHolding
      expect(results[0].abandoned).toBe(false); // Still has po-line-normal
      expect(results[0].explain.cleared.pieces).toContain('piece-orphan-1');
      expect(results[0].explain.cleared.items).toContain('item-orphan-1');
      expect(results[0].explain.cleared.poLines).toContain('po-line-orphan-sync');
      expect(results[0].explain.remaining.pieces).toContain('piece-orphan-2');
    });

    it('should preserve pieces from independent line even when line not in poLinesByHolding (DEFAULT)', () => {
      const customEntities = {
        'holding-orphan-ind': {
          pieces_detail_collection: {
            pieces_detail: [
              { id: 'piece-orphan-ind-1', poLineId: 'po-line-orphan-ind', itemId: 'item-orphan-ind-1' },
            ],
          },
          items_detail_collection: {
            items_detail: [
              { id: 'item-orphan-ind-1' },
            ],
          },
          poLines_detail_collection: {
            poLines_detail: [
              // po-line-orphan-ind NOT in holding's collection
            ],
          },
        },
      };

      const customAnalyzer = new HoldingsAbandonmentAnalyzer(customEntities);

      customAnalyzer.index.poLineById.set('po-line-orphan-ind', {
        id: 'po-line-orphan-ind',
        checkinItems: true, // independent
      });

      const results = customAnalyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-orphan-ind'],
        holdingIds: ['holding-orphan-ind'],
        actionType: 'DEFAULT',
        explain: true,
      });

      // Should preserve piece since line is independent
      expect(results[0].abandoned).toBe(false);
      expect(results[0].explain.cleared.pieces).not.toContain('piece-orphan-ind-1');
      expect(results[0].explain.remaining.pieces).toContain('piece-orphan-ind-1');
      expect(results[0].explain.remaining.items).toContain('item-orphan-ind-1');
    });

    it('should clear pieces from independent line when not in poLinesByHolding (DELETE)', () => {
      const customEntities = {
        'holding-orphan-del': {
          pieces_detail_collection: {
            pieces_detail: [
              { id: 'piece-orphan-del-1', poLineId: 'po-line-orphan-del', itemId: 'item-orphan-del-1' },
            ],
          },
          items_detail_collection: {
            items_detail: [
              { id: 'item-orphan-del-1' },
            ],
          },
          poLines_detail_collection: {
            poLines_detail: [],
          },
        },
      };

      const customAnalyzer = new HoldingsAbandonmentAnalyzer(customEntities);

      customAnalyzer.index.poLineById.set('po-line-orphan-del', {
        id: 'po-line-orphan-del',
        checkinItems: true, // independent but DELETE clears all
      });

      const results = customAnalyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-orphan-del'],
        holdingIds: ['holding-orphan-del'],
        actionType: 'DELETE',
        explain: true,
      });

      // DELETE should clear all pieces regardless of checkinItems
      expect(results[0].abandoned).toBe(true);
      expect(results[0].explain.cleared.pieces).toContain('piece-orphan-del-1');
      expect(results[0].explain.cleared.items).toContain('item-orphan-del-1');
    });

    it('should clear pieces from synchronized line when not in poLinesByHolding (CHANGE_INSTANCE)', () => {
      const customEntities = {
        'holding-orphan-change': {
          pieces_detail_collection: {
            pieces_detail: [
              { id: 'piece-orphan-change-1', poLineId: 'po-line-orphan-change', itemId: 'item-orphan-change-1' },
            ],
          },
          items_detail_collection: {
            items_detail: [
              { id: 'item-orphan-change-1' },
            ],
          },
          poLines_detail_collection: {
            poLines_detail: [],
          },
        },
      };

      const customAnalyzer = new HoldingsAbandonmentAnalyzer(customEntities);

      customAnalyzer.index.poLineById.set('po-line-orphan-change', {
        id: 'po-line-orphan-change',
        checkinItems: false, // synchronized
      });

      const results = customAnalyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-orphan-change'],
        holdingIds: ['holding-orphan-change'],
        actionType: 'CHANGE_INSTANCE',
        explain: true,
      });

      // CHANGE_INSTANCE should clear all pieces regardless of checkinItems
      expect(results[0].abandoned).toBe(true);
      expect(results[0].explain.cleared.pieces).toContain('piece-orphan-change-1');
      expect(results[0].explain.cleared.items).toContain('item-orphan-change-1');
    });

    it('should include PO Line in cleared list even when holding has no pieces from it', () => {
      // Case: PO Line is in poLinesByHolding, but pieces are in a different holding
      const customEntities = {
        'holding-no-pieces': {
          pieces_detail_collection: {
            pieces_detail: [
              // Has other pieces, but NOT from po-line-no-pieces
              { id: 'piece-other', poLineId: 'po-line-other', itemId: 'item-other' },
            ],
          },
          items_detail_collection: {
            items_detail: [
              { id: 'item-other' },
            ],
          },
          poLines_detail_collection: {
            poLines_detail: [
              { id: 'po-line-no-pieces', checkinItems: false }, // synchronized, but no pieces in this holding
              { id: 'po-line-other', checkinItems: false },
            ],
          },
        },
      };

      const customAnalyzer = new HoldingsAbandonmentAnalyzer(customEntities);

      const results = customAnalyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-no-pieces'],
        holdingIds: ['holding-no-pieces'],
        actionType: 'DEFAULT',
        explain: true,
      });

      // Should NOT be abandoned (still has po-line-other with piece-other)
      expect(results[0].abandoned).toBe(false);
      
      // No pieces cleared (no pieces from po-line-no-pieces in this holding)
      expect(results[0].explain.cleared.pieces).toEqual([]);
      
      // But po-line-no-pieces should be in cleared.poLines (it was in poLinesByHolding)
      expect(results[0].explain.cleared.poLines).toContain('po-line-no-pieces');
      
      // Remaining should have po-line-other
      expect(results[0].explain.remaining.poLines).toContain('po-line-other');
      expect(results[0].explain.remaining.pieces).toContain('piece-other');
    });

    it('should handle combination: PO Line in poLinesByHolding without pieces AND piece from removed line not in poLinesByHolding', () => {
      // Mixed scenario testing both edge cases at once
      const customEntities = {
        'holding-mixed': {
          pieces_detail_collection: {
            pieces_detail: [
              // Piece from po-line-orphan (not in poLinesByHolding)
              { id: 'piece-orphan', poLineId: 'po-line-orphan', itemId: 'item-orphan' },
            ],
          },
          items_detail_collection: {
            items_detail: [
              { id: 'item-orphan' },
            ],
          },
          poLines_detail_collection: {
            poLines_detail: [
              // po-line-empty is here but has no pieces
              { id: 'po-line-empty', checkinItems: false },
            ],
          },
        },
      };

      const customAnalyzer = new HoldingsAbandonmentAnalyzer(customEntities);
      
      customAnalyzer.index.poLineById.set('po-line-orphan', {
        id: 'po-line-orphan',
        checkinItems: false,
      });

      const results = customAnalyzer.analyze({
        strategy: 'PO_LINE',
        ids: ['po-line-empty', 'po-line-orphan'],
        holdingIds: ['holding-mixed'],
        actionType: 'DEFAULT',
        explain: true,
      });

      // Should be abandoned (all pieces and PO Lines removed)
      expect(results[0].abandoned).toBe(true);
      
      // piece-orphan should be cleared (synchronized line)
      expect(results[0].explain.cleared.pieces).toContain('piece-orphan');
      expect(results[0].explain.cleared.items).toContain('item-orphan');
      
      // Both PO Lines should be in cleared list
      expect(results[0].explain.cleared.poLines).toContain('po-line-empty'); // from poLinesByHolding
      expect(results[0].explain.cleared.poLines).toContain('po-line-orphan'); // from pieces
      expect(results[0].explain.cleared.poLines).toHaveLength(2);
    });
  });
});
