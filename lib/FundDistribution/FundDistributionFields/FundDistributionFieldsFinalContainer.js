import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import { fundsManifest } from '../../manifests';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';
import FundDistributionFields from './FundDistributionFieldsFinal';

const FundDistributionFieldsFinalContainer = ({
  change,
  currency,
  disabled,
  fundDistribution,
  name,
  required,
  resources,
  stripes,
  totalAmount,
  validate,
}) => {
  const funds = resources?.[DICT_FUNDS]?.records;
  const fundCodes = useMemo(() => funds && new Map(funds.map(f => [f.id, f.code])), [funds]);
  const onSelectFund = useCallback((fieldName, fundId) => {
    change(`${fieldName}.fundId`, fundId || null);
    change(`${fieldName}.code`, fundCodes.get(fundId) || null);
  }, [change, fundCodes]);

  if (!funds) return (<Loading size="xlarge" />);

  return (
    <FundDistributionFields
      currency={currency || stripes.currency}
      disabled={disabled}
      fundDistribution={fundDistribution}
      funds={funds}
      name={name}
      onSelectFund={onSelectFund}
      required={required}
      totalAmount={totalAmount}
      validate={validate}
    />
  );
};

FundDistributionFieldsFinalContainer.manifest = Object.freeze({
  [DICT_FUNDS]: fundsManifest,
});

FundDistributionFieldsFinalContainer.propTypes = {
  change: PropTypes.func,
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  fundDistribution: fundDistributionShape,
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
