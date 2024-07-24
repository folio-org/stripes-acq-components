import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import queryString from 'query-string';

export const useGoBack = (fallbackPath) => {
  const history = useHistory();
  const location = useLocation();

  const goBack = useCallback(() => {
    const { returnUrl } = queryString.parse(location.search);

    if (returnUrl) {
      history.push(atob(returnUrl));
    } else if (location.key) {
      history.goBack();
    } else {
      history.push(fallbackPath);
    }
  }, [location.search, location.key, history, fallbackPath]);

  return goBack;
};
