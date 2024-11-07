import { RECEIVING_TITLES_API } from '../../constants';

export const fetchReceivingTitles = (httpClient) => {
  return async (options) => {
    return httpClient.get(RECEIVING_TITLES_API, options).json();
  };
};
