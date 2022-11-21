import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFiltersReset = (resetFilters) => {
  const { state } = useLocation();
  const shouldResetFilters = state?.resetFilters;

  useEffect(() => {
    if (shouldResetFilters) resetFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldResetFilters]);
};
