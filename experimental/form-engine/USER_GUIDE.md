## User Guide

### Installation

This module lives under `@folio/stripes-acq-components/experimental/form-engine`.

### Architecture Overview

The form engine follows clean architecture principles:
- **KISS** - Simple, clear design
- **DRY** - No code duplication
- **SOLID** - Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion

**Key Components:**
- **FormEngine** - Core coordinator
- **Services** - SchedulerService, ValidationService, CacheService, EventService, BatchService
- **Features** - BaseFeature, ValuesFeature, ErrorsFeature, TouchedFeature, etc.
- **Factory** - FeatureFactory creates and manages features
- **Strategies** - ValidationErrorHandler with extensible error strategies
- **Utilities** - helpers.js, validationErrorHandler.js, path.js, checks.js

### Quick Start

```jsx
import { Form, Field } from '@folio/stripes-acq-components/experimental';

function MyForm() {
  return (
    <Form onSubmit={(values) => console.log(values)} initialValues={{ email: '' }}>
      <Field name="email" validate={(v) => (!v ? 'Required' : undefined)}>
        {({ input, meta }) => (
          <div>
            <input {...input} placeholder="Email" />
            {meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Form Props

- `onSubmit(values, api?)` - Async/sync submit handler
- `initialValues` - Object with initial form values
- `defaultValidateOn` - `'blur' | 'change'` default for fields
- `validate(allValues)` - Optional form-level validator (can return object or string)
- `formValidateOn` - `'submit' | 'blur' | 'change'` for form-level validator
- `debounceDelay` - Number, debouncing for change validations
- `dirtyCheckStrategy` - `DIRTY_CHECK_STRATEGY.VALUES | DIRTY_CHECK_STRATEGY.TOUCHED`
- `isEqual` - Custom equality function for VALUES strategy (e.g., lodash isEqual for deep comparison)
- `engine` - Custom `FormEngine` instance (optional, uses internal instance by default)
- `navigationCheck` - Boolean to enable navigation guard
- `navigationGuardProps` - Navigation guard configuration:
  - `history` - Required if `navigationCheck` is true
  - `message` - Confirmation message
  - `heading` - Modal heading
  - `confirmLabel` - Confirm button label
  - `cancelLabel` - Cancel button label
  - `ignorePaths` - Array of paths to ignore
  - `onBeforeBlock` - Callback before blocking
  - `onConfirm` - Callback on confirm
  - `onCancel` - Callback on cancel
  - `cachePreviousUrl` - Automatically provided via `LastVisitedContext` when available

### Field API

**Props:**
```jsx
<Field 
  name="fieldName"
  validate={(value, allValues) => string | undefined}
  validateOn="blur" | "change"
  debounceDelay={number}
  subscription={object}
>
  {({ input, meta }) => JSX}
</Field>
```

**Render Props:**
- `input` - Field input props:
  - `name` - Field name
  - `value` - Current value
  - `onChange` - Change handler
  - `onBlur` - Blur handler
  - `onFocus` - Focus handler
  
- `meta` - Field metadata:
  - `error` - First error message
  - `errors` - Array of all errors `[{ source: 'field'|'form', error: string }]`
  - `touched` - Whether field was touched
  - `active` - Whether field is focused
  - `dirty` - Whether value differs from initial
  - `pristine` - Whether value equals initial
  - `initial` - Initial value

- `subscription` - Select which parts of state to subscribe to for performance
  - Only re-renders when subscribed properties change
  - Example: `{ value: true, error: true }` only subscribes to value and error

**Error Handling:**

The form engine uses **ValidationErrorHandler with Strategy pattern** for flexible error handling:

1. **Field-level errors** - Set by field validators:
   ```jsx
   <Field 
     name="email" 
     validate={(value) => !value.includes('@') ? 'Invalid email' : undefined}
   />
   ```

2. **Form-level errors** - Set by form validator (can be object or string):
   ```jsx
   <Form
     validate={(values) => {
       // Return object for field-specific errors
       if (values.email?.endsWith('@banned.com')) {
         return { email: 'This domain is not allowed' };
       }
       // Return string for form-level error
       if (values.items?.length === 0) {
         return 'At least one item is required';
       }
       return null;
     }}
   />
   ```

3. **Error strategies** handle different formats automatically:
   - `NullErrorStrategy` - Null/undefined (no error)
   - `ObjectErrorStrategy` - `{ field: 'error' }` format
   - `ArrayErrorStrategy` - `['error1', 'error2']` format (logs warning)
   - `StringErrorStrategy` - `'error message'` format (form-level)

4. **Accessing errors**:
   - `meta.error` - First error message
   - `meta.errors` - All errors with sources: `[{ source: 'field'|'form', error: string }]`

5. **Error priority**:
   - Both field-level and form-level errors are stored
   - Form-level errors can overwrite field-level errors
   - Last write wins (no merging)

### Hooks

**useField(name, options)**

Register field in the form

```jsx
const { input, meta } = useField('email', {
  validate: (value) => !value ? 'Required' : undefined,
  validateOn: 'blur',
  debounceDelay: 300,
  subscription: { value: true, error: true },
});
```

**useFormState(subscription)**

Subscribe to form-level state.

```jsx
const formState = useFormState({
  values: true,      // All form values
  errors: true,      // All field errors
  touched: true,     // Touched fields
  active: true,      // Currently active field
  submitting: true,  // Submission in progress
  submitSucceeded: true, // Last submission succeeded
  dirty: true,       // Form has unsaved changes
  pristine: true,    // Form has no unsaved changes
  valid: true,       // All validations passed
});
```

**useWatch(name, options)**

Watch specific field with advanced features.

```jsx
// Basic watch
const email = useWatch('email');

// With selector (transform value)
const emailLength = useWatch('email', {
  selector: (value) => value?.length || 0,
});

// With bubble (receive nested field changes)
const orders = useWatch('orders', { bubble: true });
// Updates when orders[0].amount, orders[1].status, etc. change

// Combine selector and bubble
const orderCount = useWatch('orders', {
  selector: (arr) => arr?.length || 0,
  bubble: true,
});
```

**Bubble Behavior:**
- `bubble: false` (default) - Only updates when exact field changes
- `bubble: true` - Updates when any nested field changes
  - Example: `useWatch('foo', { bubble: true })` receives events from `foo[0].field`, `foo.bar`, etc.
  - Useful for watching arrays/objects and updating when ANY nested value changes
  - Performance optimized - only emits to bubble listeners when nested fields change

**useSubmit(onSubmit)**

Handle form submission.

```jsx
const handleSubmit = useSubmit(async (values) => {
  await api.save(values);
});

return <button onClick={handleSubmit}>Submit</button>;
```

### Engine API

**Creating Engine**

```js
import { FormEngine, SchedulerService, ValidationService } from '@folio/stripes-acq-components/experimental';

// Default engine (uses internal services)
const engine = new FormEngine();

// Custom engine with injected services
const engine = new FormEngine({
  schedulerService: new SchedulerService(),
  validationService: new ValidationService({ debounceDelay: 300 }),
  // ... other services
});

// Initialize form
engine.init({ email: '', name: '' }, { 
  validateOnBlur: true,
  dirtyCheckStrategy: DIRTY_CHECK_STRATEGY.VALUES,
});
```

**Core Methods**

```js
// Value management
engine.get(path);                    // Get field value
engine.set(path, value);             // Set field value
engine.setMany([{ path, value }]);   // Set multiple values
engine.getValues();                  // Get all values
engine.getInitialValues();           // Get initial values

// Error management
engine.getErrors();                  // Get all errors
engine.setError(path, error);        // Set field error
engine.clearError(path);             // Clear field error

// Validation
engine.validate();                // Validate all fields
engine.validateField(path);          // Validate specific field

// Submission
engine.submit(onSubmit);             // Submit form

// State queries
engine.getFormState();               // Get entire form state
engine.getFieldState(path);          // Get specific field state
engine.getDirtyFields();             // Get dirty fields map
engine.getDirtyFieldsList();         // Get dirty fields array

// Debug information
engine.getDebugInfo();               // Get debug info:
                                     // - dirtyStrategy
                                     // - dirtyFieldsCount
                                     // - dirtyFieldsList
                                     // - touchedCount
                                     // - submitting
                                     // - submitSucceeded
                                     // - etc.
```

**Event Subscription**

```js
// Subscribe to events
engine.on(event, callback, context, options);

// Direct field changes only
engine.on('change:email', (value) => console.log(value));

// Watch with bubble - receives nested field events
engine.on('change:orders', (orders) => {
  console.log('Orders changed:', orders);
}, null, { bubble: true });
// Fires when orders[0].amount, orders[1].status, etc. change

// Unsubscribe
const unsubscribe = engine.on('change', callback);
unsubscribe();
```

**Service Management**

```js
// Get service statistics
const stats = engine.getServiceStats();
// Returns: { validation, cache, event, batch }

// Replace services at runtime (advanced)
engine.setValidationService(customValidationService);
engine.setCacheService(customCacheService);
engine.setEventService(customEventService);
engine.setBatchService(customBatchService);
```

**Features Access**

```js
// Access internal features (advanced)
engine.valuesFeature.getInitialValues();
engine.errorsFeature.hasErrors();
engine.touchedFeature.getTouchedFields();
engine.dirtyFeature.getDirtyFields();
engine.submittingFeature.isSubmitting();
```

### Dirty Check Strategy

The form engine provides two strategies for determining if a form is dirty:

**VALUES Strategy (Default, Recommended)**

Compares current values with initial values using deep or custom equality.

```js
import { DIRTY_CHECK_STRATEGY } from '@folio/stripes-acq-components/experimental';

engine.init({ email: '', items: [] }, {
  dirtyCheckStrategy: DIRTY_CHECK_STRATEGY.VALUES, // default
});

// Behavior:
// - dirty: true when any value differs from initial
// - dirty: false when all values equal initial
// - Correctly handles "undo" scenarios (value changed back to initial)
```

**TOUCHED Strategy (Legacy)**

Based on whether fields were touched.

```js
engine.init({ email: '' }, {
  dirtyCheckStrategy: DIRTY_CHECK_STRATEGY.TOUCHED,
});

// Behavior:
// - dirty: true when any field was touched
// - dirty: false when no fields were touched
// - Does NOT detect "undo" scenarios
```

### Navigation guard
```jsx
import { Form } from '@folio/stripes-acq-components/experimental';
import { useHistory } from 'react-router-dom';

function MyForm() {
  const history = useHistory();
  return (
    <Form
      onSubmit={handleSubmit}
      navigationCheck
      navigationGuardProps={{
        history,
        message: 'You have unsaved changes. Are you sure you want to leave?',
      }}
    >
      {/* fields */}
    </Form>
  );
}
```

### Validation

**Field-level Validation**

Validates individual fields using field validators.

```jsx
<Field 
  name="email" 
  validate={(value, allValues) => {
    if (!value) return 'Email is required';
    if (!value.includes('@')) return 'Invalid email format';
    return undefined; // No error
  }}
  validateOn="blur" // or "change" or "submit"
  debounceDelay={300} // Debounce for "change" validation
>
  {({ input, meta }) => (
    <>
      <input {...input} />
      {meta.error && <span className="error">{meta.error}</span>}
    </>
  )}
</Field>
```

**Form-level Validation**

Validates business logic and cross-field rules.

```jsx
<Form
  validate={(values) => {
    // Return object for field-specific errors
    if (values.password !== values.confirmPassword) {
      return { 
        confirmPassword: 'Passwords must match',
      };
    }
    
    // Return string for form-level error
    if (values.items?.length === 0) {
      return 'At least one item is required';
    }
    
    // Return null/undefined for no errors
    return null;
  }}
  formValidateOn="submit" // or "change" or "blur"
>
  {/* fields */}
</Form>
```

**Validation Behavior**

When both field-level and form-level validation are used:
1. Both validators run independently on their configured events
2. Field-level validators run first (format, type, required checks)
3. Form-level validators run and can set field errors via object return
4. **Form-level errors OVERWRITE field-level errors** (last write wins, no merging)

**Best Practices:**
- **Field-level**: Basic validation (format, type, required)
- **Form-level**: Business logic and cross-field validation

**Multiple Errors on One Field:**

Combine errors in a single validator:

```jsx
validate={(values) => {
  const errors = [];
  if (values.password.length < 8) errors.push('Min 8 characters');
  if (!/[A-Z]/.test(values.password)) errors.push('Must contain uppercase');
  if (!/[0-9]/.test(values.password)) errors.push('Must contain number');
  
  return errors.length 
    ? { password: errors.join('. ') } 
    : undefined;
}}
```

**Custom Validation Strategies**

Extend ValidationErrorStrategy for custom error formats:

```js
import { ValidationErrorStrategy } from '@folio/stripes-acq-components/experimental';

class XMLErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return typeof error === 'string' && error.startsWith('<error>');
  }
  
  handle(error, engine, formErrorPath) {
    const parsed = parseXMLError(error);
    Object.entries(parsed).forEach(([field, msg]) => {
      engine.setError(field, msg);
    });
  }
}

// Register custom strategy
engine.validationErrorHandler.addStrategy(new XMLErrorStrategy(), 0);
```

### Debugging

**Debug Information**

Use `engine.getDebugInfo()` to inspect form state:

```js
const debug = engine.getDebugInfo();
console.log(debug);

// Output:
{
  formDirty: true,
  dirtyStrategy: 'VALUES',
  dirtyFields: { email: true, name: false },
  dirtyFieldsCount: 1,
  dirtyFieldsList: ['email'],
  touchedFields: { email: true, name: true },
  touchedCount: 2,
  submitting: false,
  submitSucceeded: false,
  hasErrors: false,
  // ... more debug info
}
```

### Advanced Features

#### SchedulerService

Centralized async task scheduling with multiple strategies.

**Available Methods:**

```js
// Microtask - high-priority async tasks (before next render)
engine.schedulerService.scheduleMicrotask(() => {
  console.log('Runs before next render');
});

// Animation frame - visual updates aligned with browser repaints
const rafId = engine.schedulerService.scheduleAnimationFrame(() => {
  console.log('Runs on next animation frame');
});
engine.schedulerService.cancelAnimationFrame(rafId);

// Timeout - delayed execution
const timeoutId = engine.schedulerService.scheduleTimeout(() => {
  console.log('Runs after 1000ms');
}, 1000);
engine.schedulerService.cancelTimeout(timeoutId);

// Immediate - next tick execution
engine.schedulerService.scheduleImmediate(() => {
  console.log('Runs on next tick');
});
```

**Benefits:**
- DRY - Eliminates duplicated scheduling logic throughout codebase
- Consistent behavior with automatic fallbacks
- Easy to test with mock scheduler
- Single point for scheduling optimizations

#### BaseFeature

Base class for all features using Template Method Pattern.

**Creating Custom Feature:**

```js
import { BaseFeature } from '@folio/stripes-acq-components/experimental';

class CustomFeature extends BaseFeature {
  constructor(engine) {
    super(engine);
    this.customProperty = null;
  }

  init() {
    super.init(); // Clears state
    this._setState('initialized', true);
    this._setState('data', []);
  }

  reset() {
    super.reset(); // Clears state
    this.customProperty = null;
  }

  addData(item) {
    const current = this._getState('data') || [];
    this._setState('data', [...current, item]);
  }

  getData() {
    return this._getState('data') || [];
  }
}

// Use custom feature
const feature = new CustomFeature(engine);
feature.init();
feature.addData({ id: 1 });
console.log(feature.getState()); // { initialized: true, data: [{ id: 1 }] }
```

**Benefits:**
- DRY - Shared functionality across all features
- Consistent state management
- Easy to extend
- Template Method Pattern ensures proper initialization/cleanup

#### FeatureFactory

Factory for creating and managing features.

**Usage:**

```js
import { FeatureFactory } from '@folio/stripes-acq-components/experimental';

// Create all features
const features = FeatureFactory.createFeatures(engine, {
  // Optional: override default services
  schedulerService: customScheduler,
  validationService: customValidator,
});

// Initialize all features
FeatureFactory.initializeFeatures(features, initialValues);

// Reset all features
FeatureFactory.resetFeatures(features);
```

**Benefits:**
- KISS - Simplifies feature creation
- Consistent initialization
- Easy to add new features
- Reduces boilerplate

#### ValidationErrorHandler

Strategy pattern for extensible error handling.

**Built-in Strategies:**

1. **NullErrorStrategy** - Handles null/undefined (no error)
2. **ObjectErrorStrategy** - Handles `{ field: 'error' }` format
3. **ArrayErrorStrategy** - Handles `['error1', 'error2']` format (logs warning)
4. **StringErrorStrategy** - Handles `'error message'` format (form-level)

**Creating Custom Strategy:**

```js
import { ValidationErrorStrategy } from '@folio/stripes-acq-components/experimental';

class JSONErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return typeof error === 'string' && error.startsWith('{');
  }
  
  handle(error, engine, formErrorPath) {
    try {
      const parsed = JSON.parse(error);
      Object.entries(parsed).forEach(([field, msg]) => {
        engine.setError(field, msg);
      });
    } catch (e) {
      engine.setError(formErrorPath, 'Invalid error format');
    }
  }
}

// Register custom strategy with high priority
engine.validationErrorHandler.addStrategy(new JSONErrorStrategy(), 0);
```

**Benefits:**
- Open/Closed Principle - Add strategies without modifying handler
- Easy to extend for custom error formats
- Clear separation of concerns
- Eliminates nested if/else chains

### Performance Optimizations

#### Memory Management

- **Map-based caching** - Efficient value caching with automatic size management
- **WeakMap contexts** - Automatic cleanup of event contexts when components unmount
- **Event cleanup** - Listeners removed when context unmounts
- **Selective subscriptions** - Only re-render on needed state changes
- **Immutable updates** - No memory leaks from shared references

#### Rendering Performance

- **Bubble support** - Efficient nested field watching
- **Memoized components** - Prevents unnecessary re-renders
- **Debounced validation** - Reduces validation calls
- **Batched updates** - Multiple changes in single render

### Testing

#### Test Coverage

- **1100+ comprehensive tests** across 280+ test suites
- **>80% coverage** of core services and features
- **Fast execution** - ~4 seconds for full test suite

### Troubleshooting

#### Form Not Submitting

```js
// Check for validation errors
const debug = engine.getDebugInfo();
console.log('Has errors:', debug.hasErrors);
console.log('Errors:', engine.getErrors());

// Check submission state
console.log('Submitting:', debug.submitting);
console.log('Submit succeeded:', debug.submitSucceeded);
```

#### Values Not Updating

```js
// Check field registration
console.log('Field state:', engine.getFieldState('email'));

// Check event subscriptions
console.log('Active listeners:', engine.eventService.getActiveListeners());

// Check if field is properly connected
const { input } = useField('email');
console.log('Input value:', input.value);
```
