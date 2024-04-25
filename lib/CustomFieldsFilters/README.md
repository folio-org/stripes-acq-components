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

# useCustomFieldsSearchableIndexes

A hook that returns an array with searchable indexes for the provided custom fields. Searchable custom fields are of
type `TEXTBOX_LONG`, `TEXTBOX_SHORT` or `DATE_PICKER`. The result can be used as part of the `searchableIndexes` prop of
the [`<SingleSearchForm>`](../AcqList/SingleSearchForm/SingleSearchForm.js) component.

# utils/getCustomFieldsKeywordIndexes

Returns an array with searchable custom fields for the provided custom fields. Searchable custom fields are of type
`TEXTBOX_LONG`, `TEXTBOX_SHORT` or `DATE_PICKER`. The result can be used to construct search queries.

# utils/getCustomFieldsFilterMap

Returns an object that maps custom fields to a specific query function. This is done for custom fields of type
`MULTI_SELECT_DROPDOWN` and `DATE_PICKER`. The result can be used to construct search queries.

