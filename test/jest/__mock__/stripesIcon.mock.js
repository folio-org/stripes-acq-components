import React from 'react';

jest.mock('@folio/stripes-components/lib/Icon', () => {
  return (props) => <span data-testid={props?.['data-testid']}>Icon</span>;
});
