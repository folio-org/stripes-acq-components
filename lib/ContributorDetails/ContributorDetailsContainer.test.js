import {
  render,
  screen,
} from '@testing-library/react';

import { useContributorNameTypes } from '../hooks';
import ContributorDetailsContainer from './ContributorDetailsContainer';
import ContributorDetails from './ContributorDetails';

const CONTRIBUTOR_NAME_TYPES = [{ id: '1', name: 'contr 1' }];

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useContributorNameTypes: jest.fn(),
}));
jest.mock('./ContributorDetails', () => {
  return jest.fn(() => 'ContributorDetails');
});

const renderComponent = (props = {}) => (render(
  <ContributorDetailsContainer
    {...props}
  />,
));

describe('ContributorDetailsContainer', () => {
  beforeEach(() => {
    ContributorDetails.mockClear();
    useContributorNameTypes
      .mockClear()
      .mockReturnValue({ contributorNameTypes: CONTRIBUTOR_NAME_TYPES });
  });

  it('should display ContributorDetails', () => {
    renderComponent();
    expect(screen.getByText('ContributorDetails')).toBeDefined();
  });

  it('should pass dictionary with contr name types to the child', () => {
    renderComponent();
    expect(ContributorDetails.mock.calls[0][0].contributorNameTypes).toEqual(CONTRIBUTOR_NAME_TYPES);
  });
});
