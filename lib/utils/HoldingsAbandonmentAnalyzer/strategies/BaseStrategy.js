/**
 * HoldingsAbandonmentBaseStrategy
 *
 * Abstract base class for abandonment strategies.
 * Each strategy must:
 * - define static `name`
 * - implement static `buildClosure({ ids, index })`
 * - implement static `analyzeHoldings({ holdingIds, closure, index, explain })`
 *
 * Closure must return:
 * {
 *   poLines: Set<string>,
 *   pieces: Set<string>,
 *   items: Set<string>
 * }
 */
export class HoldingsAbandonmentBaseStrategy {
  static name;

  static buildClosure() {
    throw new Error('Strategy must implement buildClosure()');
  }

  /**
   * Analyzes whether holdings become abandoned after removing entities defined by closure.
   * Must be implemented by each strategy with custom abandonment logic.
   * Processes multiple holdings in a batch for optimization.
   *
   * @param {Array<string>} holdingIds - Array of holding IDs to analyze
   * @param {Object} closure - The closure containing sets of entities to remove
   * @param {Object} index - The index containing all holdings data
   * @param {boolean} explain - Whether to include detailed explanation
   * @returns {Array<Object>} Array of analysis results for each holding
   */
  static analyzeHoldings() {
    throw new Error('Strategy must implement analyzeHoldings()');
  }

  /**
   * Helper to validate returned closure shape
   */
  static assertValidClosure(closure) {
    const keys = ['poLines', 'pieces', 'items'];

    keys.forEach(key => {
      if (!(closure[key] instanceof Set)) {
        throw new TypeError(
          `Strategy "${this.name}" returned invalid closure: "${key}" must be Set`,
        );
      }
    });
  }

  /**
   * Helper to build standardized result object for a holding
   * Handles abandonment logic, tenantId extraction, explain mode, and result structure
   *
   * @param {Object} params - Parameters for building result
   * @param {string} [params.actionType] - Optional action type for the operation
   * @param {boolean} params.explain - Whether to include detailed explanation
   * @param {string} params.holdingId - The holding ID
   * @param {Array} params.items - All items in the holding
   * @param {Array} params.itemsToClear - Items to be cleared
   * @param {Array} params.pieces - All pieces in the holding
   * @param {Array} params.piecesToClear - Pieces to be cleared
   * @param {Array} params.poLines - All PO lines in the holding
   * @param {Array} params.poLinesToClear - PO lines to be cleared
   * @param {Array} params.remainingItems - Remaining items
   * @param {Array} params.remainingPieces - Remaining pieces
   * @param {Array} params.remainingPoLines - Remaining PO lines
   * @returns {Object} Standardized result object
   */
  static buildResult({
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
  }) {
    // Determine if holding is abandoned
    const abandoned = (
      remainingPieces.length === 0 &&
      remainingItems.length === 0 &&
      remainingPoLines.length === 0
    );

    // Extract tenantId from pieces or items (optional field)
    // Try pieces first, then items
    const tenantId = (
      pieces.find((p) => p.tenantId)?.tenantId
      || items.find((i) => i.tenantId)?.tenantId
    );

    const result = {
      abandoned,
      id: holdingId,
    };

    if (tenantId) {
      result.tenantId = tenantId;
    }

    if (explain) {
      const explainData = {
        cleared: {
          items: itemsToClear.map((i) => i.id),
          pieces: piecesToClear.map((p) => p.id),
          poLines: poLinesToClear.map((pl) => pl.id),
        },
        related: {
          items: items.map((i) => i.id),
          pieces: pieces.map((p) => p.id),
          poLines: poLines.map((pl) => pl.id),
        },
        remaining: {
          items: remainingItems.map((i) => i.id),
          pieces: remainingPieces.map((p) => p.id),
          poLines: remainingPoLines.map((pl) => pl.id),
        },
      };

      if (actionType) {
        explainData.actionType = actionType;
      }

      result.explain = explainData;
    }

    return result;
  }
}
