import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  calculateFundAmount,
} from '../../utils';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';

const FundDistributionView = ({
  fundsToDisplay, totalAmount, currency,
}) => {
  const names = map(fundsToDisplay, 'name').join(', ');
  const codes = map(fundsToDisplay, 'code').join(', ');
  const values = fundsToDisplay.map(({ value, distributionType }) => {
    return `${value || '0'}${distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}`;
  }).join(', ');
  const amounts = fundsToDisplay.map(fund => calculateFundAmount(fund, totalAmount));

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="stripes-acq-components.fundDistribution.id" />}
          value={names}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="stripes-acq-components.fundDistribution.value" />}
          value={values}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="stripes-acq-components.fundDistribution.code" />}
          value={codes}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue label={<FormattedMessage id="stripes-acq-components.fundDistribution.amount" />}>
          {amounts.map((amount, index) => (
            <Fragment key={`fund-currency-${index}`}>
              <AmountWithCurrencyField
                currency={currency}
                amount={amount}
              />
              {index + 1 < amounts.length && ', '}
            </Fragment>
          ))}
        </KeyValue>
      </Col>
    </Row>
  );
};

FundDistributionView.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  fundsToDisplay: PropTypes.arrayOf(PropTypes.object).isRequired,
  currency: PropTypes.string,
};

FundDistributionView.defaultProps = {};

export default FundDistributionView;
