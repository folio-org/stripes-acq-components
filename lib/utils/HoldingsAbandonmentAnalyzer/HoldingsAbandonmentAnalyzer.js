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
    ...rest
  }) {
    const Strategy = this.strategies.get(strategy);

    if (!Strategy) {
      throw new Error(`Unknown strategy: ${strategy}`);
    }

    const closure = Strategy.buildClosure({
      ids,
      index: this.index,
    });

    return Strategy.analyzeHoldings({
      holdingIds,
      closure,
      index: this.index,
      explain,
      ...rest,
    });
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
