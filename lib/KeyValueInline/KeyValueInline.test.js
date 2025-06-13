import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import KeyValueInline from './KeyValueInline';

const renderComponent = (props = {}) => (render(
  <KeyValueInline
    {...props}
  />,
));

describe('KeyValueInline', () => {
  it('should display label and value', () => {
    renderComponent({ label: 'testlabel', value: 'testvalue' });

    expect(screen.getByText(': testvalue')).toBeInTheDocument();
    expect(screen.getByText('testlabel')).toBeInTheDocument();
  });
});
