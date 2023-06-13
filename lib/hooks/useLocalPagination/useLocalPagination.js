import { useState } from 'react';
import {
  RESULT_COUNT_INCREMENT,
} from '../../constants';
import { useFrontendPaginatedData } from '../useFrontendPaginatedData';

export const useLocalPagination = (data = []) => {
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const paginatedData = useFrontendPaginatedData(data, pagination);

  return {
    pagination,
    setPagination,
    paginatedData,
  };
};
