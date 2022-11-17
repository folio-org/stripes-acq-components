# Change history for stripes-acq-components

## [3.3.1](https://github.com/folio-org/stripes-acq-components/tree/v3.3.1) (2022-11-18)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.3.0...v3.3.1)

* Add handlers for search field and reset all button in `PluginFindRecordModal` component. Refs UISACQCOMP-124.
* Selection dropdown search textbox doesn't allow use of parentheses characters. Refs UISACQCOMP-125.

## [3.3.0](https://github.com/folio-org/stripes-acq-components/tree/v3.3.0) (2022-10-18)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.2.4...v3.3.0)

* Add a common Drag-n-Drop MCL component. Refs UISACQCOMP-105.
* Move reusable utils and constants from `ui-invoice` to `stripes-acq-components` lib. Refs UISACQCOMP-110.
* Support MCL Next/Previous pagination by plugins. Refs UISACQCOMP-116.
* Support placeholder for searchable indexes on search form. Refs UISACQCOMP-121.

## [3.2.4](https://github.com/folio-org/stripes-acq-components/tree/v3.2.4) (2022-08-25)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.2.3...v3.2.4)

* Selecting a new search index automatically kicks off a new search. Refs UISACQCOMP-118.

## [3.2.3](https://github.com/folio-org/stripes-acq-components/tree/v3.2.3) (2022-08-19)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.2.2...v3.2.3)

* Fund distribution validation issue on form saving. Refs UINV-432.

## [3.2.2](https://github.com/folio-org/stripes-acq-components/tree/v3.2.2) (2022-08-08)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.2.1...v3.2.2)

* PO/L does not save/open when deviating from the default electronic inventory interactions. Refs UISACQCOMP-113.
* Filtering for tags not working if tag contains forward slash. Refs UISACQCOMP-114.

## [3.2.1](https://github.com/folio-org/stripes-acq-components/tree/v3.2.1) (2022-07-27)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.2.0...v3.2.1)

* Add support for fund distribution total backend validation. Refs UISACQCOMP-111.

## [3.2.0](https://github.com/folio-org/stripes-acq-components/tree/v3.2.0) (2022-07-07)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.1.1...v3.2.0)

* Display only active funds in Fund Distribution drop-down. Refs UISACQCOMP-83.
* Move Fund and Expense class filters to stripes-acq-components for common usage. Refs UISACQCOMP-84.
* Results List pane should announce results count change. Refs UISACQCOMP-89.
* Create Number range filter. Refs UISACQCOMP-88.
* Remove react-hot-loader. Refs UISACQCOMP-92.
* Move common functions and constants for CSVExport to stripes-acq-component. Refs UISACQCOMP-93.
* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UISACQCOMP-95.
* Prevent accordion from closing if its fields contain validation errors. Refs UISACQCOMP-96.
* Add common modal component for delete abandoned holdings operation. Refs UISACQCOMP-97.
* stripes-acq-components: module warnings analysis. Refs UISACQCOMP-98.
* Hyperlink current encumbrance amount in Fund distribution. Refs UISACQCOMP-101.
* Add new component for dynamic data loading and filtering. Refs UISACQCOMP-103.
* Create common component `OptimisticLockingBanner`. Refs UISACQCOMP-104.
* Remove encumbrance when fund is changed. Refs UISACQCOMP-106.

## [3.1.1](https://github.com/folio-org/stripes-acq-components/tree/v3.1.1) (2022-03-24)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.1.0...v3.1.1)

* Unable to type in filter select list input. Refs UISACQCOMP-90.

## [3.1.0](https://github.com/folio-org/stripes-acq-components/tree/v3.1.0) (2022-02-28)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.0.2...v3.1.0)

* Use final-form "Field" component in "FieldHoldingLocation". Refs UISACQCOMP-64.
* Add resources to interact with Acquisition methods API. Refs UISACQCOMP-62.
* Rename collection field name for Acquisition method. Refs UISACQCOMP-66.
* Remove duplicates from keyboard shortcuts modal list. Refs UISACQCOMP-69.
* Leverage useIntegrationConfigs hook from ui-organizations. Refs UISACQCOMP-71.
* Leverage useOrganization hook from ui-organizations. Refs UISACQCOMP-72.
* FindRecords implementation. Refs UISACQCOMP-70.
* 'Server address' validation not clear. Refs UISACQCOMP-75.
* Add initial filters for FindRecords. Refs UISACQCOMP-74.
* Search normalization to handle trailing space. Refs UISACQCOMP-76.
* Update acquisitions unit filter to allow filtering on no acquisitions unit. Refs UISACQCOMP-77.
* timezone support in FolioFormattedDate. Refs UISACQCOMP-78.
* useFocusPane hook. Refs UISACQCOMP-79.
* Add common components to use input filter and action menu filters. Refs UISACQCOMP-80.
* Accessibility issue for some filter accordions (Ensures landmarks are unique). Refs UISACQCOMP-82.

## [3.0.2](https://github.com/folio-org/stripes-acq-components/tree/v3.0.2) (2021-12-09)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.0.1...v3.0.2)

* POL Title selection overwriting Order template location. Refs UISACQCOMP-65.

## [3.0.1](https://github.com/folio-org/stripes-acq-components/tree/v3.0.1) (2021-11-02)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v3.0.0...v3.0.1)

* Display "Invalid reference" when Holdings ID is not valid. UISACQCOMP-59.
* Display "Invalid reference" when vendor is not valid. UISACQCOMP-61.

## [3.0.0](https://github.com/folio-org/stripes-acq-components/tree/v3.0.0) (2021-10-04)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.4.3...v3.0.0)

* Support trigerless mode for lookup plugins. Refs UISACQCOMP-35.
* Component to handle holdings and locations. Refs UISACQCOMP-40.
* Use mod-orders for piece queries. Refs UISACQCOMP-46.
* The order is saved with empty fields under the "Vendor" accordion. Refs UISACQCOMP-45.
* In AcqDateRangeFilter propagate `...rest` props to DateRangeFilter. Refs UISACQCOMP-48.
* Select should display defined form value in non-interactive mode. Refs UISACQCOMP-49.
* increment stripes to v7. Refs UISACQCOMP-50.
* Display order line locations on piece form. Refs UISACQCOMP-53.
* Ability to use scroll position of MCL row. Refs UISACQCOMP-54.
* Implement MCL Next/Previous pagination. Refs UISACQCOMP-55.
* Add default label for "Acquisition unit" filter. Refs UISACQCOMP-56.
* Can no longer create POL with Price of 0. Refs UISACQCOMP-57.

## [2.4.3](https://github.com/folio-org/stripes-acq-components/tree/v2.4.3) (2021-07-30)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.4.2...v2.4.3)

* POL lookup by vendor ref number for invoice line is not working. UISACQCOMP-42.

## [2.4.2](https://github.com/folio-org/stripes-acq-components/tree/v2.4.2) (2021-07-29)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.4.1...v2.4.2)

* Invoice level Fund Distribution not showing amount. Refs UISACQCOMP-41.

## [2.4.1](https://github.com/folio-org/stripes-acq-components/tree/v2.4.1) (2021-07-21)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.4.0...v2.4.1)

* Expense classes are not in alpha order on POL create/edit screen. Refs UISACQCOMP-33.
* Search error in acquisition unit component on PO. Refs UISACQCOMP-34.
* Cannot allocate or transfer cents as system considers them negative numbers. Refs UISACQCOMP-36.
* Date range filters in Orders and Circulation log does not honor tenant locale. Refs UISACQCOMP-37.
* Expense class from order template not applied to POL. Refs UISACQCOMP-39.

## [2.4.0](https://github.com/folio-org/stripes-acq-components/tree/v2.4.0) (2021-06-16)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.3.3...v2.4.0)

* Resizable Panes. Refs UISACQCOMP-24.
* Acquisition units restrictions hook. Refs UISACQCOMP-27.
* support batchFetch in react-query. Refs UISACQCOMP-30.
* Create common command list for Keyboard shortcut Modal. Refs UISACQCOMP-32.
* Compile Translation Files into AST Format. Refs UISACQCOMP-25.
* Create HTML template for Printing order. Refs UISACQCOMP-26.

## [2.3.3](https://github.com/folio-org/stripes-acq-components/tree/v2.3.3) (2021-04-22)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.3.2...v2.3.3)

* Fix onCancel prop for FormFooter. Refs UISACQCOMP-28.

## [2.3.2](https://github.com/folio-org/stripes-acq-components/tree/v2.3.2) (2021-04-13)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.3.1...v2.3.2)

* Check the date picker in orders and invoices. Fix displaying dates in UTC0. Refs UISACQCOMP-23.

## [2.3.1](https://github.com/folio-org/stripes-acq-components/tree/v2.3.1) (2021-04-07)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.3.0...v2.3.1)

* Add Ongoing to the POL filters. Refs UIOR-688.
* Fix Cannot split funds on a PO with an odd number of pennies as the cost. Refs UISACQCOMP-17
* Attaching file to invoice doesn't work properly when user clicks Choose file Refs UISACQCOMP-22.

## [2.3.0](https://github.com/folio-org/stripes-acq-components/tree/v2.3.0) (2021-03-15)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.2.3...v2.3.0)

* Fix Orders and Order lines grids initially display "No results found. Please check your filters." rather than "Loading...". Refs UIOR-657.
* Fix onBlur prop for FieldDatepicker (RFF). Refs UIF-289.
* Centralizing country and language data in stripes components. Refs UISACQCOMP-18.
* Add Extended Info accordion to Invoice View screen. Refs UINV-222.
* Make POL vendor reference number and type repeatable, paired fields. Refs UIOR-519, UINV-165.
* Add positive number validation. Refs UIF-280
* Reformat dates to match date format across FOLIO (based on selected locale). Refs UISACQCOMP-16
* Set exchange rate manually for purchase order line. Refs UIOR-610.
* Prevent user from applying Funds from other acquisitions units for encumbrance or payment. Refs UIOR-618
* Update format date and format time. Refs UIOR-645.
* Fix Accessibility problems for PluginFindRecordModal Component. UISACQCOMP-9
* bump stripes v6. UIOR-650
* Call change org on clear field. UINV-169
* Fix all select lists with dynamic required prop. UIF-274
* Change CQL query `=` to `==`. Refs UICIRCLOG-33.
* Add personal data disclosure form. Refs UISACQCOMP-13.
* Make global __mocks__ be used in submodules
* Propagate ...rest props in TextFilter to TextField
* Add actionMenu prop to ResultsPane. Refs UIOR-631.
* Update invoice CRUD permissions. Refs UINV-199.
* Reformat dates to match date format across FOLIO. UISACQCOMP-15.

## [2.2.3](https://github.com/folio-org/stripes-acq-components/tree/v2.2.3) (2020-11-18)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.2.2...v2.2.3)

* Unable to view PO Line when accessing via Agreements app. Refs UISACQCOMP-10

## [2.2.2](https://github.com/folio-org/stripes-acq-components/tree/v2.2.2) (2020-11-10)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.2.1...v2.2.2)

* Fix Invoice date filters are off set by timezone somehow. Refs UINV-202
* Filter selection cursor highlights (focus) are persisted and distracting for the user. Refs UISACQCOMP-7
* Migrate Organization and Contact Forms to React-final-form. Refs UIORGS-200.

## [2.2.1](https://github.com/folio-org/stripes-acq-components/tree/v2.2.1) (2020-10-29)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.2.0...v2.2.1)

* Add aria-label to select item checkbox. Refs UIPFINT-14.
* Focus resultsPaneTitleRef after data response has come in AcqList. Refs UIORGS-208
* Filtering not working on Receiving. Refs UIREC-101

## [2.2.0](https://github.com/folio-org/stripes-acq-components/tree/v2.2.0) (2020-10-09)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.1.2...v2.2.0)

* fix tags with caps. Refs MODORDERS-433
* separate coverage dir for Jest
* Allow user to use multiple expense class from same fund on one invoice line or POL. Refs UIF-253
* Wrappers for control components to provide non-interactive mode and tooltip. Refs UIOR-607
* Display disabled `FieldSelect` as `KeyValue`. Refs UIF-251
* Provide non-interact mode to some components. Refs UIOR-606
* Add mocks and display `AmountWithCurrencyField` as `NoValue` if no value is provided. Refs UIF-251
* Display AcqUnits as `NoValue` if no units selected. Refs UIORGS-201
* Fix `Datepicker` clears value for redux-form. Refs UINV-181
* Update fund distribution UX. Refs UIF-245
* Leverage code for client-side sorting, `FrontendSortingMCL`. Refs UINV-178
* Leverage common Notes route components. Refs UIORGS-184
* Add URL validation. Refs UIOR-556
* Customize column names for sorting. Refs UIORGS-197
* Move payment status constant. Refs UINV-173
* Select expense class for Order & Invoice Fund distribution. Refs UIF-213
* add `showBrackets` prop in `AmountWithCurrencyField` to show amount in brackets for negative values
* `AcqEndOfList` component for manual use of EoL marker from stripes-component.
* `useList` component with leveraged common logic for list pages. Refs UIOR-586
* respect `disabled` prop in filter component. Refs UIOR-586
* `TextFilter` component. Refs UICIRCLOG-4
* `react-intl` jest mock. Refs UICIRCLOG-17

### Stories
* [UIOR-586](https://issues.folio.org/browse/UIOR-586) Update subheading of the Orders landing page Search results pane
* [UIOR-561](https://issues.folio.org/browse/UIOR-561) Migrate to react-final-form
* [UINV-161](https://issues.folio.org/browse/UINV-161) Alert user when adding pol to invoice that has a different currency or vendor that the invoice
* [UIOR-417](https://issues.folio.org/browse/UIOR-417) useLocalStorageFilters hook

### Bug fixes
* [UIORGS-164](https://issues.folio.org/browse/UIORGS-164) Accessibility Error: Form elements must have labels
* [UISACQCOMP-2](https://issues.folio.org/browse/UISACQCOMP-2) ACQ - CurrencySelect values are not translated
* [UIORGS-157](https://issues.folio.org/browse/UIORGS-157) Accessibility error: IDs of active elements must be unique
* [UIOR-524](https://issues.folio.org/browse/UIOR-524) Accessibility Error: Form elements must have labels
* [UIOR-523](https://issues.folio.org/browse/UIOR-523) Accessibility Error: Buttons must have discernible text
* [UIOR-522](https://issues.folio.org/browse/UIOR-522) Accessibility Error: ARIA attributes must conform to valid values
* [UIORGS-173](https://issues.folio.org/browse/UIORGS-173) Accessibility Error: Added aria-label for "Select all"-checkbox in the find record modal

## [2.1.2](https://github.com/folio-org/stripes-acq-components/tree/v2.1.2) (2020-06-12)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.1.1...v2.1.2)

* fix multiselect interactor;

## [2.1.1](https://github.com/folio-org/stripes-acq-components/tree/v2.1.1) (2020-06-11)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.1.0...v2.1.1)

* remove `okapiInterfaces` from `stripes`;

## [2.1.0](https://github.com/folio-org/stripes-acq-components/tree/v2.1.0) (2020-06-11)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.0.4...v2.1.0)

### Stories
* [UIOR-530](https://issues.folio.org/browse/UIOR-530) Improve Select location dropdown to use only select Location plugin
* [UIREC-90](https://issues.folio.org/browse/UIREC-90) Update select location workflow for Piece creation/edit
* [UIREC-47](https://issues.folio.org/browse/UIREC-47) Create/lookup instance from receiving Title when not using instance lookup
* [UIORGS-78](https://issues.folio.org/browse/UIORGS-78) pass `id` to `AcqUnitsField`
* [UIOR-564](https://issues.folio.org/browse/UIOR-564) pass initialFilterState prop to S&SQ
* [UIORGS-178](https://issues.folio.org/browse/UIORGS-178) Redirect API calls from mod-organizations-storage to
* [UIOR-444](https://issues.folio.org/browse/UIOR-444) common constants for Piece, BigTest config
* Update to stripes v4
* [UIREC-42](https://issues.folio.org/browse/UIREC-42) Filter Titles by piece status and Acq unit
* [UIF-202](https://issues.folio.org/browse/UIF-202) Add default sorting param to AcqList
* [UINV-123](https://issues.folio.org/browse/UINV-123) Add "Export to accounting" toggle to Adjustments
* [UINV-138](https://issues.folio.org/browse/UINV-138) Align actions icons in table to right hand side of view pane(s)

### Bug fixes
* [UIORGS-177](https://issues.folio.org/browse/UIORGS-177) add validation to not allow spaces
* [UIORGS-151](https://issues.folio.org/browse/UIORGS-151) Organizations is not using the same Expand/Collapse as implemented in Q4 2019

## [2.0.4](https://github.com/folio-org/stripes-acq-components/tree/v2.0.4) (2020-04-09)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.0.3...v2.0.4)

### Stories
* [UIOR-516](https://issues.folio.org/browse/UIOR-516) PluggableUserFilter component

## [2.0.3](https://github.com/folio-org/stripes-acq-components/tree/v2.0.3) (2020-04-06)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.0.2...v2.0.3)

* `ResultStatusMessage` component to show query status in the Results pane of AcqList

### Bug fixes
* [UINV-127](https://issues.folio.org/browse/UINV-127) Accessibility Error: Form elements must have labels
* [UIF-190](https://issues.folio.org/browse/UIF-190) pass query params to extend

## [2.0.2](https://github.com/folio-org/stripes-acq-components/tree/v2.0.2) (2020-03-27)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v2.0.1...v2.0.2)

### Bug fixes
* [UIORGS-155](https://issues.folio.org/browse/UIORGS-155) Country codes are handled inconsistently in organization vs. contact addresses
* [UIREC-67](https://issues.folio.org/browse/UIREC-67) Add ModalFooter with right buttons alignment
* [UIREC-66](https://issues.folio.org/browse/UIREC-66) POL details displaying under Title information accordion
* [UIREC-59](https://issues.folio.org/browse/UIREC-59) Improve Select location dropdown to use only select Location plugin

## [2.0.1](https://github.com/folio-org/stripes-acq-components/tree/v2.0.1) (2020-03-13)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v1.3.2...v2.0.1)

* bump the @folio/stripes peer to v3.0.0

### Stories
* [UINV-60](https://issues.folio.org/browse/UINV-60) Improve Location filter on the Titles list to use location look-up
* [UINV-124](https://issues.folio.org/browse/UINV-124) FieldOrganization component
* [UINV-118](https://issues.folio.org/browse/UINV-118) AcqList buildDateRangeQuery util
* [UIOR-358](https://issues.folio.org/browse/UIOR-358) OrganizationValue component
* [UIOR-472](https://issues.folio.org/browse/UIOR-472) Display encumbered value on POL for orders made in currency other than system currency
* [UIORGS-112](https://issues.folio.org/browse/UIORGS-112) disable sorting on checkboxes, pass sortable columns
* [UIREC-32](https://issues.folio.org/browse/UIREC-32) Add piece for a title
* [UIREC-28](https://issues.folio.org/browse/UIREC-28) Add Title for receiving/check-in
* [UIREC-27](https://issues.folio.org/browse/UIREC-27) View title in receiving area

### Bug Fixes
* [UIORGS-147](https://issues.folio.org/browse/UIORGS-147) Country filter not working

## [1.3.2](https://github.com/folio-org/stripes-acq-components/tree/v1.3.2) (2019-12-18)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v1.3.1...v1.3.2)

### Bug Fixes
* [UIOR-478](https://issues.folio.org/browse/UIOR-478) Invoices from the previous order is shown
* [UIOR-460](https://issues.folio.org/browse/UIOR-460) Capture cost information and fund distributions in the currency selected at POL

## [1.3.1](https://github.com/folio-org/stripes-acq-components/tree/v1.3.1) (2019-12-12)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v1.3.0...v1.3.1)

### Stories
* [UIORGS-122](https://issues.folio.org/browse/UIORGS-122) Organization view pane: Update contact people view

### Bug Fixes
* [UIOR-464](https://issues.folio.org/browse/UIOR-464) Calculation of estimated price in cost details sometimes blocks POLs from being created/saved
* [UIPFPOL-3](https://issues.folio.org/browse/UIPFPOL-3) Return focus after lookup modal is closed without selection
* [ERM-620](https://issues.folio.org/browse/ERM-620) Agreement edit/new: return focus to the lookup button when a lookup modal is closed
* [UINV-94](https://issues.folio.org/browse/UINV-94) Not able to create invoice lines with $0 subtotal

## [1.3.0](https://github.com/folio-org/stripes-acq-components/tree/v1.3.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v1.2.0...v1.3.0)

### Stories
* [UIF-101](https://issues.folio.org/browse/UIF-101) FolioFormattedTime component to display datetime fields
* [UIF-79](https://issues.folio.org/browse/UIF-79) FieldTags common component
* [UIF-96](https://issues.folio.org/browse/UIF-96) Acq list components and utils
* [UIOR-365](https://issues.folio.org/browse/UIOR-365) Support isDeleted property of Acq units
* [UIOR-5](https://issues.folio.org/browse/UIOR-5) Tags components
* [UIOR-370](https://issues.folio.org/browse/UIOR-370) FundDistributionField component updates, CurrencySymbol component
* [UIOR-377](https://issues.folio.org/browse/UIOR-377) batchFetch util
* [UIOR-275](https://issues.folio.org/browse/UIOR-275) AcqTagsFilter component
* [UIOR-425](https://issues.folio.org/browse/UIOR-425) FundDistributionView component updates
* [UIF-34](https://issues.folio.org/browse/UIF-34) react-final-form components
* [UIF-98](https://issues.folio.org/browse/UIF-98) showCallout util
* [UINV-87](https://issues.folio.org/browse/UINV-87) multiple distributions for the same Fund validation
* [UINV-41](https://issues.folio.org/browse/UINV-87) unit tests with Jest

### Bug Fixes
* [UIOR-356](https://issues.folio.org/browse/UIOR-356) Options for select in alphabetic order
* [UIORGS-84](https://issues.folio.org/browse/UIORGS-84) Add translatable payment methods options

## [1.2.0](https://github.com/folio-org/stripes-acq-components/tree/v1.2.0) (2019-09-11)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v1.1.0...v1.2.0)

### Stories
* [UIF-85](https://issues.folio.org/browse/UIF-85) Create LoadingPane common component
* [UIF-92](https://issues.folio.org/browse/UIF-92) Add hook for accordion toggle
* [UINV-56](https://issues.folio.org/browse/UINV-56) common test utils
* [UINV-57](https://issues.folio.org/browse/UINV-57) Add fund distributions to invoice lines
* [UINV-62](https://issues.folio.org/browse/UINV-62) hooks for callout and modal toggle
* [UIOR-367](https://issues.folio.org/browse/UIOR-367) add common function to generate query
* [UIORGS-87](https://issues.folio.org/browse/UIORGS-87) PluginFindRecord component

### Bug Fixes
* [UIOR-349](https://issues.folio.org/browse/UIOR-349) find-po-line plugin cannot search at all

## [1.1.0](https://github.com/folio-org/stripes-acq-components/tree/v1.1.0) (2019-08-26)
[Full Changelog](https://github.com/folio-org/stripes-acq-components/compare/v1.0.0...v1.1.0)

### Stories
* [UIORGS-74](https://issues.folio.org/browse/UIORGS-74) toast with html
* [UIORGS-71](https://issues.folio.org/browse/UIORGS-71) added `FieldAutoSuggest` component
* [UIOR-300](https://issues.folio.org/browse/UIOR-300) acquisition units component
* [UINV-15](https://issues.folio.org/browse/UINV-15) file uploader / download base64
* [UINV-14](https://issues.folio.org/browse/UINV-14) `FieldSelect` component
* [UIAC-8](https://issues.folio.org/browse/UIAC-8) `AcqUnitsView` component

## [1.0.0](https://github.com/folio-org/stripes-acq-components/tree/v1.0.0) (2019-07-19)

* leveraged some common components, used in Acquisitions modules.
