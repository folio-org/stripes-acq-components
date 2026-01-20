import { HOLDINGS_RELATED_ENTITIES_API } from '../../constants/api';

/*
  Fetch related entities for holdings based on provided DTO.
  https://s3.amazonaws.com/foliodocs/api/mod-orders/r/holding-detail.html#orders_holding_detail_post
*/
export const fetchHoldingsRelatedEntities = (httpClient) => async (holdingIds, options = {}) => {
  const dto = { holdingIds };

  return httpClient
    .post(HOLDINGS_RELATED_ENTITIES_API, { json: dto, ...options })
    .json();
};
