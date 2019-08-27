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

import { baseManifest } from '../manifests';
import FieldsFundView from './FieldsFundView';

const getFundsForSelect = (resources) => get(resources, 'fund.records', []).map(({ name, code, id }) => ({
  label: name,
  value: id,
  code,
}));

const FieldsFundDistribution = ({
  resources, formValues, disabled, required, estimatedPrice,
}) => {
  const funds = getFundsForSelect(resources);

  const renderSubForm = (elem, index, fields) => {
    const fund = fields.get(index);
    const fundCode = get(funds.find(({ value }) => value === fund.fundId), 'code');

    return (
      <FieldsFundView
        formValues={formValues}
        fundCode={fundCode}
        funds={funds}
        fund={fund}
        estimatedPrice={estimatedPrice}
        required={required}
        elem={elem}
        disabled={disabled}
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

FieldsFundDistribution.manifest = Object.freeze({
  funds: {
    ...baseManifest,
    path: 'finance-storage/funds',
    records: 'funds',
  },
});

FieldsFundDistribution.propTypes = {
  resources: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  estimatedPrice: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldsFundDistribution.defaultProps = {
  disabled: false,
  required: true,
};

export default stripesConnect(FieldsFundDistribution);
