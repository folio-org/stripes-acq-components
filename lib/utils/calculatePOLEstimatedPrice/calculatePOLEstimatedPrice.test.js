import { DISCOUNT_TYPE } from '../../constants';

import { calculatePOLEstimatedPrice } from './calculatePOLEstimatedPrice';

describe('calculatePOLEstimatedPrice', () => {
  const defaultCurrency = 'USD';

  it('should return 0.00 when po line does not have cost', () => {
    expect(calculatePOLEstimatedPrice(undefined, defaultCurrency)).toBe(0.00);
    expect(calculatePOLEstimatedPrice({}, defaultCurrency)).toBe(0.00);
  });

  it('should return correct price when physical cost is passed', () => {
    const poLine = {
      cost: {
        quantityPhysical: 5,
        listUnitPrice: 5,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(25.00);
  });

  it('should return correct price when electronic cost is passed', () => {
    const poLine = {
      cost: {
        quantityElectronic: 5,
        listUnitPriceElectronic: 5,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(25.00);
  });

  it('should return correct price when physical and electronic costs are passed', () => {
    const poLine = {
      cost: {
        quantityPhysical: 5,
        listUnitPrice: 5,
        quantityElectronic: 5,
        listUnitPriceElectronic: 5,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(50.00);
  });

  it('should return correct price with included additional cost', () => {
    const poLine = {
      cost: {
        quantityElectronic: 5,
        listUnitPriceElectronic: 5,
        additionalCost: 5,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(30.00);
  });

  it('should return correct price when discount (default - amount) is passed', () => {
    const poLine = {
      cost: {
        quantityPhysical: 5,
        listUnitPrice: 5,
        discount: 5,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(20.00);
  });

  it('should return correct price when discount (amount) is passed', () => {
    const poLine = {
      cost: {
        quantityPhysical: 5,
        listUnitPrice: 5,
        discount: 5,
        discountType: DISCOUNT_TYPE.amount,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(20.00);
  });

  it('should return correct price when discount (percent) is passed', () => {
    const poLine = {
      cost: {
        quantityPhysical: 5,
        listUnitPrice: 5,
        additionalCost: 1,
        discount: 29,
        discountType: DISCOUNT_TYPE.percentage,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(18.75);
  });

  it('should return correct price with cost currency', () => {
    const poLine = {
      cost: {
        quantityElectronic: 5.36,
        listUnitPriceElectronic: 5,
        additionalCost: 5,
        discount: 9,
        discountType: DISCOUNT_TYPE.percentage,
        currency: 'BHD',
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(29.388);
  });

  it('should return correct price with system currency (cost currency is not defined)', () => {
    const poLine = {
      cost: {
        quantityElectronic: 5.36,
        listUnitPriceElectronic: 5,
        additionalCost: 5,
        discount: 9,
        discountType: DISCOUNT_TYPE.percentage,
      },
    };

    expect(calculatePOLEstimatedPrice(poLine, defaultCurrency)).toBe(29.39);
  });
});
