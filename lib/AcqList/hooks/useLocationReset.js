import { useEffect } from 'react';

const useLocationReset = (history, location, pathname, reset) => {
  useEffect(() => {
    if (history.action === 'REPLACE' && location.pathname === pathname) {
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.action, location.pathname]);
};

export default useLocationReset;
