# CustomFieldsFilters

Renders a set of filter components based on the provided custom fields data.
Each filter component gets rendered inside a `<FilterAccordion>`. Depending on
the type of the custom field different filter components are rendered:

| Custom field type | Component
--- | ---
DATE_PICKER | `<AcqDateRangeFilter>`
MULTI_SELECT_DROPDOWN | `<MultiSelectionFilter>`
RADIO_BUTTON | `<CheckboxFilter>`
SINGLE_CHECKBOX | `<CheckboxFilter>`
SINGLE_SELECT_DROPDOWN | `<MultiSelectionFilter>`

## Usage example

Include `<CustomFieldsFilters>` to your filter section. See  [ui-orders](https://github.com/folio-org/ui-orders/blob/master/src/OrdersList/OrdersListFilters.js). 

```js
<AccordionSet>
  ...
  <CustomFieldsFilters
    activeFilters={activeFilters}
    customFields={customFields}
    onChange={onChange}
  />
  ...
</AccordionSet>
```


## Props

Name | Type | Description | Required
--- | --- | --- | ---
`activeFilters` | object | An object containing the active filter values. Each key corresponds to a specific custom field (e.g. `customFields.date1`) and the value represents the filter value for that field. | false
`closedByDefault` | bool | Determines whether the filter accordions are closed by default. | false
`customFields` | array | An array of custom field objects. | false
`disabled` | bool | Determines whether the filter components are disabled. | false
`onChange` | func | A callback function that is invoked when a filter value is changed. | true
