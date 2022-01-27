import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { pickBy } from 'lodash';

import {
  Button,
  Modal,
  Paneset,
  MultiColumnList,
  Checkbox,
} from '@folio/stripes/components';

import {
  NoResultsMessage,
  FiltersPane,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useFilters,
  useFiltersToogle,
  useSorting,
  getFiltersCount,
} from '../AcqList';

import {
  useRecordsSelect,
} from './hooks';

import css from './FindRecordsModal.css';

export const FindRecordsModal = ({
  // modal config props
  closeModal,
  ariaLabel,
  modalLabel,
  modalRef,
  renderNewBtn,
  idPrefix,
  // table config props
  columnMapping,
  columnWidths,
  getRecordLabel,
  isMultiSelect,
  resultsFormatter,
  resultsPaneTitle,
  sortableColumns,
  visibleColumns,
  // search and filter props
  searchableIndexes,
  renderFilters,
  initialFilters,
  // records props
  isLoading,
  onNeedMoreData,
  onSaveMultiple,
  onSelectRow,
  records,
  refreshRecords,
  resetData,
  totalCount,
  validateSelectedRecords,
}) => {
  const intl = useIntl();

  const {
    allRecordsSelected,
    selectedRecordsMap,
    selectedRecordsLength,
    toggleSelectAll,
    selectRecord,
    isRecordSelected,
  } = useRecordsSelect({ records });

  const { isFiltersOpened, toggleFilters } = useFiltersToogle(`${idPrefix}/plugin/filters`);
  const {
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeSearchIndex,
    searchIndex,
  } = useFilters(resetData, initialFilters);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(resetData, sortableColumns);

  useEffect(() => {
    refreshRecords({
      ...filters,
      sorting: sortingField,
      sortingDirection,
    });
  }, [refreshRecords, filters, sortingField, sortingDirection]);

  const saveMultiple = () => {
    const selectedRecords = Object.values(pickBy(selectedRecordsMap));

    if (validateSelectedRecords) {
      closeModal();
      validateSelectedRecords(selectedRecords);
    } else onSaveMultiple(selectedRecords);
  };

  const builtVisibleColumns = isMultiSelect ? ['isChecked', ...visibleColumns] : visibleColumns;
  const mixedResultsFormatter = {
    isChecked: record => {
      const label = getRecordLabel
        ? intl.formatMessage({ id: 'stripes-acq-components.modal.selectItem' }, { value: getRecordLabel(record) })
        : intl.formatMessage({ id: 'stripes-acq-components.modal.selectItemDefault' }, { value: record.rowIndex });

      return (
        <Checkbox
          type="checkbox"
          checked={Boolean(selectedRecordsMap[record.id])}
          onChange={() => selectRecord(record)}
          aria-label={label}
        />
      );
    },
    ...resultsFormatter,
  };

  const footer = (
    <div className={css.pluginModalFooter}>
      <Button
        marginBottom0
        onClick={closeModal}
        className="left"
      >
        <FormattedMessage id="stripes-acq-components.button.close" />
      </Button>
      {isMultiSelect && (
        <>
          <div>
            <FormattedMessage
              id="stripes-acq-components.modal.totalSelected"
              values={{ count: selectedRecordsLength }}
            />
          </div>
          <Button
            buttonStyle="primary"
            data-test-find-records-modal-save
            disabled={!selectedRecordsLength}
            marginBottom0
            onClick={saveMultiple}
          >
            <FormattedMessage id="stripes-acq-components.button.save" />
          </Button>
        </>
      )}
    </div>
  );

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <Modal
      aria-label={ariaLabel}
      contentClass={css.pluginModalContent}
      data-test-find-records-modal
      dismissible
      enforceFocus={false}
      footer={footer}
      label={modalLabel}
      onClose={closeModal}
      open
      ref={modalRef || React.createRef()}
      size="large"
      style={{ minHeight: '500px' }}
    >
      <div className={css.pluginModalNewBtnWrapper}>
        {Boolean(renderNewBtn) && renderNewBtn()}
      </div>

      <div
        data-test-find-records
        className={isMultiSelect ? css.showButtonsBar : ''}
      >
        <Paneset id={`${idPrefix}-paneset`} isRoot>
          {
            isFiltersOpened && (
              <FiltersPane
                toggleFilters={toggleFilters}
                width="22%"
              >
                <SingleSearchForm
                  applySearch={applySearch}
                  changeSearch={changeSearch}
                  searchQuery={searchQuery}
                  searchableIndexes={searchableIndexes}
                  changeSearchIndex={changeSearchIndex}
                  selectedIndex={searchIndex}
                  isLoading={isLoading}
                  ariaLabelId="stripes-acq-components.search"
                />

                <ResetButton
                  id="reset-find-records-filters"
                  reset={resetFilters}
                  disabled={!getFiltersCount(filters)}
                />

                {renderFilters && renderFilters(filters, applyFilters)}
              </FiltersPane>
            )
          }

          <ResultsPane
            title={resultsPaneTitle}
            count={totalCount}
            toggleFiltersPane={toggleFilters}
            filters={filters}
            isFiltersOpened={isFiltersOpened}
          >
            <MultiColumnList
              autosize
              columnMapping={{
                isChecked: (
                  <FormattedMessage id="stripes-acq-components.modal.selectAll">
                    {label => (
                      <Checkbox
                        aria-label={label}
                        checked={allRecordsSelected}
                        data-test-find-records-modal-select-all
                        onChange={toggleSelectAll}
                        type="checkbox"
                      />
                    )}
                  </FormattedMessage>
                ),
                ...columnMapping,

              }}
              columnWidths={columnWidths}
              contentData={records}
              formatter={mixedResultsFormatter}
              id="list-plugin-find-records"
              isSelected={isRecordSelected}
              onNeedMoreData={onNeedMoreData}
              onRowClick={isMultiSelect ? undefined : onSelectRow}
              totalCount={totalCount}
              virtualize
              visibleColumns={builtVisibleColumns}
              sortOrder={sortingField}
              sortDirection={sortingDirection || undefined}
              onHeaderClick={changeSorting}
              loading={isLoading}
              isEmptyMessage={resultsStatusMessage}
            />
          </ResultsPane>
        </Paneset>
      </div>
    </Modal>
  );
};

FindRecordsModal.propTypes = {
  // modal config props
  ariaLabel: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  idPrefix: PropTypes.string.isRequired,
  modalLabel: PropTypes.node,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  renderNewBtn: PropTypes.func,
  // table config props
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  getRecordLabel: PropTypes.func,
  isMultiSelect: PropTypes.bool,
  resultsFormatter: PropTypes.object,
  resultsPaneTitle: PropTypes.node.isRequired,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  // search and filter props
  searchableIndexes: PropTypes.arrayOf(PropTypes.object),
  renderFilters: PropTypes.func,
  initialFilters: PropTypes.object,
  // records props
  isLoading: PropTypes.bool,
  onNeedMoreData: PropTypes.func.isRequired,
  onSaveMultiple: PropTypes.func,
  onSelectRow: PropTypes.func,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshRecords: PropTypes.func.isRequired,
  resetData: PropTypes.func,
  totalCount: PropTypes.number.isRequired,
  validateSelectedRecords: PropTypes.func,
};

FindRecordsModal.defaultProps = {
  columnMapping: {},
  columnWidths: {},
  resultsFormatter: {},
  isMultiSelect: false,
  resetData: () => {},
};
