import { VALIDATION_MODES } from '../../constants';

export const buildOnChangeCommands = ({ engine, name, validate, validateOn, debouncedValidate, newValue }) => ([
  () => engine.set(name, newValue),
  () => (validate && !engine.hasValidator(name)) && engine.registerValidator(name, validate, validateOn),
  () => (validate && validateOn === VALIDATION_MODES.CHANGE) && debouncedValidate(newValue, engine.getValues()),
]);

export const buildOnBlurCommands = ({ engine, name, validate, validateOn }) => ([
  () => engine.touch(name),
  () => engine.blur(),
  () => {
    // Only validate on blur if validateOn is explicitly set to BLUR
    // For SUBMIT mode, errors remain visible until next submit or programmatic validation
    if (validate && validateOn === VALIDATION_MODES.BLUR) {
      const fieldValue = engine.get(name);

      engine.validationService
        .validateByMode(name, fieldValue, engine.getValues(), VALIDATION_MODES.BLUR)
        .then(error => {
          if (error) {
            engine.setError(name, error);
          } else {
            engine.clearError(name);
          }
        });
    }
  },
]);
