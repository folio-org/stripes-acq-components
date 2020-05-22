import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { change } from 'redux-form';

import {
  stripesConnect,
} from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import { getFundsForSelect } from '../../utils';
import { fundsManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const FundDistributionFieldsContainer = ({
  resources, fundDistribution, disabled, required, totalAmount, currency, name, stripes, formName,
}) => {
  const funds = resources?.[DICT_FUNDS]?.records;
  const fundCodes = useMemo(() => funds && new Map(funds.map(f => [f.id, f.code])), [funds]);
  const fundsForSelect = useMemo(() => getFundsForSelect(funds), [funds]);
  const onSelectFund = useCallback((event, newValue, previousValue, fieldName) => {
    if (formName) {
      stripes.store.dispatch(change(formName, fieldName.replace('fundId', 'code'), fundCodes.get(newValue) || null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName, fundCodes]);

  if (!funds) return (<Loading size="xlarge" />);

  return (
    <FundDistributionFields
      currency={currency || stripes.currency}
      disabled={disabled}
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
});

FundDistributionFieldsContainer.propTypes = {
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  fundDistribution: fundDistributionShape,
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
