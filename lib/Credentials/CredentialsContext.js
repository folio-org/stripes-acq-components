import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { useToggle } from '../hooks';

import css from './CredentialsContext.css';

const DEFAULT_SHOW_CREDENTIALS_LABEL = <FormattedMessage id="stripes-acq-components.button.credentials.show" />;
const DEFAULT_HIDE_CREDENTIALS_LABEL = <FormattedMessage id="stripes-acq-components.button.credentials.hide" />;

export const CredentialsContext = createContext();

export const CredentialsProvider = ({
  children,
  hideCredentialsLabel = DEFAULT_HIDE_CREDENTIALS_LABEL,
  isKeyValue = false,
  perm,
  showCredentialsLabel = DEFAULT_SHOW_CREDENTIALS_LABEL,
}) => {
  const stripes = useStripes();
  const [isCredentialsVisible, toggleCredentials] = useToggle(false);

  const isPermitted = perm ? stripes.hasPerm(perm) : true;

  const renderToggle = useCallback((btnProps = {}) => (
    isPermitted && (
      <div className={css.toggle}>
        <Button
          onClick={toggleCredentials}
          {...btnProps}
        >
          {isCredentialsVisible ? hideCredentialsLabel : showCredentialsLabel}
        </Button>
      </div>
    )
  ), [hideCredentialsLabel, isCredentialsVisible, isPermitted, showCredentialsLabel, toggleCredentials]);

  const contextValue = useMemo(() => ({
    isCredentialsVisible,
    isPermitted,
    isKeyValue,
    perm,
    toggleCredentials,
  }), [isCredentialsVisible, isPermitted, isKeyValue, perm, toggleCredentials]);

  return (
    <CredentialsContext.Provider value={contextValue}>
      {typeof children === 'function' ? children({ renderToggle, ...contextValue }) : children}
    </CredentialsContext.Provider>
  );
};

CredentialsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  hideCredentialsLabel: PropTypes.node,
  isKeyValue: PropTypes.bool,
  perm: PropTypes.string,
  showCredentialsLabel: PropTypes.node,
};
