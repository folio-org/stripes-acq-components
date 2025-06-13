import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import FormFooter from './FormFooter';

const renderComponent = (props = {}) => render(
  <FormFooter
    pristine={false}
    submitting={false}
    onCancel={() => { }}
    handleSubmit={() => { }}
    {...props}
  />,
);

describe('FormFooter', () => {
  it('should display filter label', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.FormFooter.cancel')).toBeInTheDocument();
  });
});
