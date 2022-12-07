import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  IconButton,
  PaneMenu,
} from '@folio/stripes/components';

const TagsBadge = ({ disabled, tagsToggle, tagsQuantity, tagsEnabled }) => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'stripes-acq-components.showTags' });

  return (
    <PaneMenu>
      {tagsEnabled && (
        <IconButton
          disabled={disabled}
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
  disabled: PropTypes.bool,
  tagsEnabled: PropTypes.bool.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  tagsQuantity: PropTypes.number.isRequired,
};

export default TagsBadge;
