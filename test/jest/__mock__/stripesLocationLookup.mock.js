import React from 'react';

jest.mock('@folio/stripes-smart-components/lib/LocationLookup/LocationLookup', () => {
  return () => <div>LocationLookup</div>;
});
