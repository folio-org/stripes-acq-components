import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import pickBy from 'lodash/pickBy';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Button,
  Checkbox,
  Icon,
  Modal,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import Filters from './Filters';

import css from './PluginFindRecordModal.css';

const RESULTS_HEADER = <FormattedMessage id="stripes-acq-components.modal.resultsHeader" />;

const reduceCheckedRecords = (records, isChecked = false) => {
  const recordsReducer = (accumulator, record) => {
    if (isChecked) {
      accumulator[record.id] = record;
    }

    return accumulator;
  };

  return records.reduce(recordsReducer, {});
};

class PluginFindRecordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
      checkedMap: {},
      isAllChecked: false,
    };
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderResultsFirstMenu(filters) {
    const { filterPaneIsVisible } = this.state;

    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible
      ? 'stripes-smart-components.hideSearchPane'
      : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage
          id="stripes-smart-components.numberOfFilters"
          values={{ count: filterCount }}
        >
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage} \n\n${appliedFiltersMessage}`}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  saveMultiple = () => {
    const { validateSelectedRecords, onSaveMultiple, closeModal } = this.props;
    const selectedRecords = Object.values(pickBy(this.state.checkedMap));

    if (validateSelectedRecords) {
      closeModal();
      validateSelectedRecords(selectedRecords);
    } else onSaveMultiple(selectedRecords);
  };

  toggleAll = () => {
    this.setState((state, props) => {
      const isAllChecked = !state.isAllChecked;
      const { data: { records } } = props;
      const checkedMap = reduceCheckedRecords(records, isAllChecked);

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  toggleRecord = toggledRecord => {
    const { id } = toggledRecord;

    this.setState((state, props) => {
      const { data: { records } } = props;
      const wasChecked = Boolean(state.checkedMap[id]);
      const checkedMap = { ...state.checkedMap };

      if (wasChecked) {
        delete checkedMap[id];
      } else {
        checkedMap[id] = toggledRecord;
      }
      const isAllChecked = records.every(record => Boolean(checkedMap[record.id]));

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  isSelected = ({ item }) => Boolean(this.state.checkedMap[item.id]);

  render() {
    const {
      ariaLabel,
      closeModal,
      columnMapping,
      columnWidths,
      data,
      filterConfig,
      idPrefix,
      initialFilterState,
      initialSearch,
      isMultiSelect,
      maxSortKeys,
      modalLabel,
      modalRef,
      onComponentWillUnmount,
      onNeedMoreData,
      onSelectRow,
      queryGetter,
      querySetter,
      renderFilters,
      renderNewBtn,
      resultsFormatter,
      source,
      visibleColumns,
      sortableColumns = visibleColumns,
      getRecordLabel,
      intl,
      onSearchChange,
    } = this.props;
    const { checkedMap, isAllChecked } = this.state;

    const { records } = data;
    const checkedRecordsLength = Object.keys(checkedMap).length;
    const builtVisibleColumns = isMultiSelect ? ['isChecked', ...visibleColumns] : visibleColumns;

    const query = queryGetter ? queryGetter() || {} : {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';
    const resultsStatusMessage = source
      ? (
        <div data-test-find-records-no-results-message>
          <NoResultsMessage
            data-test-find-records-no-results-message
            filterPaneIsVisible
            searchTerm={query.query || ''}
            source={source}
            toggleFilterPane={noop}
          />
        </div>
      )
      : <FormattedMessage id="stripes-acq-components.modal.noSourceYet" />;

    let resultPaneSub = <FormattedMessage id="stripes-smart-components.searchCriteria" />;

    if (source && source.loaded()) {
      resultPaneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    const mixedResultsFormatter = {
      isChecked: record => {
        const label = getRecordLabel
          ? intl.formatMessage({ id: 'stripes-acq-components.modal.selectItem' }, { value: getRecordLabel(record) })
          : intl.formatMessage({ id: 'stripes-acq-components.modal.selectItemDefault' }, { value: record.rowIndex });

        return (
          <Checkbox
            type="checkbox"
            checked={Boolean(checkedMap[record.id])}
            onChange={() => this.toggleRecord(record)}
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
                values={{ count: checkedRecordsLength }}
              />
            </div>
            <Button
              buttonStyle="primary"
              data-test-find-records-modal-save
              disabled={!checkedRecordsLength}
              marginBottom0
              onClick={this.saveMultiple}
            >
              <FormattedMessage id="stripes-acq-components.button.save" />
            </Button>
          </>
        )}
      </div>
    );

    return (
      <Modal
        ariaLabel={ariaLabel}
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
          {renderNewBtn()}
        </div>
        <div
          data-test-find-records
          className={isMultiSelect ? css.showButtonsBar : ''}
        >
          <SearchAndSortQuery
            initialFilterState={initialFilterState}
            initialSearch={initialSearch}
            initialSearchState={{ qindex: '', query: '' }}
            maxSortKeys={maxSortKeys}
            onComponentWillUnmount={onComponentWillUnmount}
            queryGetter={queryGetter}
            querySetter={querySetter}
            sortableColumns={sortableColumns}
            syncToLocationSearch={false}
          >
            {
              ({
                activeFilters,
                filterChanged,
                getFilterHandlers,
                getSearchHandlers,
                onSort,
                onSubmitSearch,
                resetAll,
                searchChanged,
                searchValue,
              }) => {
                return (
                  <Paneset id={`${idPrefix}-paneset`} isRoot>
                    {this.state.filterPaneIsVisible && (
                      <Pane
                        defaultWidth="22%"
                        paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                      >
                        <form onSubmit={onSubmitSearch}>
                          <div className={css.searchGroupWrap}>
                            <SearchField
                              ariaLabel={intl.formatMessage({ id: 'stripes-acq-components.search' })}
                              autoFocus
                              className={css.searchField}
                              data-test-plugin-search-input
                              marginBottom0
                              name="query"
                              onChange={(e) => {
                                onSearchChange(e.target.value);
                                getSearchHandlers().query(e);
                              }}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                            <Button
                              buttonStyle="primary"
                              data-test-plugin-search-submit
                              disabled={(!searchValue.query || searchValue.query === '')}
                              fullWidth
                              marginBottom0
                              type="submit"
                            >
                              <FormattedMessage id="stripes-smart-components.search" />
                            </Button>
                          </div>
                          <div className={css.resetButtonWrap}>
                            <Button
                              buttonStyle="none"
                              disabled={!(filterChanged || searchChanged)}
                              fullWidth
                              id="clickable-reset-all"
                              onClick={() => {
                                onSearchChange('');
                                resetAll();
                              }}
                            >
                              <Icon icon="times-circle-solid">
                                <FormattedMessage id="stripes-smart-components.resetAll" />
                              </Icon>
                            </Button>
                          </div>
                          {renderFilters
                            ? renderFilters(activeFilters.state, getFilterHandlers())
                            : (
                              <Filters
                                activeFilters={activeFilters}
                                config={filterConfig}
                                onChangeHandlers={getFilterHandlers()}
                              />
                            )}
                        </form>
                      </Pane>
                    )}
                    <Pane
                      defaultWidth="fill"
                      firstMenu={this.renderResultsFirstMenu(activeFilters)}
                      padContent={false}
                      paneSub={resultPaneSub}
                      paneTitle={RESULTS_HEADER}
                    >
                      <MultiColumnList
                        autosize
                        columnMapping={{
                          isChecked: (
                            <FormattedMessage id="stripes-acq-components.modal.selectAll">
                              {label => (
                                <Checkbox
                                  aria-label={label}
                                  checked={isAllChecked}
                                  data-test-find-records-modal-select-all
                                  onChange={this.toggleAll}
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
                        isEmptyMessage={resultsStatusMessage}
                        isSelected={this.isSelected}
                        onHeaderClick={onSort}
                        onNeedMoreData={onNeedMoreData}
                        onRowClick={isMultiSelect ? undefined : onSelectRow}
                        sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                        sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                        totalCount={count}
                        virtualize
                        visibleColumns={builtVisibleColumns}
                      />
                    </Pane>
                  </Paneset>
                );
              }
            }
          </SearchAndSortQuery>
        </div>
      </Modal>
    );
  }
}

PluginFindRecordModal.propTypes = {
  ariaLabel: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  data: PropTypes.object,
  filterConfig: PropTypes.arrayOf(PropTypes.object),
  idPrefix: PropTypes.string.isRequired,
  initialFilterState: PropTypes.object,
  initialSearch: PropTypes.string,
  isMultiSelect: PropTypes.bool.isRequired,
  maxSortKeys: PropTypes.number,
  modalLabel: PropTypes.node,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onComponentWillUnmount: PropTypes.func,
  onNeedMoreData: PropTypes.func,
  onSaveMultiple: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  renderFilters: PropTypes.func,
  renderNewBtn: PropTypes.func,
  resultsFormatter: PropTypes.object,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  source: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  validateSelectedRecords: PropTypes.func,
  getRecordLabel: PropTypes.func,
  intl: PropTypes.object.isRequired,
  onSearchChange: PropTypes.func,
};

PluginFindRecordModal.defaultProps = {
  columnMapping: {},
  columnWidths: {},
  data: {},
  filterConfig: [],
  initialSearch: '',
  modalLabel: '',
  onSaveMultiple: noop,
  renderNewBtn: noop,
  onSearchChange: noop,
  resultsFormatter: {},
};

export default injectIntl(PluginFindRecordModal);
