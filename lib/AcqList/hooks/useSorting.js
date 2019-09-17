import {
  useState,
  useCallback,
} from 'react';

import {
  ASC_DIRECTION,
  DESC_DIRECTION,
} from '../constants';

const useSorting = (resetData, sortableFields) => {
  const [sortingField, setSortingField] = useState('');
  const [sortingDirection, setSortingDirection] = useState('');

  const toggleSortingDirection = useCallback(
    () => {
      const newSortingDirection = sortingDirection === ASC_DIRECTION ? DESC_DIRECTION : ASC_DIRECTION;

      setSortingDirection(newSortingDirection);

      return newSortingDirection;
    },
    [sortingDirection],
  );

  const changeSorting = useCallback(
    (e, meta) => {
      const newSortingField = meta.name;

      if (sortableFields && !sortableFields.includes(newSortingField)) {
        return {
          sorting: sortingField,
          sortingDirection,
        };
      }

      let newSorting;

      if (newSortingField === sortingField) {
        newSorting = {
          sorting: sortingField,
          sortingDirection: toggleSortingDirection(),
        };
      } else {
        setSortingField(newSortingField);
        setSortingDirection(ASC_DIRECTION);

        newSorting = {
          sorting: newSortingField,
          sortingDirection: ASC_DIRECTION,
        };
      }

      resetData();

      return newSorting;
    },
    [resetData, sortingField, sortingDirection, toggleSortingDirection, sortableFields],
  );

  return [
    sortingField,
    sortingDirection,
    changeSorting,
    setSortingField,
    setSortingDirection,
  ];
};

export default useSorting;
