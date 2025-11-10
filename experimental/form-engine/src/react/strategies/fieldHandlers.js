import { VALIDATION_MODES } from '../../constants';
import { isDefined } from '../../utils/checks';

export const buildOnChangeCommands = ({ engine, name, validate, validateOn, debouncedValidate, newValue }) => ([
  () => engine.set(name, newValue),
  () => (validate && !engine.hasValidator(name)) && engine.registerValidator(name, validate, validateOn),
  () => (validate && validateOn === VALIDATION_MODES.CHANGE) && debouncedValidate(newValue, engine.getValues()),
]);

export const buildOnBlurCommands = ({ engine, name, validate, validateOn }) => ([
  () => engine.touch(name),
  () => engine.blur(),
  () => {
    const errors = engine.getErrors();

    return (
      validate
        && validateOn === VALIDATION_MODES.SUBMIT
        && name
        && isDefined(errors[name])
    ) && engine.clearError(name);
  },
  () => {
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
