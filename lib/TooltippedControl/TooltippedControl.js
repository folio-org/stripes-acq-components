import React from 'react';
import PropTypes from 'prop-types';

import {
  Tooltip,
} from '@folio/stripes/components';

const TooltippedControl = ({ controlComponent, tooltipText, ...rest }) => {
  const ControlComponent = controlComponent;

  return tooltipText
    ? (
      <Tooltip
        id={`${rest.id || rest.name}-tooltip`}
        text={tooltipText}
        placement="bottom-start"
      >
        {({ ref, ariaIds }) => (
          <ControlComponent
            inputRef={ref}
            aria-describedby={ariaIds.text}
            {...rest}
          />
        )}
      </Tooltip>
    )
    : <ControlComponent {...rest} />;
};

TooltippedControl.propTypes = {
  controlComponent: PropTypes.elementType,
  tooltipText: PropTypes.node,
};

export default TooltippedControl;
