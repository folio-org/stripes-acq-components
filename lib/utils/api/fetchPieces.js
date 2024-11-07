import { ORDER_PIECES_API } from '../../constants';

export const fetchPieces = (httpClient) => async (options) => {
  return httpClient.get(ORDER_PIECES_API, options).json();
};
