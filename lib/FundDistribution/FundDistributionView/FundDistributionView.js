import get from 'lodash/get';
import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

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
import { useVersionWrappedFormatter } from '../../VersionHistory';
import {
  FUND_DISTRIBUTION_COLUMNS,
  FUND_DISTRIBUTION_COLUMN_MAPPING,
  FUND_DISTRIBUTION_FIELDS_MAPPINGS,
  FUND_DISTRIBUTION_VISIBLE_COLUMNS,
} from './constants';

export const getFundDistributionResultFormatter = (currency, amounts) => ({
  [FUND_DISTRIBUTION_COLUMNS.amount]: fund => {
    return (
      <AmountWithCurrencyField
        currency={currency}
        amount={amounts[fund.rowIndex]}
      />
    );
  },
  [FUND_DISTRIBUTION_COLUMNS.initialEncumbrance]: item => (
    <AmountWithCurrencyField
      currency={item.fundEncumbrance?.currency}
      amount={item.fundEncumbrance?.encumbrance?.initialAmountEncumbered}
    />
  ),
  [FUND_DISTRIBUTION_COLUMNS.currentEncumbrance]: item => {
    const displayValue = (
      <AmountWithCurrencyField
        currency={item.fundEncumbrance?.currency}
        amount={item.fundEncumbrance?.amount}
      />
    );

    const isLink = Boolean(
      item.fundBudget?.id
      && item.fundEncumbrance?.id
      && !isNil(item.fundEncumbrance?.amount),
    );

    return isLink
      ? (
        <TextLink
          rel="noopener noreferrer"
          target="_blank"
          to={`/finance/transactions/budget/${item.fundBudget.id}/transaction/${item.fundEncumbrance.id}/view`}
        >
          {displayValue}
        </TextLink>
      )
      : displayValue;
  },
  [FUND_DISTRIBUTION_COLUMNS.expenseClass]: (item) => item.fundExpenseClass?.name || <NoValue />,
  [FUND_DISTRIBUTION_COLUMNS.name]: (fundDistr) => (fundDistr.fundName
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
  [FUND_DISTRIBUTION_COLUMNS.value]: ({ value, distributionType }) => `${value || '0'}${distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}`,
});

const FundDistributionView = ({
  amounts,
  currency,
  fundsToDisplay,
  mclProps = {},
  name,
}) => {
  const visibleColumns = get(fundsToDisplay, '0.adjustmentDescription')
    ? ['adjustmentDescription', ...FUND_DISTRIBUTION_VISIBLE_COLUMNS]
    : FUND_DISTRIBUTION_VISIBLE_COLUMNS;

  const baseFormatter = useMemo(
    () => getFundDistributionResultFormatter(currency, amounts),
    [currency, amounts],
  );

  const formatter = useVersionWrappedFormatter({
    baseFormatter,
    name,
    fieldsMapping: FUND_DISTRIBUTION_FIELDS_MAPPINGS,
  });

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          contentData={fundsToDisplay}
          visibleColumns={visibleColumns}
          columnMapping={FUND_DISTRIBUTION_COLUMN_MAPPING}
          formatter={formatter}
          interactive={false}
          {...mclProps}
        />
      </Col>
    </Row>
  );
};

FundDistributionView.propTypes = {
  amounts: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  fundsToDisplay: fundDistributionShape.isRequired,
  mclProps: PropTypes.object,
  name: PropTypes.string,
};

export default FundDistributionView;
