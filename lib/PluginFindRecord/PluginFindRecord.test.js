import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import { mockOffsetSize } from '../../test/jest/helpers/mockOffsetSize';
import PluginFindRecord from './PluginFindRecord';
import PluginFindRecordModal from './PluginFindRecordModal';

const ComponentContainer = ({ children, onNeedMoreData, records, source, queryGetter, querySetter }) => {
  return children({
    columnMapping: {
      status: 'status',
      name: 'name',
    },
    // filterConfig,
    idPrefix: 'uiPluginPrefix',
    modalLabel: 'modal label',
    onNeedMoreData,
    queryGetter,
    querySetter,
    // resultsFormatter,
    source,
    visibleColumns: ['status', 'name'],
    data: {
      records,
    },
  });
};

const renderComponent = ({
  getRecordLabel,
  isMultiSelect = false,
  records,
  renderNewBtn,
  selectRecordsCb,
  source,
  validateSelectedRecords,
  trigerless,
}) => render(
  <Router>
    <PluginFindRecord
      searchLabel="open modal"
      selectRecordsCb={selectRecordsCb}
      trigerless={trigerless}
    >
      {(modalProps) => (
        <ComponentContainer
          records={records}
          source={source}
        >
          {(viewProps) => (
            <PluginFindRecordModal
              {...viewProps}
              {...modalProps}
              getRecordLabel={getRecordLabel}
              isMultiSelect={isMultiSelect}
              renderNewBtn={renderNewBtn}
              validateSelectedRecords={validateSelectedRecords}
            />
          )}
        </ComponentContainer>
      )}
    </PluginFindRecord>
  </Router>,
);

describe('PluginFindRecord', () => {
  mockOffsetSize(500, 500);

  it('should display open plugin modal with loading', () => {
    const source = {
      failure: () => false,
      pending: () => true,
      loaded: () => false,
      totalCount: () => 0,
    };

    renderComponent({ source });
    user.click(screen.getByText('open modal'));

    expect(screen.getByText('stripes-smart-components.sas.noResults.loading')).toBeDefined();
  });

  it('should display open plugin modal with failure', () => {
    const source = {
      failure: () => true,
      failureMessage: () => 'failure',
      pending: () => false,
      loaded: () => true,
      totalCount: () => 0,
    };

    renderComponent({ source });
    user.click(screen.getByText('open modal'));

    expect(screen.getByText('failure')).toBeDefined();
  });

  it('should display open plugin modal', () => {
    const source = {
      failure: () => false,
      loaded: () => true,
      pending: () => false,
      totalCount: () => 0,
    };

    renderComponent({ source });
    user.click(screen.getByText('open modal'));

    expect(screen.getByText('modal label')).toBeDefined();
  });

  it('should call back with select thing multiple select', () => {
    const selectRecordsCb = jest.fn();
    const records = [{ name: 'name 1', status: 'status 1', id: '1' }];
    const source = {
      loaded: () => true,
      totalCount: () => 1,
    };
    const getRecordLabel = jest.fn();

    renderComponent({ getRecordLabel, isMultiSelect: true, selectRecordsCb, records, source });
    user.click(screen.getByText('open modal'));
    user.click(screen.getByLabelText('stripes-acq-components.modal.selectItem'));
    user.click(screen.getByText('stripes-acq-components.button.save'));

    expect(selectRecordsCb).toHaveBeenCalledWith([{
      ...records[0],
      rowIndex: 0,
    }]);
    expect(getRecordLabel).toHaveBeenCalled();
  });

  it('should call back validation fn with select thing multiple select', () => {
    const validateSelectedRecords = jest.fn();
    const records = [{ name: 'name 1', status: 'status 1', id: '1' }];
    const source = {
      loaded: () => true,
      totalCount: () => 1,
    };

    renderComponent({ isMultiSelect: true, records, source, validateSelectedRecords });
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
      const source = {
        loaded: () => true,
        pending: () => false,
        failure: () => false,
        totalCount: () => 1,
      };

      renderComponent({ source, trigerless: true });

      expect(screen.queryByText('open modal')).toBeNull();
    });

    it('should display opened modal by default', () => {
      const source = {
        loaded: () => true,
        pending: () => false,
        failure: () => false,
        totalCount: () => 1,
      };

      renderComponent({ source, trigerless: true });

      expect(screen.getByText('modal label')).toBeDefined();
    });
  });
});
