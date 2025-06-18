import { render } from '@folio/jest-config-stripes/testing-library/react';

import ModalFooter from './ModalFooter';

const renderModalFooter = () => render(
  <ModalFooter
    renderStart={(
      <div data-testid="cancelBtn" />
    )}
    renderEnd={(
      <div data-testid="submitBtn" />
    )}
  />,
);

describe('Given ModalFooter component', () => {
  it('Than it should display passed buttons', () => {
    const { getByTestId } = renderModalFooter();

    expect(getByTestId('cancelBtn')).toBeInTheDocument();
    expect(getByTestId('submitBtn')).toBeInTheDocument();
  });
});
