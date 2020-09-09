import React from 'react';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: Component => ({ mutator, ...rest }) => {
    const fakeMutator = mutator || Object.keys(Component.manifest).reduce((acc, mutatorName) => {
      acc[mutatorName] = {
        GET: jest.fn(),
        PUT: jest.fn(),
        POST: jest.fn(),
        DELETE: jest.fn(),
        reset: jest.fn(),
      };

      return acc;
    }, {});

    return <Component {...rest} mutator={fakeMutator} />;
  },

  // eslint-disable-next-line react/prop-types
  Pluggable: props => <>{props.children}</>,
}), { virtual: true });
