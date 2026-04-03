/**
 * useSubmit - Hook for form submission
 */

import { useCallback } from 'react';
import { useFormEngine } from '../FormContext';
import { useFormState } from './useFormState';

export function useSubmit(onSubmit) {
  const engine = useFormEngine();
  const { submitting } = useFormState({ submitting: true }); // Subscribe to submitting state to trigger re-render on changes

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();

    if (onSubmit) {
      const result = await engine.submit(onSubmit);

      if (!result.success) {
        // Form submission failed - errors are handled by FormEngine
        // Could emit custom event or call error callback here
      }
    }
  }, [engine, onSubmit]);

  return {
    handleSubmit,
    submitting,
  };
}
