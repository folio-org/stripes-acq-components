import { Form } from 'react-final-form';

import { render, screen } from '@testing-library/react';

import { IfFieldVisible } from './IfFieldVisible';

const visibleText = 'Visible';

const renderComponent = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <IfFieldVisible
        {...props}
      />
    )}
  />,
);

describe('IfFieldVisible', () => {
  it('should render child component', () => {
    renderComponent({ children: <span>{visibleText}</span>, name: 'fieldName' });

    expect(screen.queryByText(visibleText)).toBeVisible();
  });

  it('should hide child component', () => {
    renderComponent({ children: <span>{visibleText}</span>, visible: false, name: 'fieldName' });

    expect(screen.queryByText(visibleText)).not.toBeVisible();
  });
});
