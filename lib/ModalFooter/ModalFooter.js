import PropTypes from 'prop-types';

import css from './ModalFooter.css';

const ModalFooter = ({
  renderStart,
  renderEnd,
}) => {
  return (
    <div className={css.modalFooterContent}>
      <span
        data-test-modal-footer-start
        className={css.renderStart}
      >
        {renderStart}
      </span>
      {renderEnd && (
        <span
          className={css.renderEnd}
          data-test-modal-footer-end
          style={{ display: 'flex' }}
        >
          {renderEnd}
        </span>
      )}
    </div>

  );
};

ModalFooter.propTypes = {
  renderEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  renderStart: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default ModalFooter;
