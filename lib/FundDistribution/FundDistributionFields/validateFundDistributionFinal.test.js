import { render, screen } from '@testing-library/react';

import { validateFundDistributionFinal } from './validateFundDistributionFinal';
import { FUND_DISTR_TYPE } from '../../constants';

describe('validateFundDistributionFinal', () => {
  it('should return undefined if no fund distribution provided', () => {
    const error = validateFundDistributionFinal();

    expect(error).toBeUndefined();
  });

  it('should return undefined if empty fund distribution provided', () => {
    const error = validateFundDistributionFinal([]);

    expect(error).toBeUndefined();
  });

  it('should return error element if no currency provided', () => {
    const FD = [{
      value: 100,
    }];

    render(validateFundDistributionFinal(FD, 0.25));
    expect(screen.getByText('stripes-acq-components.validation.shouldBeEqualToTotalAmount')).toBeDefined();
  });

  it('should return undefined if totalAmount matches sum in fund distribution array with percent type', () => {
    const FD = [{
      // distributionType: FUND_DISTR_TYPE.percent, by default
      value: 100,
    }];

    const error = validateFundDistributionFinal(FD, 0.25, 'USD');

    expect(error).toBeUndefined();
  });

  it('should return undefined if totalAmount matches sum in fund distribution array', () => {
    const FD = [{
      distributionType: FUND_DISTR_TYPE.amount,
      value: 0.25,
    }];

    const error = validateFundDistributionFinal(FD, 0.25, 'EUR');

    expect(error).toBeUndefined();
  });

  it('should return error element about uniqueFunds if there are funds with the same expense class', () => {
    const FD = [
      {
        expenseClassId: '1',
        value: 50,
      },
      {
        expenseClassId: '1',
        value: 50,
      },
    ];

    render(validateFundDistributionFinal(FD, 0.5));
    expect(screen.getByText('stripes-acq-components.validation.fundDistribution.uniqueFunds')).toBeDefined();
  });

  it('should pass validation with penny problem', () => {
    const FD = [
      {
        distributionType: FUND_DISTR_TYPE.percent,
        fundId: '1',
        value: 50,
      },
      {
        distributionType: FUND_DISTR_TYPE.percent,
        fundId: '2',
        value: 50,
      },
    ];

    const error = validateFundDistributionFinal(FD, 0.25, 'USD');

    expect(error).toBeUndefined();
  });
});
