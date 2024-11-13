import {
  render,
  screen,
} from '@testing-library/react';

import { VersionViewContext } from '../../VersionViewContext';
import { VersionCheckbox } from './VersionCheckbox';

const defaultProps = {
  label: 'Test Label',
  name: 'testName',
};

const renderVersionCheckbox = (props = {}, contextValue = {}) => {
  return render(
    <VersionViewContext.Provider value={contextValue}>
      <VersionCheckbox
        {...defaultProps}
        {...props}
      />
    </VersionViewContext.Provider>,
  );
};

describe('VersionCheckbox', () => {
  it('renders with marked label when name is in context paths', () => {
    renderVersionCheckbox({}, { paths: ['testName'] });

    expect(screen.getByText('Test Label').closest('mark')).toBeInTheDocument();
  });

  it('renders with normal label when name is not in context paths', () => {
    renderVersionCheckbox({}, { paths: ['otherName'] });

    expect(screen.getByText('Test Label').closest('mark')).not.toBeInTheDocument();
  });
});
