import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Col,
  Row,
  MultiColumnList,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const VISIBLE_COLUMNS = ['name', 'expenseClass', 'value', 'amount', 'initialEncumbrance', 'currentEncumbrance'];
const columnMapping = {
  'adjustmentDescription': <FormattedMessage id="stripes-acq-components.fundDistribution.adjustmentDescription" />,
  'name': <FormattedMessage id="stripes-acq-components.fundDistribution.name" />,
  'value': <FormattedMessage id="stripes-acq-components.fundDistribution.value" />,
  'amount': <FormattedMessage id="stripes-acq-components.fundDistribution.amount" />,
  'initialEncumbrance': <FormattedMessage id="stripes-acq-components.fundDistribution.initialEncumbrance" />,
  'currentEncumbrance': <FormattedMessage id="stripes-acq-components.fundDistribution.currentEncumbrance" />,
  'expenseClass': <FormattedMessage id="stripes-acq-components.fundDistribution.expenseClass" />,
};
const getResultFormatter = (currency, expenseClasses, amounts) => ({
  amount: fund => {
    return (
      <AmountWithCurrencyField
        currency={currency}
        amount={amounts[fund.rowIndex]}
      />
    );
  },
  initialEncumbrance: item => (
    <AmountWithCurrencyField
      currency={item.fundEncumbrance?.currency}
      amount={item.fundEncumbrance?.encumbrance?.initialAmountEncumbered}
    />
  ),
  currentEncumbrance: item => (
    <AmountWithCurrencyField
      currency={item.fundEncumbrance?.currency}
      amount={item.fundEncumbrance?.amount}
    />
  ),
  expenseClass: ({ expenseClassId }) => expenseClasses
    .filter(({ id }) => id === expenseClassId)[0]?.name || <NoValue />,
  name: (fundDistr) => (fundDistr.fundName
    ? (
      <TextLink
        rel="noopener noreferrer"
        target="_blank"
        to={`/finance/fund/view/${fundDistr.fundId}`}
      >
        {fundDistr.fundName}
      </TextLink>
    )
    : <FormattedMessage id="stripes-acq-components.fundDistribution.unavailableFund" />
  ),
  value: ({ value, distributionType }) => `${value || '0'}${distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}`,
});

const FundDistributionView = ({
  amounts, fundsToDisplay, currency, expenseClasses,
}) => {
  const visibleColumns = get(fundsToDisplay, '0.adjustmentDescription')
    ? ['adjustmentDescription', ...VISIBLE_COLUMNS]
    : VISIBLE_COLUMNS;

  const resultFormatter = useMemo(
    () => getResultFormatter(currency, expenseClasses, amounts),
    [currency, expenseClasses, amounts],
  );

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          contentData={fundsToDisplay}
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
  amounts: PropTypes.object.isRequired,
  fundsToDisplay: fundDistributionShape.isRequired,
  currency: PropTypes.string.isRequired,
  expenseClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FundDistributionView;
