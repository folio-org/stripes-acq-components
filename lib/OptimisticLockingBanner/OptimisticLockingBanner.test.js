import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';

import { ERROR_CODE_CONFLICT } from '../constants';
import OptimisticLockingBanner from './OptimisticLockingBanner';

const renderOptimisticLockingBanner = ({
  latestVersionLink = '/latestVersionLink',
  errorCode,
}) => (render(
  <OptimisticLockingBanner
    latestVersionLink={latestVersionLink}
    errorCode={errorCode}
  />,
  { wrapper: MemoryRouter },
));

describe('OptimisticLockingBanner', () => {
  it('should not display banner', () => {
    renderOptimisticLockingBanner({});

    expect(screen.queryByText('stripes-components.optimisticLocking.saveError')).toBeNull();
  });

  it('should display banner', () => {
    renderOptimisticLockingBanner({ errorCode: ERROR_CODE_CONFLICT });

    expect(screen.getAllByText('stripes-components.optimisticLocking.saveError')).toBeDefined();
  });
});
