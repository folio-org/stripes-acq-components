## User Guide

### Installation
This module lives under `@folio/stripes-acq-components/experimental/form-engine`. Import directly from its `src` index in this experimental area when consuming inside this repo.

### Quick start
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

### Form props
- `onSubmit(values, api?)`: async/sync submit handler
- `initialValues`: object with initial form values
- `defaultValidateOn`: `'blur' | 'change'` default for fields
- `validate(allValues)`: optional form-level validator
- `formValidateOn`: `'submit' | 'blur' | 'change'` for form-level validator
- `debounceDelay`: number, debouncing for change validations
- `dirtyCheckStrategy`: `DIRTY_CHECK_STRATEGY.VALUES | DIRTY_CHECK_STRATEGY.TOUCHED`
- `engine`: custom `FormEngine` instance (optional)
- `navigationCheck`: boolean to enable navigation guard
- `navigationGuardProps`: { history, message, heading, confirmLabel, cancelLabel, ignorePaths, onBeforeBlock, onConfirm, onCancel }
  - `history` is required if `navigationCheck` is true
  - `cachePreviousUrl` is automatically provided via `LastVisitedContext` when available

### Field API
`<Field name validate validateOn debounceDelay subscription>{({ input, meta }) => JSX}</Field>`
- `input`: `{ name, value, onChange, onBlur, onFocus }`
- `meta`: `{ error, touched, active, dirty, pristine, initial }`
- `subscription`: select which parts of state to subscribe to for performance

### Hooks
- `useField(name, options)`
- `useFormState(subscription)`:
  - subscription keys: `values`, `errors`, `touched`, `active`, `submitting`, `submitSucceeded`, `dirty`, `pristine`, `valid`
- `useWatch(name, selector?)`
- `useFormSubmit(onSubmit)`

### Engine API (selected)
```js
const engine = new FormEngine().init({ a: 1 }, { validateOnBlur: true });
engine.get(path);
engine.set(path, value);
engine.setMany([{ path, value }]);
engine.getValues();
engine.getInitialValues();
engine.getErrors();
engine.validateAll();
engine.submit(onSubmit);
engine.getFormState();
engine.getFieldState(path);
engine.getDirtyFields();
engine.getDirtyFieldsList();
engine.getDebugInfo(); // includes: dirtyStrategy, dirtyFieldsCount, touchedCount, submitting, submitSucceeded, etc.
```

### Dirty check strategy
```js
import { DIRTY_CHECK_STRATEGY } from '@folio/stripes-acq-components/experimental';

engine.init({ email: '' }, {
  dirtyCheckStrategy: DIRTY_CHECK_STRATEGY.VALUES, // default
});
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

### Debugging
Use `engine.getDebugInfo()` to inspect:
- `formDirty`, `dirtyStrategy`
- `dirtyFields`, `dirtyFieldsCount`, `dirtyFieldsList`
- `touchedFields`, `touchedCount`
- `submitting`, `submitSucceeded`
- performance stats via `engine.getServiceStats()`


