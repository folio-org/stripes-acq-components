import { HoldingsAbandonmentBaseStrategy } from './BaseStrategy';

/**
 * Strategy: PIECE
 * Treats incoming ids as pieceIds
 */
export class HoldingsAbandonmentPieceStrategy extends HoldingsAbandonmentBaseStrategy {
  static name = 'PIECE';

  static buildClosure({ ids, index }) {
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

    this.assertValidClosure(closure);

    return closure;
  }
}
