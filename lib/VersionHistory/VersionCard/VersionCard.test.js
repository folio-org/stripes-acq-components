import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display version history card', () => {
    renderVersionCard();

    defaultProps.changedFields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
    expect(screen.getByText(defaultProps.source)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('should call \'onSelect\' when \'View this version\' icon button was clicked', async () => {
    renderVersionCard();

    await act(async () => userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })));

    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should call \'onSelect\' when version card title was clicked', async () => {
    renderVersionCard();

    await act(async () => userEvent.click(screen.getAllByTestId('version-card-title-button')[0]));

    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should mark latest version history card', () => {
    renderVersionCard({ isLatest: true });

    expect(screen.getByText('stripes-acq-components.versionHistory.card.version.current')).toBeInTheDocument();
  });

  describe('Expand and Collapse changed fields list', () => {
    const changedFields = Array.from({ length: 15 }, (_, i) => `Changed field ${i + 1}`);

    it('should display "Show all" button if changed fields count exceeds collapsed items count', () => {
      renderVersionCard({ changedFields });

      expect(screen.getAllByText(/Changed field/)).toHaveLength(12); // Visible items
      expect(screen.getByText(/versionHistory.card.showAll/)).toBeInTheDocument();
    });

    it('should display "Show less" button if changed fields count exceeds collapsed items count', async () => {
      renderVersionCard({ changedFields });

      await userEvent.click(screen.getByText(/versionHistory.card.showAll/));

      expect(screen.getAllByText(/Changed field/)).toHaveLength(15);
      expect(screen.getByText(/versionHistory.card.showLess/)).toBeInTheDocument();
    });
  });
});
