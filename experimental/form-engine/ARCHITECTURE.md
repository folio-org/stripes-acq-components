## Architecture

This form engine is built around clean architecture principles with injectable services, feature modules, and design patterns. The goals are clarity, testability, maintainability, and performance.

### High-level Design

**FormEngine** - Coordinates everything; exposes an ergonomic API for React bindings and consumers.

**Services (Injected)**
  - **SchedulerService** - Centralized async task scheduling with multiple strategies
  - **ValidationService** - Validates fields/form with debouncing and mode control
  - **CacheService** - Caches values and form state; clears selectively on updates
  - **EventService** - Pub/sub with bubble support, context cleanup, and error handling
  - **BatchService** - Batches multiple updates with rAF or timeouts

**Features (Factory-Created)**
  - **BaseFeature** - Base class providing shared functionality (Template Method Pattern)
  - **ValuesFeature** - Current and initial values; immutable updates
  - **ErrorsFeature** - Field errors map and helpers
  - **TouchedFeature** - Tracks touched fields
  - **ActiveFeature** - Currently focused field
  - **SubmittingFeature** - Submitting and submitSucceeded flags
  - **DirtyFeature** - Dirty/pristine detection per strategy

**Factories**
  - **FeatureFactory** - Creates and manages all features (Factory Pattern)

**Validation (Strategy Pattern)**
  - **ValidationErrorHandler** - Coordinates error handling
  - **ValidationErrorStrategy** - Base class for error strategies
  - **NullErrorStrategy** - Handles null/undefined (no error)
  - **ObjectErrorStrategy** - Handles field-level errors (object format)
  - **ArrayErrorStrategy** - Handles array errors (logs warnings)
  - **StringErrorStrategy** - Handles form-level errors (string format)

**Utilities**
  - **helpers.js** - Safe operations: `createCleanObject()`
  - **validationErrorHandler.js** - Uses ValidationErrorHandler
  - **path.js** - Path manipulation
  - **checks.js** - Type checking
  - **validation.js** - Validation utilities

### Design Patterns

**Factory Pattern** - FeatureFactory simplifies feature creation:
```javascript
// Creates all features with consistent configuration
const features = FeatureFactory.createFeatures(engine, services);
FeatureFactory.initializeFeatures(features, initialValues);
FeatureFactory.resetFeatures(features);
```

**Strategy Pattern** - ValidationErrorHandler enables extensible error handling:
```javascript
// Each strategy handles specific error format
// Easy to add new strategies without modifying existing code (Open/Closed Principle)
const handler = new ValidationErrorHandler();
handler.addStrategy(new NullErrorStrategy());
handler.addStrategy(new ObjectErrorStrategy());
handler.addStrategy(new ArrayErrorStrategy());
handler.addStrategy(new StringErrorStrategy());
handler.handle(error, engine, '$form'); // Picks right strategy automatically
```

**Template Method Pattern** - BaseFeature provides shared functionality:
```javascript
// All features extend BaseFeature for consistent state management
class ValuesFeature extends BaseFeature {
  init(initialValues) {
    super.init(); // Clears state
    this._setState('current', initialValues);
  }
}
```

**Dependency Injection** - All services are injected:
```javascript
const engine = new FormEngine({
  schedulerService: new SchedulerService(),
  validationService: new ValidationService(),
  // ... other services
});
```

### SOLID Principles

**Single Responsibility Principle (S)**
- Each service has one job: SchedulerService schedules, ValidationService validates
- Each feature manages one aspect: ValuesFeature manages values, ErrorsFeature manages errors
- Each strategy handles one error format

**Open/Closed Principle (O)**
- ValidationErrorHandler is open for extension (add strategies), closed for modification
- BaseFeature allows extension without modifying base behavior
- New features can be added without changing FeatureFactory logic

**Liskov Substitution Principle (L)**
- All ValidationErrorStrategy implementations are interchangeable
- All BaseFeature extensions work with FeatureFactory
- Services can be swapped with custom implementations

**Interface Segregation Principle (I)**
- BaseFeature provides minimal interface: `init()`, `reset()`, `getState()`
- ValidationErrorStrategy has focused interface: `canHandle()`, `handle()`
- No class is forced to implement unused methods

**Dependency Inversion Principle (D)**
- FormEngine depends on service abstractions, not concrete implementations
- Features depend on BaseFeature abstraction
- ValidationErrorHandler depends on strategy abstraction

### DRY Principle

**Eliminated Duplications:**
- SchedulerService centralizes all async scheduling (~50 lines eliminated)
- BaseFeature provides shared state management (~80 lines eliminated)
- Helper utilities eliminate null-checking boilerplate (~70 lines eliminated)
- ValidationErrorHandler replaces nested conditionals (~200 lines total eliminated)

### KISS Principle

**Simplified Complex Code:**
- FeatureFactory replaces verbose feature instantiation
- ValidationErrorHandler replaces 80+ lines of if/else chains with 20 lines
- BaseFeature provides clear template for feature development

### Key Principles

- **Single source of truth** - FormEngine coordinates all state
- **Immutable updates** - State changes create new objects
- **Selective subscriptions** - Only subscribe to needed state with bubble support
- **Efficient caching** - Map-based caching with automatic size management
- **WeakMap contexts** - Automatic cleanup of event listeners
- **Explicit service boundaries** - Each service independently mockable
- **Factory-based creation** - Consistent feature initialization
- **Strategy-based handling** - Extensible error processing

### Events

**Form-level Events:**
- `INIT` - Form initialized
- `RESET` - Form reset to initial values
- `CHANGE` - Any field value changed
- `VALUES` - Form values updated
- `ERROR` - Validation error occurred
- `VALIDATION` - Validation completed
- `SUBMIT` - Form submission
- `CONFIG` - Configuration changed

**Field-level Events:**
- `change:${path}` - Specific field value changed
- `error:${path}` - Specific field error set
- `errors:${path}` - Specific field errors updated

**Event Features:**
- Event handlers wrapped with error handling and context tracking for safe cleanup
- **Bubble support**: Listeners can subscribe with `{ bubble: true }` to receive nested field events
  - Example: `engine.on('change:orders', callback, null, { bubble: true })` fires when `orders[0].amount` changes
  - Used by `useWatch(name, { bubble: true })` for efficient array/object watching
  - Optimization: Only emits to bubble listeners when nested fields change via `hasListener(event, { onlyBubble: true })`

### Scheduling (SchedulerService)

**Scheduling Strategies:**
- **Microtask** - High-priority async tasks (before next render)
- **AnimationFrame** - Visual updates aligned with browser repaints
- **Timeout** - Delayed execution with configurable delay
- **Immediate** - Next tick execution (microtask or timeout fallback)

**Usage:**
```javascript
engine.schedulerService.scheduleMicrotask(callback);
```

**Benefits:**
- DRY - Eliminates duplicated scheduling logic
- Consistent behavior across codebase
- Easy to test with mock scheduler
- Single point for scheduling optimizations

### Validation (Strategy Pattern)

**Validation Modes:**
- `change` - Validate on every value change
- `blur` - Validate when field loses focus
- `submit` - Validate only on form submission

**ValidationErrorHandler** coordinates error handling via strategies:

```javascript
// Each strategy handles specific error format
class ValidationErrorStrategy {
  canHandle(error) { /* check if this strategy handles error */ }
  handle(error, engine, formErrorPath) { /* process error */ }
}

// Strategies (priority order):
1. NullErrorStrategy - Returns if error is null/undefined (no error)
2. ObjectErrorStrategy - Handles { field: 'error' } format
3. ArrayErrorStrategy - Handles ['error1', 'error2'] format (logs warning)
4. StringErrorStrategy - Handles 'error message' format (form-level)
```

**Adding Custom Strategy:**
```javascript
class XMLErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return typeof error === 'string' && error.startsWith('<error>');
  }
  
  handle(error, engine, formErrorPath) {
    // Parse XML and set errors
    const parsed = parseXMLError(error);
    Object.entries(parsed).forEach(([field, msg]) => {
      engine.setError(field, msg);
    });
  }
}

handler.addStrategy(new XMLErrorStrategy(), 0); // High priority
```

**Benefits:**
- Open/Closed Principle - Add strategies without modifying handler
- Easy to extend for custom error formats
- Clear separation of concerns
- Eliminates nested if/else chains

**Debouncing:**
- Supported per field via ValidationService
- Form-level validator registered for `$form`
- Configurable delay per field

**On Submit:**
- Validate all fields
- Touch fields with errors
- Emit SUBMIT event with result details

### Dirty Detection (DirtyFeature)

**Strategies:**
- **VALUES (default)** - Deep or custom equality between current and initial values
  - `dirty: true` when any value differs from initial
  - `dirty: false` when all values equal initial
  - Correctly handles "undo" scenarios
- **TOUCHED (legacy)** - Derived from touched fields
  - `dirty: true` when any field was touched
  - `dirty: false` when no fields were touched
  - Does NOT detect "undo" scenarios

**Implementation:**
- DirtyFeature keeps last known dirty state per field in Map for fast computation
- Uses custom equality function if provided
- Extends BaseFeature for consistent state management

### Feature Management (FeatureFactory)

**Factory Methods:**
```javascript
// Create all features with consistent configuration
const features = FeatureFactory.createFeatures(engine, services);

// Initialize all features
FeatureFactory.initializeFeatures(features, initialValues);

// Reset all features
FeatureFactory.resetFeatures(features);
```

**Benefits:**
- KISS - Simplifies feature creation
- Consistent initialization across all features
- Easy to add new features
- Reduces boilerplate in FormEngine

### Navigation Guard

**FormNavigationGuard** blocks navigation when form is dirty:
- Uses `useFormState` for `dirty`, `submitting`, `submitSucceeded`
- Blocks `history` navigation when dirty and not submitting
- Shows `FormNavigationModal` for confirmation
- Optional `cachePreviousUrl` enables integration with `LastVisitedContext` from stripes-core

**Configuration:**
```jsx
<Form
  navigationCheck
  navigationGuardProps={{
    history,
    message: 'You have unsaved changes',
    ignorePaths: ['/ignore-this-path'],
    onBeforeBlock: () => console.log('About to block'),
    onConfirm: () => console.log('User confirmed'),
    onCancel: () => console.log('User cancelled'),
  }}
>
  {/* fields */}
</Form>
```

**Test Structure:**
- Service tests: SchedulerService, ValidationService, CacheService, etc.
- Feature tests: BaseFeature, ValuesFeature, ErrorsFeature, etc.
- Factory tests: FeatureFactory creation and management
- Strategy tests: ValidationErrorHandler and all strategies
- Utility tests: helpers, path, checks, validation
- Integration tests: Form, Field, hooks

**Testability Features:**
- All services independently mockable
- Factory pattern enables test doubles
- Strategy pattern allows custom test strategies
- Clear separation of concerns aids unit testing


