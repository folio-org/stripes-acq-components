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
      const remainingPieces = pieces
        .filter((p) => !closure.pieces.has(p.id))
        .concat(closure.incoming?.get(holdingId)?.pieces || []);

      console.group();
      console.log(closure.incoming);
      console.log(closure.incoming?.get(holdingId));
      console.log(holdingId);
      console.log(remainingPieces, remainingPieces);
      console.groupEnd();

      // Remaining items (not linked to cleared pieces)
      const baseRemainingItems = items.filter((i) => !closure.items.has(i.id));

      // Add incoming items (avoid duplicates)
      const incomingItems = (() => {
        const incoming = closure.incoming?.get(holdingId);

        if (!incoming) return [];

        const remainingItemIds = new Set(baseRemainingItems.map((i) => i.id));

        return incoming.items
          .filter((itemId) => !remainingItemIds.has(itemId))
          .map((itemId) => index.itemById?.get(itemId))
          .filter(Boolean);
      })();

      const remainingItems = baseRemainingItems.concat(incomingItems);

      // Determine which PO Lines should preserve holding connection:
      // 1. Lines with remaining pieces (have other pieces in this holding)
      // 2. Independent lines (checkinItems=true) - ALWAYS preserve connection
      // 3. Lines from incoming pieces (new connections)
      const baseRemainingPoLines = poLines.filter((pl) => {
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
      const incomingPoLines = (() => {
        const incoming = closure.incoming?.get(holdingId);

        if (!incoming?.poLines.length) return [];

        const existingPoLineIds = new Set(baseRemainingPoLines.map((pl) => pl.id));

        return incoming.poLines
          .filter((poLineId) => !existingPoLineIds.has(poLineId))
          .map((poLineId) => index.poLineById?.get(poLineId))
          .filter(Boolean);
      })();

      const remainingPoLines = baseRemainingPoLines.concat(incomingPoLines);

      return this.buildResult({
        explain,
        holdingId,
        items,
        itemsToClear: items.filter((i) => closure.items.has(i.id)),
        pieces,
        piecesToClear,
        poLines,
        poLinesToClear: Array.from(poLinesToClearSet).map((id) => ({ id })),
        remainingItems,
        remainingPieces,
        remainingPoLines,
      });
    });
  }
}
