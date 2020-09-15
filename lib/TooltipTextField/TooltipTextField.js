import React from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  Tooltip,
} from '@folio/stripes/components';

const TooltipTextField = ({ tooltipText, ...rest }) => {
  return tooltipText
    ? (
      <Tooltip
        id={`${rest.id || rest.name}-tooltip`}
        text={tooltipText}
        placement="bottom-start"
      >
        {({ ref, ariaIds }) => (
          <TextField
            inputRef={ref}
            aria-describedby={ariaIds.text}
            {...rest}
          />
        )}
      </Tooltip>
    )
    : <TextField {...rest} />;
};

TooltipTextField.propTypes = {
  tooltipText: PropTypes.node,
};

export default TooltipTextField;
