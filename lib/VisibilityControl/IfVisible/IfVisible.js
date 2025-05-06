import PropTypes from 'prop-types';
import { memo } from 'react';

const styles = {
  display: 'none',
};

const IfVisible = ({ children, visible = true }) => (
  visible
    ? children
    : <div style={styles}>{children}</div>
);

IfVisible.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
};

export default memo(IfVisible);
