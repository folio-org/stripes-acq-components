import { HoldingsAbandonmentBaseStrategy } from './BaseStrategy';

/**
 * Strategy: PO LINE
 * Treats incoming ids as poLineIds.
 */
export class HoldingsAbandonmentPOLineStrategy extends HoldingsAbandonmentBaseStrategy {
  static name = 'PO_LINE';
  static ACTION_TYPES = {
    DEFAULT: 'DEFAULT',
    CHANGE_INSTANCE: 'CHANGE_INSTANCE',
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
      getClearPieces(pieces, closure, index) {
        // Only clear pieces from synchronized lines
        // Check each piece's poLineId directly in closure and look up checkinItems status
        return pieces.filter((p) => {
          if (!closure.poLines.has(p.poLineId)) return false;

          const poLine = index.poLineById?.get(p.poLineId);

          return poLine?.checkinItems === false;
        });
      },
    },
    /**
     * CHANGE_INSTANCE: changing instance of open PO
     * All pieces and items are cleared, including independent ones
     */
    [this.ACTION_TYPES.CHANGE_INSTANCE]: {
      getClearPieces(pieces, closure) {
        // Clear pieces from all removed lines (both synchronized and independent)
        return pieces.filter((p) => closure.poLines.has(p.poLineId));
      },
    },
    /**
     * DELETE: deletion of PO or PO Lines
     * All pieces and items are cleared, including independent ones
     */
    [this.ACTION_TYPES.DELETE]: {
      getClearPieces(pieces, closure) {
        // Clear pieces from all removed lines (both synchronized and independent)
        return pieces.filter((p) => closure.poLines.has(p.poLineId));
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
   * DEFAULT: (for unopen PO)
   * - Synchronized lines: pieces/items removed
   * - Independent lines: pieces/items preserved
   *
   * CHANGE_INSTANCE (for POL changing instance of open PO):
   * - Synchronized lines: pieces/items removed
   * - Independent lines: pieces/items removed (clean all connections)
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

      // Use operation handler to determine which pieces should be cleared
      // Handler checks closure.poLines directly and looks up PO Line details in index
      const piecesToClear = handler.getClearPieces(pieces, closure, index);
      const itemsToClear = items.filter((i) => piecesToClear.some((p) => p.itemId === i.id));

      // Calculate what remains after clearing
      const remainingPieces = pieces.filter((p) => !piecesToClear.some((cp) => cp.id === p.id));
      const remainingItems = items.filter((i) => !itemsToClear.some((ci) => ci.id === i.id));
      const remainingPoLines = poLines.filter((pl) => !closure.poLines.has(pl.id));

      // Build poLinesToClear from:
      // 1. PO Lines in poLinesByHolding that are being removed
      // 2. PO Lines referenced by pieces that are being removed (may not be in poLinesByHolding)
      const poLineIdsToClear = new Set();

      // Add from poLinesByHolding
      poLines.forEach((pl) => {
        if (closure.poLines.has(pl.id)) {
          poLineIdsToClear.add(pl.id);
        }
      });

      // Add from pieces (covers case where piece's PO Line not in poLinesByHolding)
      pieces.forEach((p) => {
        if (closure.poLines.has(p.poLineId)) {
          poLineIdsToClear.add(p.poLineId);
        }
      });

      const poLinesToClear = Array.from(poLineIdsToClear).map((id) => ({ id }));

      return this.buildResult({
        actionType,
        explain,
        holdingId,
        items,
        itemsToClear,
        pieces,
        piecesToClear,
        poLines,
        poLinesToClear,
        remainingItems,
        remainingPieces,
        remainingPoLines,
      });
    });
  }
}
