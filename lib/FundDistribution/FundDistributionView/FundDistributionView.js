import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  calculateFundAmount,
} from '../../utils';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';

const visibleColumns = ['name', 'value', 'amount'];
const columnMapping = {
  'name': <FormattedMessage id="stripes-acq-components.fundDistribution.name" />,
  'value': <FormattedMessage id="stripes-acq-components.fundDistribution.value" />,
  'amount': <FormattedMessage id="stripes-acq-components.fundDistribution.amount" />,
};
const getResultFormatter = (currency) => ({
  amount: item => (
    <AmountWithCurrencyField
      currency={currency}
      amount={item.amount}
    />
  ),
});

const FundDistributionView = ({
  fundsToDisplay, totalAmount, currency,
}) => {
  const funds = fundsToDisplay.map(fund => ({
    name: fund.fundName,
    value: `${fund.value || '0'}${fund.distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}`,
    amount: calculateFundAmount(fund, totalAmount),
  }));

  const resultFormatter = useMemo(() => getResultFormatter(currency), [currency]);

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          contentData={funds}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          formatter={resultFormatter}
        />
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
