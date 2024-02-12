import PropTypes from 'prop-types';
import { Field, useForm } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import styles from './VisibilityControl.css';

export const VisibilityControl = ({
  children,
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
              className={styles.visibilityControlLabel}
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
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
};
