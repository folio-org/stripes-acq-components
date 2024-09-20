import {
  render,
  screen,
  within,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import { affiliations } from '../../test/jest/fixtures';
import { AffiliationsSelection } from './AffiliationsSelection';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Selection: ({ id, dataOptions }) => (
    <ul id={id}>
      {
        dataOptions.map((o) => <li>{o.label}</li>)
      }
    </ul>
  ),
}));

const defaultProps = {
  id: 'test',
  affiliations,
  value: affiliations[2].tenantId,
  onChange: jest.fn(),
  isLoading: false,
};

const renderAffiliationsSelection = (props = {}) => render(
  <AffiliationsSelection
    {...defaultProps}
    {...props}
  />,
);

describe('AffiliationsSelection', () => {
  it('should render affiliation selection with provided options', async () => {
    renderAffiliationsSelection();

    expect(
      within(document.getElementById('test-affiliations-select'))
        .getByText(affiliations[2].tenantName),
    ).toBeInTheDocument();
    await user.click(screen.getByText('stripes-components.selection.controlLabel'));
    affiliations.forEach(({ tenantName, isPrimary }) => {
      expect(
        within(document.getElementById('test-affiliations-select'))
          .getByText(isPrimary ? `${tenantName} stripes-acq-components.consortia.affiliations.primary.label` : tenantName),
      ).toBeInTheDocument();
    });
  });
});
