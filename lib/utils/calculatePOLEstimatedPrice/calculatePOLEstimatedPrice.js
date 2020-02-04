import { DISCOUNT_TYPE } from '../../constants';
import { getMoneyMultiplier } from '../getMoneyMultiplier';

export const calculatePOLEstimatedPrice = (poLine, systemCurrency) => {
  const currency = poLine?.cost?.currency || systemCurrency;
  const multiplier = getMoneyMultiplier(currency);

  const quantityPhysical = poLine?.cost?.quantityPhysical || 0;
  const quantityElectronic = poLine?.cost?.quantityElectronic || 0;
  const listUnitPrice = Number(poLine?.cost?.listUnitPrice || 0) * multiplier;
  const listUnitPriceElectronic = Number(poLine?.cost?.listUnitPriceElectronic || 0) * multiplier;
  const baseListPrice = (listUnitPrice * quantityPhysical) + (listUnitPriceElectronic * quantityElectronic);

  const additionalCost = Number(poLine?.cost?.additionalCost || 0) * multiplier;

  const discount = Number(poLine?.cost?.discount || 0);
  const discountType = poLine?.cost?.discountType || DISCOUNT_TYPE.amount;
  const discountAmount = discountType === DISCOUNT_TYPE.amount
    ? discount * multiplier
    : Math.round(baseListPrice * discount * 100) / 10000;

  return Math.round(baseListPrice + additionalCost - discountAmount) / multiplier;
};
