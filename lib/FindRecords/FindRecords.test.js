import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';
import { noop } from 'lodash';

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

describe('FindRecord', () => {
  mockOffsetSize(500, 500);

  beforeEach(() => {
    useLocalStorage.mockClear().mockReturnValue([true]);
  });

  it('should display open plugin modal with loading', () => {
    renderComponent({ isLoading: true });
    user.click(screen.getByText('open modal'));

    expect(screen.getByText('stripes-smart-components.sas.noResults.loading')).toBeDefined();
  });

  it('should display open plugin modal', () => {
    renderComponent({ isLoading: false });
    user.click(screen.getByText('open modal'));

    expect(screen.getByText('modal label')).toBeDefined();
  });

  it('should call back with select thing multiple select', () => {
    const selectRecords = jest.fn();
    const records = [{ name: 'name 1', status: 'status 1', id: '1' }];
    const getRecordLabel = jest.fn();

    renderComponent({ getRecordLabel, isMultiSelect: true, selectRecords, records, isLoading: false });
    user.click(screen.getByText('open modal'));
    user.click(screen.getByLabelText('stripes-acq-components.modal.selectItem'));
    user.click(screen.getByText('stripes-acq-components.button.save'));

    expect(selectRecords).toHaveBeenCalledWith([{
      ...records[0],
      rowIndex: 0,
    }]);
    expect(getRecordLabel).toHaveBeenCalled();
  });

  it('should call back validation fn with select thing multiple select', () => {
    const validateSelectedRecords = jest.fn();
    const records = [{ name: 'name 1', status: 'status 1', id: '1' }];

    renderComponent({ isMultiSelect: true, records, validateSelectedRecords });
    user.click(screen.getByText('open modal'));
    user.click(screen.getByLabelText('stripes-acq-components.modal.selectAll'));
    user.click(screen.getByLabelText('stripes-acq-components.modal.selectItemDefault'));
    user.click(screen.getByLabelText('stripes-acq-components.modal.selectItemDefault'));
    user.click(screen.getByText('stripes-acq-components.button.save'));

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
