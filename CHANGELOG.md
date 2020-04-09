# Change history for stripes-acq-components

## (IN PROGRESS)

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
