import { HoldingsAbandonmentBaseStrategy } from './BaseStrategy';

/**
 * Strategy: PO LINE
 * Treats incoming ids as poLineIds.
 */
export class HoldingsAbandonmentPOLineStrategy extends HoldingsAbandonmentBaseStrategy {
  static name = 'PO_LINE';
  static ACTION_TYPES = {
    DEFAULT: 'DEFAULT',
    DELETE: 'DELETE',
  };

  /**
   * Operation handlers for different action types.
   * Each handler determines which entities should be cleared from closure.
   */
  static operationHandlers = {
    /**
     * DEFAULT:
     * Independent pieces are preserved (not cleared)
     */
    [this.ACTION_TYPES.DEFAULT]: {
      getClearPieces(pieces, poLinesToClear) {
        // Only clear pieces from synchronized lines
        const synchronizedLines = poLinesToClear.filter((pl) => pl.checkinItems === false);

        return pieces.filter((p) => synchronizedLines.some((pl) => pl.id === p.poLineId));
      },
    },
    /**
     * DELETE: deletion of PO or PO Lines
     * All pieces and items are cleared, including independent ones
     */
    [this.ACTION_TYPES.DELETE]: {
      getClearPieces(pieces, poLinesToClear) {
        // Clear pieces from all removed lines (both synchronized and independent)
        return pieces.filter((p) => poLinesToClear.some((pl) => pl.id === p.poLineId));
      },
    },
  };

  static buildClosure({ ids, index }) {
    const poLines = new Set(ids);
    const pieces = new Set();
    const items = new Set();

    ids.forEach(poLineId => {
      const relatedPieces = index.piecesByPoLine.get(poLineId) || [];

      // Add all related pieces and items to closure
      relatedPieces.forEach((piece) => {
        pieces.add(piece.id);
        if (piece.itemId) items.add(piece.itemId);
      });
    });

    const closure = { poLines, pieces, items };

    this.assertValidClosure(closure);

    return closure;
  }

  /**
   * Analyzes whether holdings become abandoned after removing PO lines.
   * Behavior depends on operation type:
   *
   * DEFAULT: (for unopen PO, change POL instance connection)
   * - Synchronized lines: pieces/items removed
   * - Independent lines: pieces/items preserved
   *
   * DELETE (PO/POL deletion):
   * - Synchronized lines: pieces/items removed
   * - Independent lines: pieces/items removed (clean all connections)
   */
  static analyzeHoldings({
    actionType = this.ACTION_TYPES.DEFAULT,
    closure,
    explain,
    holdingIds,
    index,
  }) {
    // Get operation handler for this action type
    const handler = this.operationHandlers[actionType];

    if (!handler) {
      throw new Error(`Unknown action type: ${actionType}`);
    }

    return holdingIds.map((holdingId) => {
      // Get all related entities for the holding
      const pieces = index.piecesByHolding.get(holdingId) || [];
      const items = index.itemsByHolding.get(holdingId) || [];
      const poLines = index.poLinesByHolding.get(holdingId) || [];

      // Find which lines are being removed
      const poLinesToClear = poLines.filter((pl) => closure.poLines.has(pl.id));

      // Use operation handler to determine which pieces should be cleared
      const piecesToClear = handler.getClearPieces(pieces, poLinesToClear);
      const itemsToClear = items.filter((i) => piecesToClear.some((p) => p.itemId === i.id));

      // Calculate what remains after clearing
      const remainingPieces = pieces.filter((p) => !piecesToClear.some((cp) => cp.id === p.id));
      const remainingItems = items.filter((i) => !itemsToClear.some((ci) => ci.id === i.id));
      const remainingPoLines = poLines.filter((pl) => !closure.poLines.has(pl.id));

      // Holding is abandoned if nothing remains
      const abandoned = (
        remainingPieces.length === 0 &&
        remainingItems.length === 0 &&
        remainingPoLines.length === 0
      );

      if (!explain) {
        return {
          abandoned,
          id: holdingId,
        };
      }

      return {
        id: holdingId,
        abandoned,
        explain: {
          actionType,
          related: {
            pieces: pieces.map((p) => p.id),
            items: items.map((i) => i.id),
            poLines: poLines.map((pl) => pl.id),
          },
          cleared: {
            pieces: piecesToClear.map((p) => p.id),
            items: itemsToClear.map((i) => i.id),
          },
          remaining: {
            pieces: remainingPieces.map((p) => p.id),
            items: remainingItems.map((i) => i.id),
            poLines: remainingPoLines.map((pl) => pl.id),
          },
        },
      };
    });
  }
}
