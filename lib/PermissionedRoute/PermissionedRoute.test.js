import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import PermissionedRoute from './PermissionedRoute';

const renderPermissionedRoute = () => (render(
  <MemoryRouter>
    <PermissionedRoute
      perm="test.perm"
      returnLinkLabelId="test.labelId"
      returnLink="/test"
    >
      <div>Test page</div>
    </PermissionedRoute>
  </MemoryRouter>,
));

describe('Given PermissionedRoute component', () => {
  it('Than it should display passed children', () => {
    const { getByText } = renderPermissionedRoute();

    expect(getByText('Test page')).toBeDefined();
  });
});
