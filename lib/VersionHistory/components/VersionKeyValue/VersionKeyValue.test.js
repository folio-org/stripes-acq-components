import {
  render,
  screen,
} from '@testing-library/react';

import { VersionViewContext } from '../../VersionViewContext';
import { VersionKeyValue } from './VersionKeyValue';

const defaultProps = {
  label: 'Test Label',
  value: 'Test Value',
  name: 'testName',
};

const renderComponent = (props = {}, contextValue = {}) => {
  return render(
    <VersionViewContext.Provider value={contextValue}>
      <VersionKeyValue
        {...defaultProps}
        {...props}
      />
    </VersionViewContext.Provider>,
  );
};

describe('VersionKeyValue', () => {
  it('should render label and value', () => {
    renderComponent();

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should render NoValue when value is not provided', () => {
    renderComponent({ value: undefined });

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('stripes-components.noValue.noValueSet')).toBeInTheDocument();
  });

  it('should highlight updated value', () => {
    renderComponent({ name: 'testName' }, { paths: ['testName'] });

    expect(screen.getByText('Test Value').closest('mark')).toBeInTheDocument();
  });

  it('should not highlight non-updated value', () => {
    renderComponent({}, { paths: ['anotherName'] });

    expect(screen.getByText('Test Value').closest('mark')).not.toBeInTheDocument();
  });

  it('should highlight updated value for multiple fields', () => {
    renderComponent({ multiple: true }, { paths: ['testName[0]'] });

    expect(screen.getByText('Test Value').closest('mark')).toBeInTheDocument();
  });

  it('should not highlight non-updated value for multiple fields', () => {
    renderComponent({ multiple: true }, { paths: ['anotherName[0]'] });

    expect(screen.getByText('Test Value').closest('mark')).not.toBeInTheDocument();
  });
});
