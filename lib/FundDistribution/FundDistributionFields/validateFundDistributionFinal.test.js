import { render, screen } from '@testing-library/react';

import {
  validateFundDistributionTotal,
  validateFundDistributionUniqueFunds,
} from './validateFundDistributionFinal';
import { FUND_DISTR_TYPE } from '../../constants';

describe('validateFundDistributionFinal', () => {
  it('should return undefined if empty fund distribution provided', () => {
    const error = validateFundDistributionUniqueFunds([]);

    expect(error).toBeUndefined();
  });

  it('should return error element if no currency provided', async () => {
    const FD = [{
      value: 100,
    }];

    await expect(validateFundDistributionTotal(FD, 0.25)).rejects.toEqual(expect.objectContaining({
      errors: expect.objectContaining({}),
    }));
  });

  it('should return undefined if totalAmount matches sum in fund distribution array with percent type', async () => {
    const FD = [{
      // distributionType: FUND_DISTR_TYPE.percent, by default
      value: 100,
    }];

    await expect(validateFundDistributionTotal(FD, 0.25, 'USD')).resolves.toEqual();
  });

  it('should return undefined if totalAmount matches sum in fund distribution array', async () => {
    const FD = [{
      distributionType: FUND_DISTR_TYPE.amount,
      value: 0.25,
    }];

    await expect(validateFundDistributionTotal(FD, 0.25, 'USD')).resolves.toEqual();
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

    render(validateFundDistributionUniqueFunds(FD, 0.5));
    expect(screen.getByText('stripes-acq-components.validation.fundDistribution.uniqueFunds')).toBeDefined();
  });

  it('should pass validation with penny problem', async () => {
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

    await expect(validateFundDistributionTotal(FD, 0.25, 'USD')).resolves.toEqual();
  });
});
