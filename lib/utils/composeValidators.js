export const composeValidators = (...validators) => (...data) => {
  return validators.reduce((error, validator) => error || validator(...data), undefined);
};

export const composeValidatorsAsync = (...validators) => (...data) => {
  return validators.reduce(async (error, validator) => {
    return ((await error) || validator(...data));
  }, Promise.resolve(undefined));
};
