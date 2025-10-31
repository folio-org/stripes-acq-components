import PropTypes from 'prop-types';
import { useCallback } from 'react';

import {
  useTags,
  useTagsConfigs,
  useTagsMutation,
} from '../hooks';
import FieldTagsFinal from './FieldTagsFinal';

const FieldTagsContainer = ({
  component: Component = FieldTagsFinal,
  formValues,
  fullWidth,
  labelless = false,
  marginBottom0,
  name,
  tenantId,
  ...props
}) => {
  const {
    createTag,
    isLoading: isMutating,
  } = useTagsMutation({ tenantId });

  const {
    configs,
    isFetched,
  } = useTagsConfigs({ tenantId });

  const tagsEnabled = isFetched && (!configs.length || configs[0].value === 'true');

  const {
    isFetching: isTagsFetching,
    refetch,
    tags: allTags,
  } = useTags({
    tenantId,
    enabled: tagsEnabled,
  });

  const onAdd = useCallback(async (tag) => {
    await createTag({
      data: {
        label: tag,
        description: tag,
      },
    });
    refetch();
  }, [createTag, refetch]);

  if (!tagsEnabled) return null;

  return (
    <Component
      allTags={allTags}
      formValues={formValues}
      fullWidth={fullWidth}
      labelless={labelless}
      marginBottom0={marginBottom0}
      name={name}
      onAdd={onAdd}
      showLoading={isTagsFetching || isMutating}
      {...props}
    />
  );
};

FieldTagsContainer.propTypes = {
  formValues: PropTypes.object,
  fullWidth: PropTypes.bool,
  labelless: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  name: PropTypes.string.isRequired,
  tenantId: PropTypes.string,
};

export default FieldTagsContainer;
