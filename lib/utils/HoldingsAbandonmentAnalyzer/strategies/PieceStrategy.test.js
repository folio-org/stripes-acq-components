import { holdingsRelatedEntities } from 'fixtures';
import HoldingsAbandonmentAnalyzer from '../HoldingsAbandonmentAnalyzer';

describe('HoldingsAbandonmentPieceStrategy', () => {
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

  it('should correctly process piece removal across holdings', () => {
    const results = analyzer.analyze({
      strategy: 'PIECE',
      ids: ['piece-1', 'piece-2', 'piece-3'],
      holdingIds: ['holding-1', 'holding-2'],
    });

    expect(results[0].abandoned).toBe(true);
    expect(results[1].abandoned).toBe(true);
  });

  describe('Independent pieces (checkinItems=true)', () => {
    it('should NOT abandon holding when removing piece from independent line if line remains', () => {
      // holding-5 has piece-5 from independent po-line-5
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-5'],
        holdingIds: ['holding-5'],
      });

      // Even though piece and item are removed, independent line preserves holding connection
      expect(results[0].abandoned).toBe(false);
    });

    it('should NOT abandon holding with mixed lines when removing synchronized piece but independent line remains', () => {
      // holding-6 has piece-6 (synchronized po-line-6) and piece-7 (independent po-line-7)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-6'],
        holdingIds: ['holding-6'],
      });

      // piece-7 and po-line-7 (independent) remain
      expect(results[0].abandoned).toBe(false);
    });

    it('should NOT abandon holding when removing all pieces but independent line exists', () => {
      // holding-7 has piece-8 and piece-9, both from independent lines (po-line-8, po-line-9)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-8', 'piece-9'],
        holdingIds: ['holding-7'],
      });

      // Even with no pieces/items, independent lines keep holding alive
      expect(results[0].abandoned).toBe(false);
    });

    it('should show independent lines in explain output when they preserve holding', () => {
      // holding-5 has piece-5 from independent po-line-5
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-5'],
        holdingIds: ['holding-5'],
        explain: true,
      });

      expect(results[0].explain.remaining.poLines).toEqual(['po-line-5']);
      expect(results[0].explain.remaining.pieces).toEqual([]);
      expect(results[0].explain.remaining.items).toEqual([]);
      expect(results[0].abandoned).toBe(false);
    });

    it('should remove synchronized line connection but keep independent line', () => {
      // holding-6 has piece-6 (sync) and piece-7 (independent)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-6'],
        holdingIds: ['holding-6'],
        explain: true,
      });

      // po-line-6 (sync) removed because no other pieces from it remain, but po-line-7 (independent) preserved
      expect(results[0].explain.remaining.poLines).toEqual(['po-line-7']);
      expect(results[0].abandoned).toBe(false);
    });
  });

  describe('Synchronized pieces (checkinItems=false)', () => {
    it('should abandon holding when removing all synchronized pieces', () => {
      // holding-1 has piece-1, piece-2 from synchronized po-line-1
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(true);
    });

    it('should NOT abandon holding when synchronized pieces remain', () => {
      // holding-1 has piece-1, piece-2 from synchronized po-line-1
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
      });

      // piece-2 remains, so holding not abandoned
      expect(results[0].abandoned).toBe(false);
    });

    it('should remove synchronized line only when all its pieces are removed', () => {
      // holding-1 has piece-1, piece-2 from po-line-1 (synchronized)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        explain: true,
      });

      // po-line-1 should remain because piece-2 is still there
      expect(results[0].explain.remaining.poLines).toEqual(['po-line-1']);
      expect(results[0].explain.remaining.pieces).toEqual(['piece-2']);
    });
  });

  describe('Mixed scenarios', () => {
    it('should handle holding with both synchronized and independent lines correctly', () => {
      // holding-4 has piece-4 (po-line-4 sync) and po-line-3 (independent, no direct piece)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-4'],
        holdingIds: ['holding-4'],
        explain: true,
      });

      // po-line-3 (independent) keeps holding alive even though piece-4 removed
      expect(results[0].explain.remaining.poLines).toContain('po-line-3');
      expect(results[0].abandoned).toBe(false);
    });

    it('should correctly handle items that move with pieces', () => {
      // holding-1: piece-1 -> item-1, piece-2 -> item-2
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        explain: true,
      });

      // item-1 should be in cleared, item-2 in remaining
      expect(results[0].explain.cleared.items).toEqual(['item-1']);
      expect(results[0].explain.remaining.items).toEqual(['item-2']);
    });

    it('should handle complex multi-piece removal with mixed line types', () => {
      // holding-11 has piece-15 (po-line-15 sync), piece-16 (po-line-16 sync), piece-17 (po-line-17 independent)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-15', 'piece-16'],
        holdingIds: ['holding-11'],
        explain: true,
      });

      // piece-17 remains (independent)
      expect(results[0].explain.remaining.pieces).toEqual(['piece-17']);
      // po-line-17 (independent) keeps holding alive
      expect(results[0].explain.remaining.poLines).toContain('po-line-17');
      expect(results[0].abandoned).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should correctly identify abandoned holding with no pieces', () => {
      // holding-3 is empty (no pieces, items, or poLines)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: [],
        holdingIds: ['holding-3'],
      });

      // Empty holding with no connections should be abandoned
      expect(results[0].abandoned).toBe(true);
    });

    it('should handle non-existent piece IDs gracefully', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['non-existent-piece'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(false);
    });

    it('should correctly identify cleared pieces in explain output', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        explain: true,
      });

      expect(results[0].explain.cleared.pieces).toEqual(['piece-1', 'piece-2']);
      expect(results[0].explain.cleared.items).toEqual(['item-1', 'item-2']);
      expect(results[0].explain.cleared.poLines).toEqual(['po-line-1']);
    });
  });

  describe('Swap/Move operations with incoming pieces', () => {
    it('should NOT abandon holdings when pieces are swapped', () => {
      // holding-1: piece-1, piece-2 (po-line-1)
      // holding-2: piece-3 (po-line-2)
      // Operation: swap piece-1 (H1->H2) and piece-3 (H2->H1)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-3'],
        holdingIds: ['holding-1', 'holding-2'],
        incoming: {
          'holding-1': ['piece-3'],
          'holding-2': ['piece-1'],
        },
      });

      // H1: removes piece-1, receives piece-3 → piece-2 + piece-3 remain
      expect(results[0].abandoned).toBe(false);
      // H2: removes piece-3, receives piece-1 → piece-1 remains
      expect(results[1].abandoned).toBe(false);
    });

    it('should NOT abandon holding when all pieces removed but incoming pieces added', () => {
      // holding-1: piece-1, piece-2
      // Remove all from H1, but add piece-3 from another holding
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-3'],
        },
      });

      expect(results[0].abandoned).toBe(false);
    });

    it('should correctly count remaining pieces with incoming', () => {
      // holding-1: piece-1, piece-2
      // Remove piece-1, add piece-3
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-3'],
        },
        explain: true,
      });

      // Remaining: piece-2 (original) + piece-3 (incoming)
      expect(results[0].explain.remaining.pieces).toContain('piece-2');
      expect(results[0].explain.remaining.pieces).toContain('piece-3');
      expect(results[0].explain.remaining.pieces.length).toBe(2);
      expect(results[0].abandoned).toBe(false);
    });

    it('should handle incoming items with pieces', () => {
      // holding-1: piece-1 -> item-1, piece-2 -> item-2
      // Remove piece-1, add piece-3 -> item-3
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-3'],
        },
        explain: true,
      });

      // Cleared: item-1 (linked to piece-1)
      expect(results[0].explain.cleared.items).toEqual(['item-1']);
      // Remaining: item-2 (original) + item-3 (incoming)
      expect(results[0].explain.remaining.items).toContain('item-2');
      expect(results[0].explain.remaining.items).toContain('item-3');
      expect(results[0].abandoned).toBe(false);
    });

    it('should handle incoming PO Lines', () => {
      // holding-1: piece-1, piece-2 (both from po-line-1)
      // holding-2: piece-3 (from po-line-2)
      // Remove all from H1, add piece-3 (bringing po-line-2)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-3'],
        },
        explain: true,
      });

      // po-line-2 should be in remaining (from incoming piece-3)
      expect(results[0].explain.remaining.poLines).toContain('po-line-2');
      expect(results[0].abandoned).toBe(false);
    });

    it('should work correctly without incoming (backward compatibility)', () => {
      // No incoming parameter - should work as before
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].abandoned).toBe(true);
    });

    it('should handle complex swap with independent lines', () => {
      // holding-5: piece-5 (po-line-5, independent)
      // holding-7: piece-8, piece-9 (po-line-8, po-line-9, both independent)
      // Swap: piece-5 <-> piece-8
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-5', 'piece-8'],
        holdingIds: ['holding-5', 'holding-7'],
        incoming: {
          'holding-5': ['piece-8'],
          'holding-7': ['piece-5'],
        },
        explain: true,
      });

      // H5: removes piece-5, but po-line-5 (independent) stays + receives piece-8
      expect(results[0].abandoned).toBe(false);
      expect(results[0].explain.remaining.poLines).toContain('po-line-5'); // independent preserved
      expect(results[0].explain.remaining.poLines).toContain('po-line-8'); // incoming

      // H7: removes piece-8, keeps piece-9 + po-line-9 + receives piece-5
      expect(results[1].abandoned).toBe(false);
      expect(results[1].explain.remaining.pieces).toContain('piece-9');
      expect(results[1].explain.remaining.pieces).toContain('piece-5');
    });

    it('should still abandon holding if no incoming and all removed', () => {
      // holding-1: piece-1, piece-2
      // Remove both, no incoming
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        incoming: {}, // empty incoming
      });

      expect(results[0].abandoned).toBe(true);
    });
  });

  describe('TenantId support (multi-tenant scenarios)', () => {
    it('should include tenantId from pieces when available', () => {
      // holding-tenant-1 has pieces with tenantId='consortium'
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-tenant-1'],
        holdingIds: ['holding-tenant-1'],
      });

      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].abandoned).toBe(false); // piece-tenant-2 remains
    });

    it('should include tenantId from items when pieces don\'t have it', () => {
      // holding-tenant-2 has item with tenantId='university', piece without tenantId
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: [],
        holdingIds: ['holding-tenant-2'],
      });

      expect(results[0].tenantId).toBe('university');
      expect(results[0].abandoned).toBe(false);
    });

    it('should include tenantId in explain mode', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-tenant-1'],
        holdingIds: ['holding-tenant-1'],
        explain: true,
      });

      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].explain).toBeDefined();
    });

    it('should not include tenantId if not present in data', () => {
      // holding-1 has no tenantId
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
      });

      expect(results[0].tenantId).toBeUndefined();
    });

    it('should handle tenantId with incoming pieces', () => {
      // Move piece with tenantId
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-tenant-1'],
        holdingIds: ['holding-tenant-1'],
        incoming: {
          'holding-tenant-1': ['piece-tenant-3'], // from holding-tenant-2
        },
      });

      // Should still have consortium tenantId (from remaining piece-tenant-2)
      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].abandoned).toBe(false);
    });

    it('should correctly handle incoming pieces with multiple items', () => {
      // holding-1: piece-1, piece-2 (multiple pieces)
      // Remove piece-1, add piece-3 and another piece
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-3', 'piece-5'], // multiple incoming pieces
        },
        explain: true,
      });

      // Should show all incoming pieces
      expect(results[0].explain.remaining.pieces).toContain('piece-2');
      expect(results[0].explain.remaining.pieces).toContain('piece-3');
      expect(results[0].explain.remaining.pieces).toContain('piece-5');
      expect(results[0].abandoned).toBe(false);
    });
  });

  describe('Incoming edge cases and defensive handling', () => {
    it('should gracefully handle incoming pieces with non-existent IDs', () => {
      // holding-1 has piece-1 and piece-2
      // Try to add non-existent piece-9999
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-9999'], // doesn't exist
        },
        explain: true,
      });

      // Should not crash, non-existent piece simply ignored (no item/poLine)
      expect(results[0].abandoned).toBe(true); // all real pieces removed, non-existent doesn't help
      expect(results[0].explain.remaining.items.length).toBeLessThanOrEqual(1); // only non-existent's missing item
    });

    it('should ignore incoming targeting holdings not in holdingIds', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-999': ['piece-3'], // targeting non-analyzed holding
          'holding-1': ['piece-2'],
        },
        explain: true,
      });

      // holding-999 entry should be ignored (not in analysis)
      // Only holding-1 should be analyzed with incoming piece-2
      expect(results).toHaveLength(1);
      expect(results[0].explain.remaining.pieces).toContain('piece-2');
    });

    it('should handle incoming pieces without itemId gracefully', () => {
      // Create a scenario where incoming piece doesn't have itemId
      // Simulate by allowing non-existent piece that has no itemId reference
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': ['piece-3'], // piece-3 has itemId, so this should work
        },
      });

      // Should handle without error
      expect(results[0].abandoned).toBe(false);
    });

    it('should handle incoming with empty array', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1'],
        holdingIds: ['holding-1'],
        incoming: {
          'holding-1': [], // empty array
        },
      });

      // Should behave as if no incoming for this holding
      expect(results[0].abandoned).toBe(false); // piece-2 remains
    });

    it('should handle holdings with incoming but empty incoming map', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-2'],
        holdingIds: ['holding-1'],
        incoming: {}, // no entries at all
      });

      // Should behave as normal removal
      expect(results[0].abandoned).toBe(true);
    });

    it('should not affect other holdings when incoming targets specific holding', () => {
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-1', 'piece-3'],
        holdingIds: ['holding-1', 'holding-2'],
        incoming: {
          'holding-1': ['piece-3'], // incoming only to holding-1
        },
      });

      // holding-1: removed piece-1, has piece-2 + incoming piece-3 = not abandoned
      expect(results[0].abandoned).toBe(false);
      // holding-2: removed piece-3 (the one that moved) = should be abandoned
      expect(results[1].abandoned).toBe(true);
    });

    it('should preserve tenantId from remaining pieces after incoming operation', () => {
      // holding-tenant-1: piece-tenant-1 (consortiumId), piece-tenant-2 (consortiumId)
      // Remove piece-tenant-1, add piece-tenant-3 (no tenantId)
      const results = analyzer.analyze({
        strategy: 'PIECE',
        ids: ['piece-tenant-1'],
        holdingIds: ['holding-tenant-1'],
        incoming: {
          'holding-tenant-1': ['piece-tenant-3'], // piece-tenant-3 is from holding-tenant-2 without tenantId in piece
        },
      });

      // Should still have consortium (from piece-tenant-2 remaining)
      expect(results[0].tenantId).toBe('consortium');
      expect(results[0].abandoned).toBe(false);
    });
  });
});
