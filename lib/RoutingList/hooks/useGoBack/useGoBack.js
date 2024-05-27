import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

export const useGoBack = (fallbackPath) => {
  const history = useHistory();
  const location = useLocation();

  const goBack = useCallback(() => {
    if (location.key) {
      history.goBack();
    } else {
      history.push(fallbackPath);
    }
  }, [location.key, history, fallbackPath]);

  return goBack;
};
