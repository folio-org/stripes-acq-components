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

const FundDistributionView = ({
  fundsToDisplay, totalAmount, currency,
}) => {
  const names = map(fundsToDisplay, 'name').join(', ');
  const codes = map(fundsToDisplay, 'code').join(', ');
  const percentages = fundsToDisplay.map(val => `${val.percentage || '0'}%`).join(', ');
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
          label={<FormattedMessage id="stripes-acq-components.fundDistribution.percent" />}
          value={percentages}
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