import React from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Tooltip,
} from '@folio/stripes/components';

const TooltipCheckbox = ({ tooltipText, ...rest }) => {
  return tooltipText
    ? (
      <Tooltip
        id={`${rest.id || rest.name}-tooltip`}
        text={tooltipText}
        placement="bottom-start"
      >
        {({ ref, ariaIds }) => (
          <Checkbox
            inputRef={ref}
            aria-describedby={ariaIds.text}
            {...rest}
          />
        )}
      </Tooltip>
    )
    : <Checkbox {...rest} />;
};

TooltipCheckbox.propTypes = {
  tooltipText: PropTypes.node,
};

export default TooltipCheckbox;
