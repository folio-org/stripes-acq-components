import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { orderAuditEvent } from 'fixtures';
import { getVersionWrappedFormatter } from '../../getVersionWrappedFormatter';
import { VersionViewContextProvider } from '../../VersionViewContext';
import { useVersionWrappedFormatter } from './useVersionWrappedFormatter';

jest.mock('../../getVersionWrappedFormatter', () => ({
  getVersionWrappedFormatter: jest.fn(() => ({ foo: jest.fn() })),
}));

const fieldsMapping = { foo: 'name' };
const baseFormatter = { foo: ({ name }) => name };
const mockFormatter = {};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <VersionViewContextProvider
    versions={[orderAuditEvent]}
    snapshotPath="orderSnapshot"
  >
    {children}
  </VersionViewContextProvider>
);

describe('useVersionWrappedFormatter', () => {
  beforeEach(() => {
    getVersionWrappedFormatter.mockReturnValue(mockFormatter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return base formatter when component is not wrapped by VersionViewContext', async () => {
    const name = 'field.name';
    const { result } = renderHook(
      () => useVersionWrappedFormatter({ baseFormatter, name, fieldsMapping }),
    );

    expect(result.current).toBe(baseFormatter);
  });

  it('should return version wrapped formatter', async () => {
    const name = 'field.name';
    const { result } = renderHook(
      () => useVersionWrappedFormatter({ baseFormatter, name, fieldsMapping }),
      { wrapper },
    );

    expect(result.current).toBe(mockFormatter);
  });
});
