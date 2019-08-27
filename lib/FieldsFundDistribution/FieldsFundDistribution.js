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

import { getFundsForSelect } from '../utils';
import { baseManifest } from '../manifests';
import FieldsFundView from './FieldsFundView';

const FieldsFundDistribution = ({
  resources, formValues, disabled, required, price,
}) => {
  const funds = getFundsForSelect(resources);

  const renderSubForm = (elem, index, fields) => {
    const fund = fields.get(index);
    const fundCode = get(funds.find(({ value }) => value === fund.fundId), 'code');

    return (
      <FieldsFundView
        fundCode={fundCode}
        funds={funds}
        fund={fund}
        price={price}
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
  price: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldsFundDistribution.defaultProps = {
  disabled: false,
  required: true,
};

export default stripesConnect(FieldsFundDistribution);
