import { pickBy, noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Checkbox,
  Modal,
  MultiColumnList,
  Paneset,
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
  PrevNextPagination,
} from '../AcqList';
import { useRecordsSelect } from './hooks';

import css from './FindRecordsModal.css';

export const FindRecordsModal = ({
  // modal config props
  closeModal,
  ariaLabel,
  modalLabel,
  modalRef,
  renderNewBtn,
  idPrefix,
  preventNonSelectedSubmit,
  // table config props
  columnMapping,
  columnWidths,
  getRecordLabel,
  isMultiSelect,
  pagination,
  resultsFormatter,
  resultsPaneTitle,
  sortableColumns,
  stickyFirstColumn,
  visibleColumns,
  // search and filter props
  searchableIndexes,
  renderActionMenu,
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
            disabled={preventNonSelectedSubmit && !selectedRecordsLength}
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

  const renderResultsList = (specificProps) => (
    <MultiColumnList
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
      visibleColumns={builtVisibleColumns}
      sortOrder={sortingField}
      sortDirection={sortingDirection || undefined}
      onHeaderClick={changeSorting}
      loading={isLoading}
      isEmptyMessage={resultsStatusMessage}
      stickyFirstColumn={stickyFirstColumn}
      {...specificProps}
    />
  );

  const resultsContent = !pagination
    ? renderResultsList({ autosize: true, virtualize: true })
    : ({ height, width }) => (
      <>
        {renderResultsList({
          pagingType: 'none',
          height: height - PrevNextPagination.HEIGHT,
          width,
        })}

        {(totalCount > 0) && (
          <PrevNextPagination
            {...pagination}
            totalCount={totalCount}
            disabled={isLoading}
            onChange={onNeedMoreData}
          />
        )}
      </>
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
        data-testid="find-records"
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
            autosize={!!pagination}
            title={resultsPaneTitle}
            count={totalCount}
            toggleFiltersPane={toggleFilters}
            filters={filters}
            isFiltersOpened={isFiltersOpened}
            renderActionMenu={renderActionMenu}
          >
            {resultsContent}
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
  preventNonSelectedSubmit: PropTypes.bool,
  // table config props
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  getRecordLabel: PropTypes.func,
  isMultiSelect: PropTypes.bool,
  pagination: PropTypes.shape({ limit: PropTypes.number, offset: PropTypes.number }),
  resultsFormatter: PropTypes.object,
  resultsPaneTitle: PropTypes.node.isRequired,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  stickyFirstColumn: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  // search and filter props
  searchableIndexes: PropTypes.arrayOf(PropTypes.object),
  renderActionMenu: PropTypes.func,
  renderFilters: PropTypes.func,
  initialFilters: PropTypes.object,
  // records props
  isLoading: PropTypes.bool,
  onNeedMoreData: PropTypes.func,
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
  columnWidths: { isChecked: '34px' },
  resultsFormatter: {},
  isMultiSelect: false,
  resetData: noop,
  preventNonSelectedSubmit: true,
};
