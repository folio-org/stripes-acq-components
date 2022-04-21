import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import {
  fundsManifest,
  fundExpenseClassesManifest,
} from '../../manifests';
import {
  DICT_FUNDS,
} from '../../constants';
import { fundDistributionShape } from '../../shapes';
import FundDistributionFields from './FundDistributionFieldsFinal';
import { fetchExpenseClasses } from './fetchExpenseClasses';

const FundDistributionFieldsFinalContainer = ({
  change,
  currency,
  disabled,
  fundDistribution,
  mutator: originMutator,
  name,
  required,
  resources,
  stripes,
  totalAmount,
  validate,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const funds = resources?.[DICT_FUNDS]?.records;
  const fundCodes = useMemo(() => funds && new Map(funds.map(f => [f.id, f.code])), [funds]);
  const [expenseClassesByFundId, setExpenseClassesByFundId] = useState({});

  useEffect(() => {
    const expenseClassesFundsToFetch = fundDistribution?.filter(({ fundId }) => (
      fundId && !expenseClassesByFundId[fundId]
    ));

    if (expenseClassesFundsToFetch?.length) {
      expenseClassesFundsToFetch.forEach(({ fundId }) => fetchExpenseClasses(
        fundId, expenseClassesByFundId, setExpenseClassesByFundId, mutator.fundExpenseClasses,
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundDistribution, expenseClassesByFundId]);

  const onSelectFund = useCallback((fieldName, fundId) => {
    change(`${fieldName}.fundId`, fundId || null);
    change(`${fieldName}.code`, fundCodes.get(fundId) || null);

    fetchExpenseClasses(
      fundId, expenseClassesByFundId, setExpenseClassesByFundId, mutator.fundExpenseClasses,
    ).then((classesResponse) => {
      let preselectedExpenseClassId = null;

      if (classesResponse?.length === 1) {
        preselectedExpenseClassId = classesResponse[0].id;
      }
      change(`${fieldName}.expenseClassId`, preselectedExpenseClassId);
    }).catch(() => {
      change(`${fieldName}.expenseClassId`, null);
    });
  }, [change, expenseClassesByFundId, fundCodes, mutator.fundExpenseClasses]);

  const onChangeToAmount = useCallback(distributionTypeFieldName => {
    change(distributionTypeFieldName.replace('distributionType', 'value'), null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeToPercent = useCallback(distributionTypeFieldName => {
    change(distributionTypeFieldName.replace('distributionType', 'value'), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!funds) return (<Loading size="xlarge" />);

  return (
    <FundDistributionFields
      currency={currency || stripes.currency}
      disabled={disabled}
      expenseClassesByFundId={expenseClassesByFundId}
      fundDistribution={fundDistribution}
      funds={funds}
      name={name}
      onChangeToAmount={onChangeToAmount}
      onChangeToPercent={onChangeToPercent}
      onSelectFund={onSelectFund}
      required={required}
      totalAmount={totalAmount}
      validate={validate}
    />
  );
};

FundDistributionFieldsFinalContainer.manifest = Object.freeze({
  fundExpenseClasses: {
    ...fundExpenseClassesManifest,
    params: {
      status: 'Active',
    },
  },
  [DICT_FUNDS]: fundsManifest,
});

FundDistributionFieldsFinalContainer.propTypes = {
  change: PropTypes.func,
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  fundDistribution: fundDistributionShape,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  totalAmount: PropTypes.number,
  validate: PropTypes.func,
};

FundDistributionFieldsFinalContainer.defaultProps = {
  disabled: false,
  required: true,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionFieldsFinalContainer);
