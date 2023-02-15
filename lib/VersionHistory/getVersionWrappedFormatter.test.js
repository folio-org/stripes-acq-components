import { render, screen } from '@testing-library/react';

import { MultiColumnList } from '@folio/stripes/components';

import { FIELD_CHANGE_TYPES } from '../utils';
import { getVersionWrappedFormatter } from './getVersionWrappedFormatter';

const changes = [
  { type: FIELD_CHANGE_TYPES.update, path: 'fieldOne[0].name' },
  { type: FIELD_CHANGE_TYPES.create, path: 'fieldOne[1].name' },
  { type: FIELD_CHANGE_TYPES.update, path: 'field.two[0].foo' },
];

const paths = changes.map(({ path }) => path);

const COLUMNS = { foo: 'foo' };
const baseFormatter = { [COLUMNS.foo]: jest.fn(({ name }) => name) };
const columnMapping = { [COLUMNS.foo]: 'Column head text' };
const fieldsMapping = { foo: 'name' };
const visibleColumns = [COLUMNS.foo];

const contentData = [
  { name: 'FooCell' },
  { name: 'BarCell' },
  { name: 'BazCell' },
];

const renderMCL = (props = {}) => render(
  <MultiColumnList
    contentData={contentData}
    columnMapping={columnMapping}
    visibleColumns={visibleColumns}
    {...props}
  />,
);

describe('getVersionWrappedFormatter', () => {
  it('should call original formatter\'s handlers to mark updated cells in the current version', () => {
    const name = 'fieldOne';
    const formatter = getVersionWrappedFormatter({
      baseFormatter,
      paths,
      fieldsMapping,
      name,
    });

    renderMCL({ formatter });

    Object.values(baseFormatter).forEach((handler) => {
      expect(handler).toHaveBeenCalled();
    });

    expect(screen.getByText(contentData[0].name).tagName.toLowerCase()).toEqual('mark');
    expect(screen.getByText(contentData[1].name).tagName.toLowerCase()).toEqual('mark');
    expect(screen.getByText(contentData[2].name).tagName.toLowerCase()).not.toEqual('mark');
  });
});
