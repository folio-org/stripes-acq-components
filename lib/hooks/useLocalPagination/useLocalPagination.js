import { useState } from 'react';
import { useFrontendPaginatedData } from '../useFrontendPaginatedData';

export const useLocalPagination = (data = [], limit) => {
  const [pagination, setPagination] = useState({ limit, offset: 0 });
  const paginatedData = useFrontendPaginatedData(data, pagination);

  return {
    pagination,
    setPagination,
    paginatedData,
  };
};
