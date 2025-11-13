/**
 * FormContext - React context for FormEngine
 */

import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { VALIDATION_MODES } from '../constants';

const FormContext = createContext(null);

export const FormProvider = ({ children, engine, defaultValidateOn = VALIDATION_MODES.BLUR }) => {
  const value = useMemo(() => ({ engine, defaultValidateOn }), [engine, defaultValidateOn]);

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

FormProvider.propTypes = {
  children: PropTypes.node,
  engine: PropTypes.object.isRequired,
  defaultValidateOn: PropTypes.oneOf([VALIDATION_MODES.BLUR, VALIDATION_MODES.CHANGE, VALIDATION_MODES.SUBMIT]),
};

export const useFormEngine = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormEngine must be used within a FormProvider');
  }

  return context.engine;
};

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }

  return context;
};
