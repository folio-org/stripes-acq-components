import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState, useEffect } from 'react';

import { stripesConnect } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import { useFunds } from '../../hooks';
import { fundExpenseClassesManifest } from '../../manifests';
import { fundDistributionShape } from '../../shapes';
import { fetchExpenseClasses } from './fetchExpenseClasses';
import FundDistributionFields from './FundDistributionFieldsFinal';

const FundDistributionFieldsFinalContainer = ({
  change,
  currency,
  disabled,
  filterFunds,
  fiscalYearId,
  fundDistribution,
  mutator: originMutator,
  name,
  required,
  stripes,
  totalAmount,
  validate,
  validateFundDistributionTotal,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);

  const { funds, isLoading } = useFunds();

  const fundCodes = useMemo(() => funds && new Map(funds.map(f => [f.id, f.code])), [funds]);
  const [expenseClassesByFundId, setExpenseClassesByFundId] = useState({});

  useEffect(() => {
    let expenseClassesFundsToFetch = fundDistribution?.filter(({ fundId }) => (
      fundId && !expenseClassesByFundId[fundId]
    ));

    if (fiscalYearId) {
      expenseClassesFundsToFetch = uniqBy(fundDistribution, 'fundId');
    }

    expenseClassesFundsToFetch?.forEach(({ fundId }) => fetchExpenseClasses({
      fundId,
      fiscalYearId,
      expenseClassesByFundId,
      setExpenseClassesByFundId,
      mutator: mutator.fundExpenseClasses,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fiscalYearId,
    fundDistribution,
    mutator.fundExpenseClasses,
  ]);

  const onSelectFund = useCallback((fieldName, fundId) => {
    change(`${fieldName}.fundId`, fundId || null);
    change(`${fieldName}.code`, fundCodes.get(fundId) || null);
    change(`${fieldName}.encumbrance`, null);

    fetchExpenseClasses({
      fundId,
      fiscalYearId,
      expenseClassesByFundId,
      setExpenseClassesByFundId,
      mutator: mutator.fundExpenseClasses,
    }).then((classesResponse) => {
      let preselectedExpenseClassId = null;

      if (classesResponse?.length === 1) {
        preselectedExpenseClassId = classesResponse[0].id;
      }
      change(`${fieldName}.expenseClassId`, preselectedExpenseClassId);
    }).catch(() => {
      change(`${fieldName}.expenseClassId`, null);
    });
  }, [change, expenseClassesByFundId, fundCodes, mutator.fundExpenseClasses, fiscalYearId]);

  const onChangeToAmount = useCallback(distributionTypeFieldName => {
    change(distributionTypeFieldName.replace('distributionType', 'value'), null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeToPercent = useCallback(distributionTypeFieldName => {
    change(distributionTypeFieldName.replace('distributionType', 'value'), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return (<Loading size="xlarge" />);

  return (
    <FundDistributionFields
      currency={currency || stripes.currency}
      disabled={disabled}
      expenseClassesByFundId={expenseClassesByFundId}
      filterFunds={filterFunds}
      fundDistribution={fundDistribution}
      funds={funds}
      name={name}
      onChangeToAmount={onChangeToAmount}
      onChangeToPercent={onChangeToPercent}
      onSelectFund={onSelectFund}
      required={required}
      totalAmount={totalAmount}
      validate={validate}
      validateFundDistributionTotal={validateFundDistributionTotal}
    />
  );
};

FundDistributionFieldsFinalContainer.manifest = Object.freeze({
  fundExpenseClasses: {
    ...fundExpenseClassesManifest,
  },
});

FundDistributionFieldsFinalContainer.propTypes = {
  change: PropTypes.func,
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  filterFunds: PropTypes.func,
  fundDistribution: fundDistributionShape,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  fiscalYearId: PropTypes.string,
  stripes: PropTypes.object.isRequired,
  totalAmount: PropTypes.number,
  validate: PropTypes.func,
  validateFundDistributionTotal: PropTypes.func,
};

FundDistributionFieldsFinalContainer.defaultProps = {
  disabled: false,
  required: true,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionFieldsFinalContainer);
