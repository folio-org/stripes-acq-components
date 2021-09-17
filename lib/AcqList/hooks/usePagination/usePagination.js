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

  useEffect(() => {
    if (prevPaginatelessSearch !== undefined && prevPaginatelessSearch !== paginatelessSearch) {
      setPagination((p) => ({ ...p, offset: 0, timestamp: getTimestamp() }));
    }
  }, [prevPaginatelessSearch, paginatelessSearch]);

  useEffect(() => {
    if (prevPagination && prevPagination !== pagination) {
      history.push({
        pathname: '',
        search: buildSearch(
          {
            [OFFSET_PARAMETER]: String(pagination.offset),
            [LIMIT_PARAMETER]: String(pagination.limit),
          },
          location.search,
        ),
      });
    }
  }, [prevPagination, pagination, history, location.search]);

  const refreshPage = useCallback(() => {
    setPagination((p) => ({ ...p, timestamp: getTimestamp() }));
  }, []);

  const changePage = useCallback((newPagination) => {
    setPagination((p) => ({ ...p, ...newPagination }));
  }, []);

  return {
    pagination,
    changePage,
    refreshPage,
  };
};
