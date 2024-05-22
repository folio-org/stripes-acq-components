import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../constants';

export const useRoutingListMutation = () => {
  const ky = useOkapiKy();

  const createMutationFn = (values = {}) => {
    return ky.post(ROUTING_LIST_API, {
      json: values,
    });
  };

  const updateMutationFn = (values = {}) => {
    return ky.put(`${ROUTING_LIST_API}/${values.id}`, {
      json: values,
    });
  };

  const deleteMutationFn = (routingListId) => {
    return ky.delete(`${ROUTING_LIST_API}/${routingListId}`);
  };

  const { mutateAsync: createRoutingList, isLoading: isCreating } = useMutation({ mutationFn: createMutationFn });
  const { mutateAsync: updateRoutingList, isLoading: isUpdating } = useMutation({ mutationFn: updateMutationFn });
  const { mutateAsync: deleteRoutingList, isLoading: isDeleting } = useMutation({ mutationFn: deleteMutationFn });

  return {
    createRoutingList,
    deleteRoutingList,
    updateRoutingList,
    isCreating,
    isDeleting,
    isUpdating,
  };
};
