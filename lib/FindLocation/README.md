# FindLocation

`<FindLocation>` is a lookup that looks and behaves similarly to usual plugins, designed for advanced location search with filtering capabilities. In the context of ECS for the central tenant, it allows searching across multiple tenants with which the current user is affiliated.

## Props

Name | Type | Description | Required | Default
--- | --- | --- | --- | ---
`crossTenant` | `boolean` | Requirement to search for locations among all tenants affiliated with the current user (in central tenant only). Activates the "Affiliations" select for the central tenant of the consortium. | `false` | `false`
`disabled` | `boolean` | If the prop is `true` disable lookup trigger. | `false` | `false`
`id` | `string` | Identifier of the lookup trigger | `true` | -
`initialSelected` | `InitialLocation[]`** | An array of objects with information about the initially selected locations. | `false` | `[]`
`marginBottom0` | `boolean` | Remove bottom margin for the lookup trigger | `false` | `false`
`onClose` | `() => void` | If this callback is passed as a prop, it will be invoked when the lookup modal window is closed. | `false` | -
`onRecordsSelect` | `(records: LocationRecord[]) => void` | A callback triggered as a result of selecting location(s) in the lookup. | `true` | -
`renderTrigger`* | `(props: RenderTriggerProps) => Element`** | Used for rendering the lookup trigger. | `false` | -
`searchButtonStyle`* | `string` | Style of the lookup trigger button. | `false` | -
`searchLabel`* | `string` | Label for the lookup trigger button. | `false` | -
`tenantId` | `string` | The initial tenant ID where the location search should take place. | `false` | -
`triggerless` | `boolean` | A flag determining whether the lookup should open by clicking on the trigger or when the lookup component itself is rendered. | `false` | `false`

`*` - Applicable with `triggerless` === `false`.

`**`:
```
interface RenderTriggerProps {
  buttonRef: React.MutableRefObject,
  onClick: () => void,
}

interface InitialLocation {
  id: string,
  tenantId?: string,
}
```
___

## Usage

```
import { FindLocation } from '@folio/stripes-acq-components';

const assignedLocations = [
  { id: '10410d50-8d48-43d0-afa9-6f80423d08c8', tenantId: 'central' },
  { id: '3b1fa87c-f207-4a0e-a996-488aa4fa7868', tenantId: 'central' },
  { id: 'cdf02605-db9b-405b-9e2c-70d194cb31d1', tenantId: 'member' },
]

const onRecordsSelect = (locations) => {
  <!-- Logic to handle selected locations -->
  console.log(locations)
}

<FindLocation
  id="find-locations-lookup"
  isMultiSelect
  searchLabel={<FormattedMessage id="ui-module.findLocations.trigger.label" />}
  initialSelected={assignedLocations}
  onRecordsSelect={onRecordsSelect}
  crossTenant
/>
```