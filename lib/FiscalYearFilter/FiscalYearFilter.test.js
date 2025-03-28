import noop from 'lodash/noop';

import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { useFiscalYears } from '../hooks';
import { FiscalYearFilter } from './FiscalYearFilter';

jest.mock('../hooks', () => ({
  useFiscalYears: jest.fn(),
}));

const labelId = 'fiscalYearId';
const fiscalYearsMock = [
  { id: 'fy-1', code: 'FY2022' },
  { id: 'fy-2', code: 'FY2023' },
];

const renderFilter = () => render(
  <FiscalYearFilter
    id="fiscalYear"
    activeFilters={[]}
    name="fiscalYear"
    onChange={noop}
    labelId={labelId}
  />,
);

describe('FiscalYearFilter', () => {
  beforeEach(() => {
    useFiscalYears.mockClear().mockReturnValue({ fiscalYears: fiscalYearsMock, isLoading: false });
  });

  it('should display filter title', async () => {
    renderFilter();

    await user.click(screen.getByRole('button', { name: '' }));

    expect(screen.getByText(labelId)).toBeInTheDocument();

    expect(screen.getByText(fiscalYearsMock[0].code)).toBeInTheDocument();
    expect(screen.getByText(fiscalYearsMock[1].code)).toBeInTheDocument();
  });

  it('should display spinner element', () => {
    useFiscalYears.mockClear().mockReturnValue({ fiscalYears: fiscalYearsMock, isLoading: true });
    const { container } = renderFilter();
    const spinnerElement = container.querySelector('.spinner');

    expect(spinnerElement).toBeInTheDocument();
  });
});
