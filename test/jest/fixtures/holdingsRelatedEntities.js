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
        { id: 'po-line-1' },
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
        { id: 'po-line-2' },
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
      pieces_detail: [],
    },
    items_detail_collection: {
      items_detail: [],
    },
    poLines_detail_collection: {
      poLines_detail: [
        { id: 'po-line-3' },
        { id: 'po-line-4' },
      ],
    },
  },
};
