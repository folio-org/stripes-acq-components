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
import {
  FUND_DISTRIBUTION_COLUMN_MAPPING,
  FUND_DISTRIBUTION_VISIBLE_COLUMNS,
} from './constants';

export const getFundDistributionResultFormatter = (currency, expenseClasses, amounts) => ({
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
    <TextLink
      rel="noopener noreferrer"
      target="_blank"
      to={`/finance/transactions/budget/${item.fundBudget?.id}/transaction/${item.fundEncumbrance?.id}/view`}
    >
      <AmountWithCurrencyField
        currency={item.fundEncumbrance?.currency}
        amount={item.fundEncumbrance?.amount}
      />
    </TextLink>
  ),
  // eslint-disable-next-line react/prop-types
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
  amounts,
  fundsToDisplay,
  currency,
  expenseClasses,
  mclProps = {},
}) => {
  const visibleColumns = get(fundsToDisplay, '0.adjustmentDescription')
    ? ['adjustmentDescription', ...FUND_DISTRIBUTION_VISIBLE_COLUMNS]
    : FUND_DISTRIBUTION_VISIBLE_COLUMNS;

  const resultFormatter = useMemo(
    () => getFundDistributionResultFormatter(currency, expenseClasses, amounts),
    [currency, expenseClasses, amounts],
  );

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          contentData={fundsToDisplay}
          visibleColumns={visibleColumns}
          columnMapping={FUND_DISTRIBUTION_COLUMN_MAPPING}
          formatter={resultFormatter}
          interactive={false}
          {...mclProps}
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
  mclProps: PropTypes.object,
};

export default FundDistributionView;
