import { useLocalStorage } from '@rehooks/local-storage';
import noop from 'lodash/noop';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { mockOffsetSize } from '../../test/jest/helpers/mockOffsetSize';
import { FindRecords } from './FindRecords';

const renderComponent = ({
  getRecordLabel,
  isMultiSelect = false,
  records = [],
  renderNewBtn,
  selectRecordsCb,
  validateSelectedRecords,
  trigerless,
  isLoading,
  selectRecords = noop,
  refreshRecords = noop,
  onNeedMoreData = noop,
}) => render(
  <Router>
    <FindRecords
      searchLabel="open modal"
      resultsPaneTitle="Results"
      selectRecordsCb={selectRecordsCb}
      trigerless={trigerless}
      getRecordLabel={getRecordLabel}
      isMultiSelect={isMultiSelect}
      renderNewBtn={renderNewBtn}
      validateSelectedRecords={validateSelectedRecords}
      records={records}
      totalCount={records.length}
      visibleColumns={['status', 'name']}
      idPrefix="uiPluginPrefix"
      modalLabel="modal label"
      columnMapping={{
        status: 'status',
        name: 'name',
      }}
      isLoading={isLoading}
      selectRecords={selectRecords}
      refreshRecords={refreshRecords}
      onNeedMoreData={onNeedMoreData}
    />
  </Router>,
);

describe('FindRecords', () => {
  mockOffsetSize(500, 500);

  beforeEach(() => {
    useLocalStorage.mockReturnValue([true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display open plugin modal with loading', async () => {
    renderComponent({ isLoading: true });

    await userEvent.click(screen.getByText('open modal'));

    expect(screen.getByTestId('find-records').querySelector('[class="mclContentLoading"]')).toBeDefined();
  });

  it('should display open plugin modal', async () => {
    renderComponent({ isLoading: false });

    await userEvent.click(screen.getByText('open modal'));

    expect(screen.getByText('modal label')).toBeDefined();
  });

  it('should call back with select thing multiple select', async () => {
    const selectRecords = jest.fn();
    const records = [{ name: 'name 1', status: 'status 1', id: '1' }];
    const getRecordLabel = jest.fn();

    renderComponent({ getRecordLabel, isMultiSelect: true, selectRecords, records, isLoading: false });

    await userEvent.click(screen.getByText('open modal'));
    await userEvent.click(screen.getByLabelText('stripes-acq-components.modal.selectItem'));
    await userEvent.click(screen.getByText('stripes-acq-components.button.save'));

    expect(selectRecords).toHaveBeenCalledWith([{
      ...records[0],
      rowIndex: 0,
    }]);
    expect(getRecordLabel).toHaveBeenCalled();
  });

  it('should call back validation fn with select thing multiple select', async () => {
    const validateSelectedRecords = jest.fn();
    const records = [{ name: 'name 1', status: 'status 1', id: '1' }];

    renderComponent({ isMultiSelect: true, records, validateSelectedRecords });

    await userEvent.click(screen.getByText('open modal'));
    await userEvent.click(screen.getByLabelText('stripes-acq-components.modal.selectAll'));
    await userEvent.click(screen.getByLabelText('stripes-acq-components.modal.selectItemDefault'));
    await userEvent.click(screen.getByLabelText('stripes-acq-components.modal.selectItemDefault'));
    await userEvent.click(screen.getByText('stripes-acq-components.button.save'));

    expect(validateSelectedRecords).toHaveBeenCalledWith([{
      ...records[0],
      rowIndex: 0,
    }]);
  });

  describe('trigerless mode', () => {
    it('should not display open trigger button', () => {
      renderComponent({ trigerless: true });

      expect(screen.queryByText('open modal')).toBeNull();
    });

    it('should display opened modal by default', () => {
      renderComponent({ trigerless: true });

      expect(screen.getByText('modal label')).toBeDefined();
    });
  });
});
