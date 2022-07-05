import { fetchExportDataByIds } from './fetchExportDataByIds';

describe('fetchExportDataByIds', () => {
  it('should not call API if no ids passed', () => {
    const ky = { get: jest.fn() };

    fetchExportDataByIds({ ky, ids: [] });

    expect(ky.get).not.toHaveBeenCalled();
  });
});
