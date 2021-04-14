import React from 'react';
import { render, screen } from '@testing-library/react';

import KeyValueInline from './KeyValueInline';

const renderComponent = (props = {}) => (render(
  <KeyValueInline
    {...props}
  />,
));

describe('KeyValueInline', () => {
  it('should display label and value', () => {
    renderComponent({ label: 'testlabel', value: 'testvalue' });
    expect(screen.getByText('testvalue')).toBeDefined();
    expect(screen.getByText('testlabel')).toBeDefined();
  });
});
