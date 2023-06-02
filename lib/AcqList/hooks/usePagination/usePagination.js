import { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router';

import { usePrevious } from '../../../utils';

import {
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
} from '../../constants';
import {
  buildSearch,
  buildPaginatelessSearch,
  buildPaginationObj,
  buildPaginatingSearch,
} from '../../utils';

const getTimestamp = () => (new Date()).valueOf();

export const usePagination = (defaultPagination = {}) => {
  const location = useLocation();
  const history = useHistory();

  const initPagination = buildPaginationObj(location.search, defaultPagination);

  const [pagination, setPagination] = useState({ ...initPagination, timestamp: getTimestamp() });
  const prevPagination = usePrevious(pagination);

  const paginatelessSearch = buildPaginatelessSearch(location.search);
  const prevPaginatelessSearch = usePrevious(paginatelessSearch);

  const paginatingSearch = buildPaginatingSearch(location.search);
  const prevPaginatingSearch = usePrevious(paginatingSearch);

  const updateLocation = useCallback((_pagination, search) => {
    history.push({
      pathname: '',
      search: buildSearch(
        {
          [OFFSET_PARAMETER]: String(_pagination.offset),
          [LIMIT_PARAMETER]: String(_pagination.limit),
        },
        search,
      ),
    });
  }, [history]);

  useEffect(() => {
    // Reset pagination and update location when filters (without 'limit' and 'offset' search params) were changed
    if (prevPaginatelessSearch !== undefined && prevPaginatelessSearch !== paginatelessSearch) {
      setPagination((p) => {
        const newPagination = { ...p, [OFFSET_PARAMETER]: 0, timestamp: getTimestamp() };

        // Not update location if search was cleared (basically means, that all filters were reset)
        if (location.search) {
          updateLocation(newPagination, location.search);
        }

        return newPagination;
      });
    }
  }, [prevPaginatelessSearch, paginatelessSearch, history, location.search, prevPagination, updateLocation]);

  useEffect(() => {
    // Reset pagination, when there were no filters, but pagination params were cleared
    if (!prevPaginatelessSearch && !paginatingSearch && prevPaginatingSearch) {
      setPagination((p) => ({ ...p, [OFFSET_PARAMETER]: 0 }));
    }
  }, [paginatingSearch, prevPaginatelessSearch, prevPaginatingSearch]);

  const refreshPage = useCallback(() => {
    setPagination((p) => {
      const newPagination = { ...p, timestamp: getTimestamp() };

      updateLocation(newPagination, location.search);

      return newPagination;
    });
  }, [location.search, updateLocation]);

  const changePage = useCallback((_pagination) => {
    setPagination((p) => {
      const newPagination = { ...p, ..._pagination };

      updateLocation(newPagination, location.search);

      return newPagination;
    });
  }, [location.search, updateLocation]);

  return {
    pagination,
    changePage,
    refreshPage,
  };
};
