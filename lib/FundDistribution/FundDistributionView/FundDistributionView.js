import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

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
import { fundDistributionShape } from '../../shapes';

const VISIBLE_COLUMNS = ['name', 'value', 'amount', 'initialEncumbrance', 'currentEncumbrance'];
const columnMapping = {
  'adjustmentDescription': <FormattedMessage id="stripes-acq-components.fundDistribution.adjustmentDescription" />,
  'name': <FormattedMessage id="stripes-acq-components.fundDistribution.name" />,
  'value': <FormattedMessage id="stripes-acq-components.fundDistribution.value" />,
  'amount': <FormattedMessage id="stripes-acq-components.fundDistribution.amount" />,
  'initialEncumbrance': <FormattedMessage id="stripes-acq-components.fundDistribution.initialEncumbrance" />,
  'currentEncumbrance': <FormattedMessage id="stripes-acq-components.fundDistribution.currentEncumbrance" />,
};
const getResultFormatter = (currency) => ({
  amount: item => (
    <AmountWithCurrencyField
      currency={currency}
      amount={item.amount}
    />
  ),
  initialEncumbrance: item => item.fundEncumbrance && (
    <AmountWithCurrencyField
      currency={item.fundEncumbrance.currency}
      amount={item.fundEncumbrance.encumbrance.initialAmountEncumbered}
    />
  ),
  currentEncumbrance: item => item.fundEncumbrance && (
    <AmountWithCurrencyField
      currency={item.fundEncumbrance.currency}
      amount={item.fundEncumbrance.amount}
    />
  ),
});

const FundDistributionView = ({
  fundsToDisplay, totalAmount, currency,
}) => {
  const funds = fundsToDisplay.map(fund => ({
    adjustmentDescription: fund.adjustmentDescription,
    name: fund.fundName,
    value: `${fund.value || '0'}${fund.distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}`,
    amount: calculateFundAmount(fund, fund.totalAmount || totalAmount, currency),
    fundEncumbrance: fund.fundEncumbrance,
  }));

  const visibleColumns = get(fundsToDisplay, '0.adjustmentDescription')
    ? ['adjustmentDescription', ...VISIBLE_COLUMNS]
    : VISIBLE_COLUMNS;

  const resultFormatter = useMemo(() => getResultFormatter(currency), [currency]);

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          contentData={funds}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          formatter={resultFormatter}
          interactive={false}
        />
      </Col>
    </Row>
  );
};

FundDistributionView.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  fundsToDisplay: fundDistributionShape.isRequired,
  currency: PropTypes.string.isRequired,
};

FundDistributionView.defaultProps = {};

export default FundDistributionView;
