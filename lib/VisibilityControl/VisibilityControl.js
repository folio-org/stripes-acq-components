import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Field,
  useForm,
} from 'react-final-form';
import { useIntl } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import styles from './VisibilityControl.css';

export const VisibilityControl = ({
  children,
  detached = false,
  name,
}) => {
  const intl = useIntl();
  const { change, getState } = useForm();

  const onChange = e => {
    change(name, e.target.checked);
    change('hideAll', false);
  };

  if (getState().values?.hideAll === undefined) {
    return children;
  }

  return (
    <Field
      name={name}
      type="checkbox"
      render={({ input }) => {
        return (
          <div className={styles.visibilityControlBox}>
            {children}

            <label
              htmlFor={name}
              className={classNames(styles.visibilityControlLabel, { [styles.detached]: detached })}
            >
              <input
                {...input}
                aria-label={intl.formatMessage({ id: 'ui-orders.order.hideField' })}
                id={name}
                onChange={onChange}
                type="checkbox"
                className={styles.visibilityControlCheckbox}
              />
              <Icon
                size="medium"
                icon={input.checked ? 'eye-closed' : 'eye-open'}
                tabIndex="0"
              />
            </label>
          </div>
        );
      }}
    />
  );
};

VisibilityControl.propTypes = {
  children: PropTypes.node.isRequired,
  detached: PropTypes.bool,
  name: PropTypes.string,
};
