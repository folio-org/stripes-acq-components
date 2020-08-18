import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  difference,
  get,
  sortBy,
  uniq,
} from 'lodash';

import {
  Pane,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { TagsForm } from '@folio/stripes/smart-components';

import { tagsResource } from '../manifests';
import { useShowCallout } from '../hooks';
import { LoadingPane } from '../LoadingPane';

const TagsPane = (props) => {
  const {
    mutator,
    onClose,
    entity,
    updateEntity,
  } = props;

  const entityTags = get(entity, ['tags', 'tagList'], []);
  const [tagList, setTagList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const showCallout = useShowCallout();

  useEffect(
    () => {
      setIsLoading(true);
      mutator.tagsPaneTags.GET()
        .then(setTagList)
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onRemove = useCallback(
    (tag) => {
      const updatedEntity = {
        ...entity,
        tags: {
          tagList: entityTags.filter(t => t !== tag),
        },
      };

      updateEntity(updatedEntity);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entity],
  );

  const saveEntityTags = useCallback(
    (tags) => {
      const updatedEntity = {
        ...entity,
        tags: {
          tagList: sortBy(uniq([...tags, ...entityTags])),
        },
      };

      updateEntity(updatedEntity);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entity],
  );

  const saveTags = useCallback(
    (tags) => {
      const newTag = difference(tags, tagList.map(t => t.label.toLowerCase()));

      if (!newTag || !newTag.length) return Promise.resolve();

      return mutator.tagsPaneTags.POST({
        label: newTag[0],
        description: newTag[0],
      })
        .then(() => {
          showCallout({
            messageId: 'stripes-smart-components.newTagCreated',
            type: 'success',
          });

          mutator.tagsPaneTags.GET().then(setTagList);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tagList, showCallout],
  );

  const onAdd = useCallback(
    (tags) => {
      saveTags(tags)
        .then(() => {
          saveEntityTags(tags);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveEntityTags, saveTags],
  );

  if (isLoading) {
    return (
      <LoadingPane onClose={onClose} />
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
        tags={tagList}
        entityTags={entityTags}
      />
    </Pane>
  );
};

TagsPane.manifest = Object.freeze({
  tagsPaneTags: {
    ...tagsResource,
    accumulate: true,
  },
});

TagsPane.propTypes = {
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  entity: PropTypes.object.isRequired,
  updateEntity: PropTypes.func.isRequired,
};

export default stripesConnect(TagsPane);
