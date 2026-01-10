/* Developed collaboratively using AI (Cursor) */

import { render } from '@folio/jest-config-stripes/testing-library/react';

import FormEngine from '../../core/FormEngine';
import {
  FormProvider,
  useFormEngine,
  useFormContext,
} from '../FormContext';

describe('FormContext', () => {
  it('should provide engine via useFormEngine', () => {
    const engine = new FormEngine().init({});
    const TestComponent = () => {
      const eng = useFormEngine();

      expect(eng).toBe(engine);

      return <div>Test</div>;
    };

    render(
      <FormProvider engine={engine}>
        <TestComponent />
      </FormProvider>,
    );
  });

  it('should throw error if useFormEngine is used outside provider', () => {
    const TestComponent = () => {
      expect(() => useFormEngine()).toThrow('useFormEngine must be used within a FormProvider');

      return null;
    };
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<TestComponent />);
    consoleSpy.mockRestore();
  });

  it('should provide context via useFormContext', () => {
    const engine = new FormEngine().init({});
    const TestComponent = () => {
      const ctx = useFormContext();

      expect(ctx.engine).toBe(engine);
      expect(ctx.defaultValidateOn).toBe('blur');

      return <div>Test</div>;
    };

    render(
      <FormProvider engine={engine} defaultValidateOn="blur">
        <TestComponent />
      </FormProvider>,
    );
  });
});
