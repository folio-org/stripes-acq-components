import { useState } from 'react';
import { useFrontendPaginatedData } from '../useFrontendPaginatedData';
import { RESULT_COUNT_INCREMENT } from '../../constants';

export const useLocalPagination = (data = [], limit = RESULT_COUNT_INCREMENT) => {
  const [pagination, setPagination] = useState({ limit, offset: 0 });
  const paginatedData = useFrontendPaginatedData(data, pagination);

  return {
    pagination,
    setPagination,
    paginatedData,
  };
};
