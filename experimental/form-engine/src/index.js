/**
  * Form engine - lightweight form state management
 *
 * Exports:
 * - FormEngine: Core form engine with batching and validation
 * - Form: Main form component
 * - Field: High-performance field with debouncing and selective subscriptions
 * - FieldArray: Array field component with enhanced methods
 * - Hooks: useField, useFormState, useWatch, useFormSubmit, useDebouncedValidation
 * - Context: FormProvider, useFormEngine, useFormContext
 */

// Core
export { default as FormEngine } from './core/FormEngine';

// Features
export { BaseFeature } from './core/features/BaseFeature';

// Factories
export { FeatureFactory } from './core/factories/FeatureFactory';

// Validation
export { ValidationErrorHandler } from './core/validation/ValidationErrorHandler';
export { ValidationErrorStrategy } from './core/validation/ValidationErrorStrategy';

// Services
export { BatchService } from './core/services/BatchService';
export { CacheService } from './core/services/CacheService';
export { EventService } from './core/services/EventService';
export { ValidationService } from './core/services/ValidationService';
export { SchedulerService } from './core/services/SchedulerService';

// Constants
export * from './constants';

// React components
export { default as Form } from './react/Form';
export { default as Field } from './react/Field';
export { default as FieldArray } from './react/FieldArray';
export { FormNavigationGuard } from './react/FormNavigationGuard';
export { FormNavigationModal } from './react/FormNavigationModal';

// React hooks
export {
  useField,
  useFormState,
  useFormSubmit,
  useWatch,
} from './react/hooks';

// React context
export {
  FormProvider,
  useFormEngine,
  useFormContext,
} from './react/FormContext';

// Utilities
export * from './utils';

// Default export
export { default } from './react/Form';
