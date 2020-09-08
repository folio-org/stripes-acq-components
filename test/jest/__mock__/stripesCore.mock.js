import React from 'react';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: Component => props => <Component {...props} />,

  // eslint-disable-next-line react/prop-types
  Pluggable: props => <>{props.children}</>,
}), { virtual: true });
