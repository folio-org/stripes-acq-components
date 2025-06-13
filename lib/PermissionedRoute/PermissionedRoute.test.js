import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

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

    expect(getByText('Test page')).toBeInTheDocument();
  });
});
