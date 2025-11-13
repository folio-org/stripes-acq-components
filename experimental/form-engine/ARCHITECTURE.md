## Architecture

This form engine is built around a small core with injectable services and feature modules. The goals are clarity, testability, and performance.

### High-level design
- **FormEngine**: Coordinates everything; exposes an ergonomic API for React bindings and consumers.
- **Services (Injected)**
  - ValidationService: validates fields/form with debouncing and mode control
  - CacheService: caches values and form state; clears selectively on updates
  - EventService: pub/sub with optional context cleanup and error handling
  - BatchService: batches multiple updates with rAF or timeouts
- **Features**
  - ValuesFeature: current and initial values; immutable updates
  - ErrorsFeature: field errors map and helpers
  - TouchedFeature: tracks touched fields
  - ActiveFeature: currently focused field
  - SubmittingFeature: submitting and submitSucceeded flags
  - DirtyFeature: dirty/pristine detection per strategy

### Key principles
- Single source of truth in FormEngine; React hooks subscribe to events.
- Immutable updates with minimal re-computation.
- Selective subscriptions to avoid unnecessary re-renders.
- WeakMap-based caching to prevent leaks and speed repeated lookups.
- Explicit service boundaries; each service can be mocked independently.

### Events
- Form-level: INIT, RESET, CHANGE, VALUES, ERROR, VALIDATION, SUBMIT, CONFIG_UPDATE
- Field-level: `${CHANGE}:${path}`, `${ERROR}:${path}`, `${ERRORS}:${path}`
- Event handlers are wrapped with optional error handling and context tracking for safe cleanup.
- **Bubble support**: Listeners can subscribe with `{ bubble: true }` to receive events from nested field changes
  - Example: `engine.on('change:orders', callback, null, { bubble: true })` fires when `orders[0].amount` changes
  - Used by `useWatch(name, { bubble: true })` for efficient array/object watching
  - Only emits to bubble listeners when nested fields change (optimization via `hasListener(event, { onlyBubble: true })`)

### Dirty detection
- Strategies:
  - VALUES (default): deep or custom equality between current and initial values
  - TOUCHED (legacy): derived from touched fields
- `DirtyFeature` keeps the last known dirty state per field in a Map to compute summaries quickly.

### Validation
- Modes: `change`, `blur`, `submit`
- Debouncing supported per field via ValidationService; form-level validator is registered for `$form`.
- On submit: validate all, touch fields with errors, emit SUBMIT with result details.

### Navigation guard
- `FormNavigationGuard` uses `useFormState` for `dirty`, `submitting`, `submitSucceeded`, blocks `history` navigation, and shows `FormNavigationModal`.
- Optional `cachePreviousUrl` enables integration with `LastVisitedContext` from stripes-core (wired in the `Form` component).


