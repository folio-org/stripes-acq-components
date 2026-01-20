import {
  HoldingsAbandonmentPOLineStrategy,
  HoldingsAbandonmentPieceStrategy,
} from './strategies';

/**
 * HoldingsAbandonmentAnalyzer
 *
 * Determines whether holdings become abandoned
 * AFTER removing entities defined by a strategy.
 */
export default class HoldingsAbandonmentAnalyzer {
  // `holdingsDetails` - response from https://s3.amazonaws.com/foliodocs/api/mod-orders/r/holding-detail.html#orders_holding_detail_post
  constructor(holdingsDetails) {
    this.index = this.createIndex(holdingsDetails);

    this.strategies = new Map([
      [HoldingsAbandonmentPOLineStrategy.name, HoldingsAbandonmentPOLineStrategy],
      [HoldingsAbandonmentPieceStrategy.name, HoldingsAbandonmentPieceStrategy],
    ]);
  }

  analyze({
    explain = false,
    holdingIds,
    ids,
    strategy,
  }) {
    const Strategy = this.strategies.get(strategy);

    if (!Strategy) {
      throw new Error(`Unknown strategy: ${strategy}`);
    }

    const closure = Strategy.buildClosure({
      ids,
      index: this.index,
    });

    return holdingIds.map(holdingId => this.analyzeHolding(holdingId, closure, explain));
  }

  analyzeHolding(holdingId, closure, explain) {
    const pieces = this.index.piecesByHolding.get(holdingId) || [];
    const items = this.index.itemsByHolding.get(holdingId) || [];
    const poLines = this.index.poLinesByHolding.get(holdingId) || [];

    const remainingPieces = pieces.filter(p => !closure.pieces.has(p.id));
    const remainingItems = items.filter(i => !closure.items.has(i.id));
    const remainingPoLines = poLines.filter(pl => !closure.poLines.has(pl.id));

    const abandoned =
      remainingPieces.length === 0 &&
      remainingItems.length === 0 &&
      remainingPoLines.length === 0;

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
        // All entities related to the holding
        related: {
          pieces: pieces.map(p => p.id),
          items: items.map(i => i.id),
          poLines: poLines.map(pl => pl.id),
        },
        // Entities remaining after removal defined by the strategy
        remaining: {
          pieces: remainingPieces.map(p => p.id),
          items: remainingItems.map(i => i.id),
          poLines: remainingPoLines.map(pl => pl.id),
        },
      },
    };
  }

  // Creates index maps for quick lookup
  createIndex(holdingsDetails) {
    const piecesByHolding = new Map();
    const itemsByHolding = new Map();
    const poLinesByHolding = new Map();
    const piecesByPoLine = new Map();
    const pieceById = new Map();

    Object.entries(holdingsDetails).forEach(([holdingId, data]) => {
      const pieces = data.pieces_detail_collection?.pieces_detail || [];
      const items = data.items_detail_collection?.items_detail || [];
      const poLines = data.poLines_detail_collection?.poLines_detail || [];

      piecesByHolding.set(holdingId, pieces);
      itemsByHolding.set(holdingId, items);
      poLinesByHolding.set(holdingId, poLines);

      pieces.forEach(piece => {
        pieceById.set(piece.id, piece);

        if (!piecesByPoLine.has(piece.poLineId)) {
          piecesByPoLine.set(piece.poLineId, []);
        }
        piecesByPoLine.get(piece.poLineId).push(piece);
      });
    });

    return {
      piecesByHolding,
      itemsByHolding,
      poLinesByHolding,
      piecesByPoLine,
      pieceById,
    };
  }
}
