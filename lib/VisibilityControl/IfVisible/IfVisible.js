import PropTypes from 'prop-types';
import { memo } from 'react';

const IfVisible = ({ children, visible = true }) => (
  <div
    data-testid="visibility-container"
    style={{ display: visible ? 'contents' : 'none' }}
  >
    {children}
  </div>
);

IfVisible.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
};

export default memo(IfVisible);
