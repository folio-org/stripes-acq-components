import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

const ORDER_LINE_URL = '/orders/lines/view';

export const useGoBack = (poLineId) => {
  const history = useHistory();
  const location = useLocation();

  const goBack = useCallback(() => {
    if (location.key) {
      history.goBack();
    } else {
      history.push(`${ORDER_LINE_URL}/${poLineId}`);
    }
  }, [location.key, history, poLineId]);

  return goBack;
};
