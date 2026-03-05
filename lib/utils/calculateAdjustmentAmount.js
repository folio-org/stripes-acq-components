import get from 'lodash/get';

import { ADJUSTMENT_TYPE_VALUES } from '../constants';
import { getMoneyMultiplier } from './getMoneyMultiplier';

export const calculateAdjustmentAmount = (adjustment, invoiceSubTotal, currency) => {
  const adjustmentValue = Number(get(adjustment, 'value', 0));
  const adjustmentType = get(adjustment, 'type', ADJUSTMENT_TYPE_VALUES.amount);
  const multiplier = getMoneyMultiplier(currency);

  const amount = adjustmentType === ADJUSTMENT_TYPE_VALUES.amount
    ? adjustmentValue
    : (invoiceSubTotal * adjustmentValue) / 100;

  return Math.round(amount * multiplier) / multiplier;
};
