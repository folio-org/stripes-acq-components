export const holdingsRelatedEntities = {
  'holding-1': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-1', poLineId: 'po-line-1', itemId: 'item-1' },
        { id: 'piece-2', poLineId: 'po-line-1', itemId: 'item-2' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-1' },
        { id: 'item-2' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-1', checkinItems: false }, // synchronized
      ],
    },
  },
  'holding-2': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-3', poLineId: 'po-line-2', itemId: 'item-3' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-3' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-2', checkinItems: false }, // synchronized
      ],
    },
  },
  'holding-3': {
    pieces_detail_collection: {
      pieces_detail: [],
    },
    items_detail_collection: {
      items_detail: [],
    },
    poLines_detail_collection: {
      poLines_detail: [],
    },
  },
  'holding-4': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-4', poLineId: 'po-line-4', itemId: 'item-4' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-4' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-3', checkinItems: true }, // independent
        { id: 'po-line-4', checkinItems: false }, // synchronized
      ],
    },
  },
  // Holding with only independent PO Line connections
  'holding-5': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-5', poLineId: 'po-line-5', itemId: 'item-5' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-5' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-5', checkinItems: true }, // independent
      ],
    },
  },
  // Holding with mixed synchronized and independent PO Lines
  'holding-6': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-6', poLineId: 'po-line-6', itemId: 'item-6' },
        { id: 'piece-7', poLineId: 'po-line-7', itemId: 'item-7' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-6' },
        { id: 'item-7' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-6', checkinItems: false }, // synchronized
        { id: 'po-line-7', checkinItems: true }, // independent
      ],
    },
  },
  // Holding with only independent PO Lines (Case 6)
  'holding-7': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-8', poLineId: 'po-line-8', itemId: 'item-8' },
        { id: 'piece-9', poLineId: 'po-line-9', itemId: 'item-9' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-8' },
        { id: 'item-9' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-8', checkinItems: true }, // independent
        { id: 'po-line-9', checkinItems: true }, // independent
      ],
    },
  },
  // Holding with independent PO Line but no pieces (Case 12)
  'holding-8': {
    pieces_detail_collection: {
      pieces_detail: [],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-10' },
        { id: 'item-11' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-10', checkinItems: true }, // independent, no pieces attached
      ],
    },
  },
  // Holding with multiple synchronized lines for unopen scenario
  'holding-9': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-11', poLineId: 'po-line-11', itemId: 'item-12' },
        { id: 'piece-12', poLineId: 'po-line-12', itemId: 'item-13' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-12' },
        { id: 'item-13' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-11', checkinItems: false }, // synchronized
        { id: 'po-line-12', checkinItems: false }, // synchronized
      ],
    },
  },
  // Holding with mixed lines for unopen scenario (unopen removes one synchronized)
  'holding-10': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-13', poLineId: 'po-line-13', itemId: 'item-14' },
        { id: 'piece-14', poLineId: 'po-line-14', itemId: 'item-15' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-14' },
        { id: 'item-15' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-13', checkinItems: false }, // synchronized (will be unopened)
        { id: 'po-line-14', checkinItems: true }, // independent (stays)
      ],
    },
  },
  // Holding with complex mixed scenario (unopen both, items from independent remain)
  'holding-11': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-15', poLineId: 'po-line-15', itemId: 'item-16' },
        { id: 'piece-16', poLineId: 'po-line-16', itemId: 'item-17' },
        { id: 'piece-17', poLineId: 'po-line-17', itemId: 'item-18' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-16' },
        { id: 'item-17' },
        { id: 'item-18' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-15', checkinItems: false }, // synchronized
        { id: 'po-line-16', checkinItems: false }, // synchronized
        { id: 'po-line-17', checkinItems: true }, // independent
      ],
    },
  },
  // Holding for change instance connection (multiple independent lines with shared items)
  'holding-12': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-18', poLineId: 'po-line-18', itemId: 'item-19' },
        { id: 'piece-19', poLineId: 'po-line-19', itemId: 'item-20' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-19' },
        { id: 'item-20' },
        { id: 'item-21' }, // shared item not tied to specific piece
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-18', checkinItems: true }, // independent
        { id: 'po-line-19', checkinItems: true }, // independent
      ],
    },
  },
  // Holding for change instance connection with synchronized lines
  'holding-13': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-20', poLineId: 'po-line-20', itemId: 'item-22' },
        { id: 'piece-21', poLineId: 'po-line-21', itemId: 'item-23' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-22' },
        { id: 'item-23' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-20', checkinItems: false }, // synchronized
        { id: 'po-line-21', checkinItems: false }, // synchronized
      ],
    },
  },
  // Holding for change instance connection (mixed scenario)
  'holding-14': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-22', poLineId: 'po-line-22', itemId: 'item-24' },
        { id: 'piece-23', poLineId: 'po-line-23', itemId: 'item-25' },
        { id: 'piece-24', poLineId: 'po-line-24', itemId: 'item-26' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-24' },
        { id: 'item-25' },
        { id: 'item-26' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-22', checkinItems: false }, // synchronized
        { id: 'po-line-23', checkinItems: true }, // independent
        { id: 'po-line-24', checkinItems: false }, // synchronized
      ],
    },
  },
  // Holding with lines from same order in different holdings
  // Used to verify that unopen checks ALL order lines across holdings
  'holding-15': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-25', poLineId: 'po-line-25', itemId: 'item-27' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-27' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-25', checkinItems: false, purchaseOrderId: 'order-5' }, // synchronized, from order-5
      ],
    },
  },
  // Another holding with line from same order (order-5)
  'holding-16': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-26', poLineId: 'po-line-26', itemId: 'item-28' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-28' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-26', checkinItems: false, purchaseOrderId: 'order-5' }, // synchronized, from order-5
      ],
    },
  },
  // Holding with tenantId in pieces (multi-tenant scenario)
  'holding-tenant-1': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-tenant-1', poLineId: 'po-line-tenant-1', itemId: 'item-tenant-1', tenantId: 'consortium' },
        { id: 'piece-tenant-2', poLineId: 'po-line-tenant-1', itemId: 'item-tenant-2', tenantId: 'consortium' },
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-tenant-1', tenantId: 'consortium' },
        { id: 'item-tenant-2', tenantId: 'consortium' },
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-tenant-1', checkinItems: false },
      ],
    },
  },
  // Holding with tenantId in items only
  'holding-tenant-2': {
    pieces_detail_collection: {
      pieces_detail: [
        { id: 'piece-tenant-3', poLineId: 'po-line-tenant-2', itemId: 'item-tenant-3' }, // no tenantId in piece
      ],
    },
    items_detail_collection: {
      items_detail: [
        { id: 'item-tenant-3', tenantId: 'university' }, // tenantId only in item
      ],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-tenant-2', checkinItems: true }, // independent
      ],
    },
  },
};
