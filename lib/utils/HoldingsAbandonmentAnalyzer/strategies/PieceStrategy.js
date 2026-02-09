import { HoldingsAbandonmentBaseStrategy } from './BaseStrategy';

/**
 * Strategy: PIECE
 * Treats incoming ids as pieceIds
 */
export class HoldingsAbandonmentPieceStrategy extends HoldingsAbandonmentBaseStrategy {
  static name = 'PIECE';

  static buildClosure({ ids, index, incoming }) {
    const pieces = new Set(ids);
    const items = new Set();
    const poLines = new Set();

    ids.forEach(pieceId => {
      const piece = index.pieceById.get(pieceId);

      if (!piece) return;

      if (piece.itemId) items.add(piece.itemId);
      if (piece.poLineId) poLines.add(piece.poLineId);
    });

    const closure = { poLines, pieces, items };

    // Process incoming pieces if provided (for swap/move operations)
    if (incoming) {
      const incomingByHolding = new Map();

      Object.entries(incoming).forEach(([holdingId, pieceIds]) => {
        const incomingPieces = [];
        const incomingItems = new Set();
        const incomingPoLines = new Set();

        pieceIds.forEach(pieceId => {
          const piece = index.pieceById.get(pieceId);

          if (!piece) return;

          incomingPieces.push(piece);
          if (piece.itemId) incomingItems.add(piece.itemId);
          if (piece.poLineId) incomingPoLines.add(piece.poLineId);
        });

        incomingByHolding.set(holdingId, {
          pieces: incomingPieces,
          items: Array.from(incomingItems),
          poLines: Array.from(incomingPoLines),
        });
      });

      closure.incoming = incomingByHolding;
    }

    this.assertValidClosure(closure);

    return closure;
  }

  /**
   * Analyzes whether holdings become abandoned after removing pieces or changing holdings.
   *
   * When a piece is deleted or moved to another holding:
   * - The piece itself is removed from the holding
   * - The associated item (if any) is also moved/removed
   * - The PO Line connection is checked:
   *   - For synchronized lines (checkinItems=false): connection is cleared if no other pieces remain
   *   - For independent lines (checkinItems=true): connection is PRESERVED
   *
   * For swap/move operations (when incoming pieces provided in closure):
   * - Analyzes both outgoing AND incoming pieces
   * - Holding is NOT abandoned if it receives new pieces even if all current pieces removed
   *
   * Holding is abandoned if:
   * - No remaining pieces (excluding removed, including incoming)
   * - No remaining items (excluding those linked to removed pieces, including incoming)
   * - No remaining PO Lines (excluding those only connected via removed pieces, including incoming)
   * - BUT: Independent PO Lines are ALWAYS preserved and keep holding alive
   */
  static analyzeHoldings({
    closure,
    explain,
    holdingIds,
    index,
  }) {
    return holdingIds.map((holdingId) => {
      const pieces = index.piecesByHolding.get(holdingId) || [];
      const items = index.itemsByHolding.get(holdingId) || [];
      const poLines = index.poLinesByHolding.get(holdingId) || [];

      // Get pieces from this holding
      const piecesToClear = pieces.filter((p) => closure.pieces.has(p.id));
      const poLinesToClearSet = new Set(piecesToClear.map((p) => p.poLineId).filter(Boolean));

      // Remaining pieces (not being cleared)
      const remainingPieces = pieces.filter((p) => !closure.pieces.has(p.id));
      // Remaining items (not linked to cleared pieces)
      const remainingItems = items.filter((i) => !closure.items.has(i.id));

      // Add incoming pieces/items if this is a swap/move operation
      const incoming = closure.incoming?.get(holdingId);

      if (incoming) {
        remainingPieces.concat(incoming.pieces);
        // Add incoming items (avoid duplicates)
        const remainingItemIds = new Set(remainingItems.map((i) => i.id));

        incoming.items.forEach((itemId) => {
          if (!remainingItemIds.has(itemId)) {
            // Find item in index
            const item = index.itemById?.get(itemId);

            if (item) {
              remainingItems.push(item);
            }
          }
        });
      }

      // Determine which PO Lines should preserve holding connection:
      // 1. Lines with remaining pieces (have other pieces in this holding)
      // 2. Independent lines (checkinItems=true) - ALWAYS preserve connection
      // 3. Lines from incoming pieces (new connections)
      const remainingPoLines = poLines.filter((pl) => {
        // Independent lines always preserve connection
        if (pl.checkinItems === true) {
          return true;
        }

        // For synchronized lines: keep only if they have OTHER pieces in this holding
        // (not just the ones being cleared)
        const lineHasOtherPieces = remainingPieces.some((p) => p.poLineId === pl.id);

        return lineHasOtherPieces;
      });

      // Add incoming PO Lines (new connections from moved pieces)
      if (incoming && incoming.poLines.length > 0) {
        const remainingPoLineIds = new Set(remainingPoLines.map((pl) => pl.id));

        incoming.poLines.forEach((poLineId) => {
          if (!remainingPoLineIds.has(poLineId)) {
            const poLine = index.poLineById?.get(poLineId);

            if (poLine) {
              remainingPoLines.push(poLine);
            }
          }
        });
      }

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
          related: {
            pieces: pieces.map((p) => p.id),
            items: items.map((i) => i.id),
            poLines: poLines.map((pl) => pl.id),
          },
          cleared: {
            pieces: piecesToClear.map((p) => p.id),
            items: items.filter((i) => closure.items.has(i.id)).map((i) => i.id),
            poLines: Array.from(poLinesToClearSet),
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
