import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';

import { useStripes } from '@folio/stripes/core';

import {
  useAsyncDebounce,
  useFunds,
} from '../../hooks';
import { fundDistributionShape } from '../../shapes';
import { calculateAmountsAndTotal } from './calculateAmountsAndTotal';
import { handleValidationErrorResponse } from './handleValidationErrorResponse';
import {
  useFundDistributionExpenseClasses,
  useFundDistributionHandlers,
} from './hooks';
import {
  validateFundDistributionTotal as validateFundDistributionTotalDefault,
  validateFundDistributionUniqueFunds,
} from './validateFundDistributionFinal';
import FundDistributionFields from './FundDistributionFieldsFinal';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';

const DEFAULT_FD = [];

const FundDistributionFieldsFinalContainer = ({
  change,
  currency: currencyProp,
  disabled = false,
  filterFunds,
  fiscalYearId,
  fundDistribution = DEFAULT_FD,
  name,
  onExpenseClassChange,
  required = true,
  totalAmount = 0,
  validateFieldsMap,
  validateFundDistributionTotal: validateFundDistributionTotalProp,
}) => {
  const stripes = useStripes();
  const currency = currencyProp || stripes.currency;

  const { funds, isLoading } = useFunds();

  const [remainingAmount, setRemainingAmount] = useState(0);
  const [hasValidationError, setHasValidationError] = useState(false); // Used as workaround for react-final-form issue with async validation of field arrays

  const { amounts } = useMemo(
    () => calculateAmountsAndTotal(fundDistribution, totalAmount, currency),
    [fundDistribution, currency, totalAmount],
  );

  // Prefetches expense classes for all funds in the current distribution.
  const { expenseClassesByFundId } = useFundDistributionExpenseClasses({
    fiscalYearId,
    fundDistribution,
  });

  // Provides action handlers; shares the same react-query cache as the hook above via queryClient.
  const {
    onAdd,
    onChangeToAmount,
    onChangeToPercent,
    onRemove: defaultOnRemove,
    onSelectFund,
  } = useFundDistributionHandlers({
    change,
    fiscalYearId,
    funds,
  });

  const onRemove = useCallback((fields, index) => {
    defaultOnRemove(fields, index);

    if (fields.length === 1) setRemainingAmount(0);
  }, [defaultOnRemove]);

  const validate = useCallback(async (records) => {
    if (totalAmount != null && records?.length) {
      const fundDistributionTotalValidator = validateFundDistributionTotalProp
        ? validateFundDistributionTotalProp.bind(null, records)
        : validateFundDistributionTotalDefault.bind(null, records, totalAmount, currency);

      const remainingAmountError = records.some(({ fundId, value }) => isNil(fundId) || typeof value !== 'number')
        ? undefined
        : await fundDistributionTotalValidator()
          .then(() => setRemainingAmount(0))
          .catch(err => handleValidationErrorResponse(err, setRemainingAmount));

      const error = required
        ? [remainingAmountError, validateFundDistributionUniqueFunds(records)].find(Boolean)
        : undefined;

      setHasValidationError(Boolean(error));

      return error;
    }

    return setHasValidationError(false);
  }, [
    required,
    currency,
    totalAmount,
    validateFundDistributionTotalProp,
  ]);

  const debouncedValidate = useAsyncDebounce(validate, 500);

  const remainingAmountNode = (
    <FormattedMessage
      id="stripes-acq-components.fundDistribution.remainingAmount"
      values={{
        remainingAmount: (
          <AmountWithCurrencyField
            currency={currency}
            amount={fundDistribution?.length ? remainingAmount : totalAmount}
          />
        ),
      }}
    />
  );

  if (isLoading) return (<Loading size="xlarge" />);

  return (
    <FundDistributionFields
      amounts={amounts}
      currency={currency}
      disabled={disabled}
      expenseClassesByFundId={expenseClassesByFundId}
      filterFunds={filterFunds}
      funds={funds}
      hasValidationError={hasValidationError}
      legend={remainingAmountNode}
      name={name}
      onAdd={onAdd}
      onChangeToAmount={onChangeToAmount}
      onChangeToPercent={onChangeToPercent}
      onExpenseClassChange={onExpenseClassChange}
      onRemove={onRemove}
      onSelectFund={onSelectFund}
      required={required}
      totalAmount={totalAmount}
      validate={debouncedValidate}
      validateFieldsMap={validateFieldsMap}
    />
  );
};

FundDistributionFieldsFinalContainer.propTypes = {
  change: PropTypes.func,
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  filterFunds: PropTypes.func,
  fiscalYearId: PropTypes.string,
  fundDistribution: fundDistributionShape,
  name: PropTypes.string.isRequired,
  onExpenseClassChange: PropTypes.func,
  required: PropTypes.bool,
  totalAmount: PropTypes.number,
  validateFieldsMap: PropTypes.shape({
    fundId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
    expenseClassId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
    distributionType: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  }),
  validateFundDistributionTotal: PropTypes.func,
};

export default FundDistributionFieldsFinalContainer;
