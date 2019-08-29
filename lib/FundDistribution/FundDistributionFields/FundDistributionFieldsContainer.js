import React from 'react';
import PropTypes from 'prop-types';
import {
  FieldArray,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';

import {
  RepeatableField,
} from '@folio/stripes/components';

import { getFundsForSelect } from '../../utils';
import { baseManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';

const FundDistributionFieldsContainer = ({
  resources, formValues, disabled, required, totalAmount, currency,
}) => {
  const funds = getFundsForSelect(resources);

  const renderSubForm = (elem, index, fields) => {
    const fund = fields.get(index);
    const fundCode = get(funds.find(({ value }) => value === fund.fundId), 'code');

    return (
      <FundDistributionFields
        fundCode={fundCode}
        funds={funds}
        fund={fund}
        totalAmount={totalAmount}
        required={required}
        elem={elem}
        disabled={disabled}
        currency={currency}
      />
    );
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="stripes-acq-components.fundDistribution.addBtn" />}
      component={RepeatableField}
      name="fundDistributions"
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
        formValues,
      }}
      renderField={renderSubForm}
    />
  );
};

FundDistributionFieldsContainer.manifest = Object.freeze({
  funds: {
    ...baseManifest,
    path: 'finance-storage/funds',
    records: 'funds',
  },
});

FundDistributionFieldsContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  totalAmount: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  currency: PropTypes.string,
};

FundDistributionFieldsContainer.defaultProps = {
  disabled: false,
  required: true,
};

export default stripesConnect(FundDistributionFieldsContainer);
