import { HoldingsAbandonmentBaseStrategy } from './BaseStrategy';

/**
 * Strategy: PO LINE
 * Treats incoming ids as poLineIds
 */
export class HoldingsAbandonmentPOLineStrategy extends HoldingsAbandonmentBaseStrategy {
  static name = 'PO_LINE';

  static buildClosure({ ids, index }) {
    const poLines = new Set(ids);
    const pieces = new Set();
    const items = new Set();

    ids.forEach(poLineId => {
      const relatedPieces = index.piecesByPoLine.get(poLineId) || [];

      relatedPieces.forEach(piece => {
        pieces.add(piece.id);
        if (piece.itemId) items.add(piece.itemId);
      });
    });

    const closure = { poLines, pieces, items };

    this.assertValidClosure(closure);

    return closure;
  }
}
