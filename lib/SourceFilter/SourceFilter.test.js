import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import SourceFilter from './SourceFilter';

const renderComponent = (props = {}) => render(
  <SourceFilter
    name="source-filter"
    onChange={() => { }}
    {...props}
  />,
);

describe('SourceFilter', () => {
  it('should display filter label', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.label.sourceFilter')).toBeInTheDocument();
  });
});
