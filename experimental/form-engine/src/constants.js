// Field state action types
export const FIELD_ACTIONS = {
  SET_VALUE: 'SET_VALUE',
  SET_ERROR: 'SET_ERROR',
  SET_ERRORS: 'SET_ERRORS',
  SET_TOUCHED: 'SET_TOUCHED',
  SET_ACTIVE: 'SET_ACTIVE',
  SET_DIRTY: 'SET_DIRTY',
  UPDATE_MULTIPLE: 'UPDATE_MULTIPLE',
};

// Form state action types
export const FORM_ACTIONS = {
  UPDATE_FORM_STATE: 'UPDATE_FORM_STATE',
};

// Validation modes
export const VALIDATION_MODES = {
  CHANGE: 'change',
  BLUR: 'blur',
  SUBMIT: 'submit',
};

// Default subscription settings
export const DEFAULT_SUBSCRIPTION = {
  value: true,
  error: true,
  errors: true,
  touched: true,
  active: false,
  dirty: true,
};

// Default form state subscription
export const DEFAULT_FORM_SUBSCRIPTION = {
  values: true,
  errors: true,
  touched: true,
  active: true,
  submitting: true,
  valid: true,
};

// Event types
export const EVENTS = {
  CHANGE: 'change',
  ERROR: 'error',
  TOUCH: 'touch',
  FOCUS: 'focus',
  BLUR: 'blur',
  SUBMIT: 'submit',
  VALIDATION: 'validation',
  RESET: 'reset',
  DIRTY: 'dirty',
  PRISTINE: 'pristine',
  VALID: 'valid',
  VALUES: 'values',
  ACTIVE: 'active',
};

// Field event prefixes
export const FIELD_EVENT_PREFIXES = {
  CHANGE: 'change:',
  ERROR: 'error:',
  ERRORS: 'errors:',
  TOUCH: 'touch:',
  DIRTY: 'dirty:',
  PRISTINE: 'pristine:',
};

// Debounce delays
export const DEBOUNCE_DELAYS = {
  DEFAULT: 0,
  TEXT: 300,
  NUMBER: 200,
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
  ENABLE_BATCHING: 'enableBatching',
  BATCH_DELAY: 'batchDelay',
  ENABLE_VALIDATION: 'enableValidation',
  VALIDATE_ON_CHANGE: 'validateOnChange',
  VALIDATE_ON_BLUR: 'validateOnBlur',
  DIRTY_CHECK_STRATEGY: 'dirtyCheckStrategy',
};
