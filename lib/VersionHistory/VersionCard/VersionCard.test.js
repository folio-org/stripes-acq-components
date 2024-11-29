import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import VersionCard from './VersionCard';

const defaultProps = {
  changedFields: ['Prefix', 'Notes'],
  id: 'testCardId',
  isCurrent: false,
  isLatest: false,
  onSelect: jest.fn(),
  source: 'Galt, John',
  title: '12/12/2022',
};

const renderVersionCard = (props = {}) => render(
  <VersionCard
    {...defaultProps}
    {...props}
  />,
);

describe('VersionCard', () => {
  beforeEach(() => {
    defaultProps.onSelect.mockClear();
  });

  it('should display version history card', () => {
    renderVersionCard();

    defaultProps.changedFields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
    expect(screen.getByText(defaultProps.source)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('should display version history card with system update', () => {
    renderVersionCard({ isSystemChange: true });

    expect(screen.getByText(/systemChange/)).toBeInTheDocument();
  });

  it('should call \'onSelect\' when \'View this version\' icon button was clicked', async () => {
    renderVersionCard();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })));

    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should call \'onSelect\' when version card title was clicked', async () => {
    renderVersionCard();

    await act(async () => user.click(screen.getAllByTestId('version-card-title-button')[0]));

    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should mark latest version history card', () => {
    renderVersionCard({ isLatest: true });

    expect(screen.getByText('stripes-acq-components.versionHistory.card.version.current')).toBeInTheDocument();
  });
});
