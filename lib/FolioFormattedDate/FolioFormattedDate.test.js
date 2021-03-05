import React from 'react';
import { render, screen } from '@testing-library/react';

import FolioFormattedDate from './FolioFormattedDate';

const renderComponent = (props = {}) => (render(
  <FolioFormattedDate
    {...props}
  />,
));

describe('FolioFormattedDate', () => {
  it('should display NoValue component', () => {
    renderComponent();
    expect(screen.getByText('-')).toBeDefined();
  });

  it('should display passed date', () => {
    renderComponent({ value: '2021-03-04T12:39:30.446+00:00' });
    expect(screen.getByText('2021-03-04')).toBeDefined();
  });
});
