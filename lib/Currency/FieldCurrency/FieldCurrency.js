import PropTypes from 'prop-types';

import { useCurrencyOptions } from '@folio/stripes/components';

import { FieldSelectionFinal } from '../../FieldSelection';
import { validateRequired } from '../../utils';

import CurrencyValue from '../CurrencyValue';

const FieldCurrency = ({
  id,
  isNonInteractive = false,
  labelId = 'stripes-acq-components.currency',
  name,
  onChange,
  required = false,
  value,
}) => {
  const currenciesOptions = useCurrencyOptions();

  return (
    isNonInteractive
      ? <CurrencyValue value={value} />
      : (
        <FieldSelectionFinal
          dataOptions={currenciesOptions}
          id={id}
          labelId={labelId}
          name={name}
          onChange={onChange}
          required={required}
          validate={required ? validateRequired : undefined}
        />
      )
  );
};

FieldCurrency.propTypes = {
  id: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  labelId: PropTypes.string,
};

export default FieldCurrency;
