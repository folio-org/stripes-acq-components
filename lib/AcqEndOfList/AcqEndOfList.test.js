import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import AcqEndOfList from './AcqEndOfList';

const EOL_LABEL = 'Icon';

const renderAcqEndOfList = (props = {}) => (render(
  <AcqEndOfList
    {...props}
  />,
));

describe('AcqEndOfList', () => {
  it('should not display eol label without totalCount', () => {
    renderAcqEndOfList();
    expect(screen.queryByText(EOL_LABEL)).not.toBeInTheDocument();
  });

  it('should display eol label with totalCount > 0', () => {
    renderAcqEndOfList({ totalCount: 1 });
    expect(screen.getByText(EOL_LABEL)).toBeInTheDocument();
  });

  it('should display eol label with totalCount > 0 and padding bottom', () => {
    renderAcqEndOfList({ noPaddingBottom: false, totalCount: 1 });
    expect(screen.getByText(EOL_LABEL)).toBeInTheDocument();
  });
});
