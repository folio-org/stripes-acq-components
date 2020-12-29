import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  IconButton,
  PaneMenu,
} from '@folio/stripes/components';

const TagsBadge = ({ tagsToggle, tagsQuantity, tagsEnabled }) => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'stripes-acq-components.showTags' });

  return (
    <PaneMenu>
      {tagsEnabled && (
        <IconButton
          ariaLabel={title}
          badgeCount={tagsQuantity}
          data-test-invoice-line-tags-action
          icon="tag"
          id="clickable-show-tags"
          onClick={tagsToggle}
          title={title}
        />
      )}
    </PaneMenu>
  );
};

TagsBadge.propTypes = {
  tagsEnabled: PropTypes.bool.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  tagsQuantity: PropTypes.number.isRequired,
};

export default TagsBadge;
