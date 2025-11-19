// Field state action types
export const FIELD_ACTIONS = {
  SET_ACTIVE: 'SET_ACTIVE',
  SET_DIRTY: 'SET_DIRTY',
  SET_ERROR: 'SET_ERROR',
  SET_ERRORS: 'SET_ERRORS',
  SET_TOUCHED: 'SET_TOUCHED',
  SET_VALUE: 'SET_VALUE',
  UPDATE_MULTIPLE: 'UPDATE_MULTIPLE',
};

// Form state action types
export const FORM_ACTIONS = {
  UPDATE_FORM_STATE: 'UPDATE_FORM_STATE',
};

// Validation modes
export const VALIDATION_MODES = {
  BLUR: 'blur',
  CHANGE: 'change',
  SUBMIT: 'submit',
};

// Default subscription settings
export const DEFAULT_SUBSCRIPTION = {
  active: false,
  dirty: true,
  error: true,
  errors: true,
  touched: true,
  value: true,
};

// Default form state subscription
export const DEFAULT_FORM_SUBSCRIPTION = {
  active: true,
  errors: true,
  submitting: true,
  touched: true,
  valid: true,
  values: true,
};

// Event types
export const EVENTS = {
  ACTIVE: 'active',
  BLUR: 'blur',
  CHANGE: 'change',
  CONFIG_UPDATE: 'config_update',
  DIRTY: 'dirty',
  ERROR: 'error',
  FOCUS: 'focus',
  INIT: 'init',
  PRISTINE: 'pristine',
  RESET: 'reset',
  SUBMIT: 'submit',
  SUBMITTING: 'submitting',
  TOUCH: 'touch',
  VALID: 'valid',
  VALIDATION: 'validation',
  VALUES: 'values',
};

// Field event prefixes
export const FIELD_EVENT_PREFIXES = {
  CHANGE: 'change:',
  DIRTY: 'dirty:',
  ERROR: 'error:',
  ERRORS: 'errors:',
  PRISTINE: 'pristine:',
  TOUCH: 'touch:',
};

// Debounce delays
export const DEBOUNCE_DELAYS = {
  DEFAULT: 0,
  NUMBER: 200,
  TEXT: 300,
};

// Dirty check strategies
export const DIRTY_CHECK_STRATEGY = {
  TOUCHED: 'touched', // dirty = has touched fields
  VALUES: 'values',   // dirty = values differ from initial
};

// Error sources
export const ERROR_SOURCES = {
  FIELD: 'field',
  FORM: 'form',
};

// Form engine options
export const FORM_ENGINE_OPTIONS = {
  BATCH_DELAY: 'batchDelay',
  DIRTY_CHECK_STRATEGY: 'dirtyCheckStrategy',
  ENABLE_BATCHING: 'enableBatching',
  ENABLE_VALIDATION: 'enableValidation',
  VALIDATE_ON_BLUR: 'validateOnBlur',
  VALIDATE_ON_CHANGE: 'validateOnChange',
};
