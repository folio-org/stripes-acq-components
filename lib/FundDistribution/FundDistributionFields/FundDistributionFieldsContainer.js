import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { change } from 'redux-form';

import {
  stripesConnect,
} from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import { getFundsForSelect } from '../../utils';
import { fundsManifest, fundExpenseClassesManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';
import { fetchExpenseClasses } from './fetchExpenseClasses';

const FundDistributionFieldsContainer = ({
  resources, fundDistribution, disabled, required, totalAmount, currency, name, stripes, formName, mutator,
}) => {
  const funds = resources?.[DICT_FUNDS]?.records;
  const fundCodes = useMemo(() => funds && new Map(funds.map(f => [f.id, f.code])), [funds]);
  const fundsForSelect = useMemo(() => getFundsForSelect(funds), [funds]);
  const [expenseClassesByFundId, setExpenseClassesByFundId] = useState({});

  useEffect(() => {
    if (fundDistribution?.length) {
      fundDistribution.forEach(({ fundId }) => fetchExpenseClasses(
        fundId, expenseClassesByFundId, setExpenseClassesByFundId, mutator.fundExpenseClasses,
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectFund = useCallback((event, newValue, previousValue, fieldName) => {
    if (formName) {
      const fieldNameExpenseClassId = fieldName.replace('fundId', 'expenseClassId');

      stripes.store.dispatch(change(formName, fieldName.replace('fundId', 'code'), fundCodes.get(newValue) || null));
      fetchExpenseClasses(
        newValue, expenseClassesByFundId, setExpenseClassesByFundId, mutator.fundExpenseClasses,
      ).then((classesResponse) => {
        let preselectedExpenseClassId = null;

        if (classesResponse?.length === 1) {
          preselectedExpenseClassId = classesResponse[0].id;
        }
        stripes.store.dispatch(change(formName, fieldNameExpenseClassId, preselectedExpenseClassId));
      }).catch(() => {
        stripes.store.dispatch(change(formName, fieldNameExpenseClassId, null));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseClassesByFundId, formName, fundCodes]);

  if (!funds) return (<Loading size="xlarge" />);

  return (
    <FundDistributionFields
      currency={currency || stripes.currency}
      disabled={disabled}
      expenseClassesByFundId={expenseClassesByFundId}
      fundDistribution={fundDistribution}
      funds={fundsForSelect}
      name={name}
      onSelectFund={onSelectFund}
      required={required}
      totalAmount={totalAmount}
      stripes={stripes}
    />
  );
};

FundDistributionFieldsContainer.manifest = Object.freeze({
  [DICT_FUNDS]: fundsManifest,
  fundExpenseClasses: {
    ...fundExpenseClassesManifest,
    params: {
      status: 'Active',
    },
  },
});

FundDistributionFieldsContainer.propTypes = {
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  fundDistribution: fundDistributionShape,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  totalAmount: PropTypes.number,
};

FundDistributionFieldsContainer.defaultProps = {
  disabled: false,
  required: true,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionFieldsContainer);
