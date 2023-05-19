import {
  useEffect,
  useCallback,
} from 'react';

import useSorting from './useSorting';
import {
  buildSortingObj,
  buildSearch,
} from '../utils';

const useLocationSorting = (location, history, resetData, sortableFields, defaultSorting, deps = []) => {
  const [
    sortingField,
    sortingDirection,
    changeSorting,
    setSortingField,
    setSortingDirection,
  ] = useSorting(resetData, sortableFields);

  useEffect(
    () => {
      const initialSorting = buildSortingObj(location.search, defaultSorting);

      setSortingField(initialSorting.sortingField);
      setSortingDirection(initialSorting.sortingDirection);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps],
  );

  const changeLocationSorting = useCallback(
    (e, meta) => {
      const newSotring = changeSorting(e, meta);

      history.push({
        pathname: '',
        search: `${buildSearch(newSotring, location.search)}`,
      });
    },
    [changeSorting, location, history],
  );

  return [
    sortingField,
    sortingDirection,
    changeLocationSorting,
  ];
};

export default useLocationSorting;
