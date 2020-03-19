import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  difference,
  get,
  sortBy,
  uniq,
} from 'lodash';

import {
  LoadingPane,
  Pane,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { tagsResource } from '../manifests';
import { useShowCallout } from '../hooks';
import TagsForm from './TagsForm';

const TagsContainer = (props) => {
  const {
    mutator,
    onClose,
    putMutator,
    recordObj,
    resources,
  } = props;
  const sendCallout = useShowCallout();
  const entityTags = get(recordObj, ['tags', 'tagList'], []);
  const allTags = get(resources, ['tags', 'records'], []);

  const showCallout = useCallback(
    (message, type = 'success') => {
      sendCallout({ message, type });
    },
    [sendCallout],
  );

  const onRemove = useCallback(
    (tag) => {
      const tagList = entityTags.filter(t => t !== tag);
      const updatedRecordObj = { ...recordObj };

      updatedRecordObj.tags = { tagList };
      putMutator(updatedRecordObj);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordObj],
  );

  const saveEntityTags = useCallback(
    (tags) => {
      const tagList = get(recordObj, ['tags', 'tagList'], []);
      const updatedRecordObj = { ...recordObj };

      updatedRecordObj.tags = { tagList: sortBy(uniq([...tags, ...tagList])) };
      putMutator(updatedRecordObj)
        .then(() => showCallout(<FormattedMessage id="stripes-acq-components.tagWasAdded" />))
        .catch(() => showCallout(<FormattedMessage id="stripes-acq-components.tagWasNotAdded" />, 'error'));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordObj],
  );

  const saveTags = useCallback(
    (tags) => {
      const newTag = difference(tags, allTags.map(t => t.label.toLowerCase()));

      if (!newTag || !newTag.length) return;

      mutator.tags.POST({
        label: newTag[0],
        description: newTag[0],
      })
        .then(() => showCallout(<FormattedMessage id="stripes-smart-components.newTagCreated" />))
        .catch(() => showCallout(<FormattedMessage id="stripes-acq-components.newTagWasNotCreated" />, 'error'));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allTags],
  );

  const onAdd = useCallback(
    (tags) => {
      saveEntityTags(tags);
      saveTags(tags);
    },
    [saveEntityTags, saveTags],
  );

  const isLoading = !get(resources, ['tags', 'hasLoaded']);

  if (isLoading) {
    return (
      <LoadingPane defaultWidth="fill" onClose={onClose} />
    );
  }

  return (
    <Pane
      id="tagsPane"
      defaultWidth="20%"
      paneTitle={<FormattedMessage id="stripes-smart-components.tags" />}
      paneSub={(
        <FormattedMessage
          id="stripes-smart-components.numberOfTags"
          values={{ count: entityTags.length }}
        />
      )}
      dismissible
      onClose={onClose}
    >
      <TagsForm
        onRemove={onRemove}
        onAdd={onAdd}
        allTags={allTags}
        entityTags={entityTags}
      />
    </Pane>
  );
};

TagsContainer.manifest = Object.freeze({
  tags: tagsResource,
});

TagsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  putMutator: PropTypes.func.isRequired,
  recordObj: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(TagsContainer);
