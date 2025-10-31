/**
 * FieldArray component - For managing arrays of fields with optimizations
 */

import React, { useMemo, memo, useRef } from 'react';
import { useFormEngine } from './FormContext';
import { useWatch } from './hooks';
import { isFunction } from '../utils/checks';

const FieldArray = memo(({ name, children }) => {
  const engine = useFormEngine();

  // Stabilize selector function using useRef
  const arraySelectorRef = useRef((value) => value || []);

  // Watch array changes
  const array = useWatch(name, arraySelectorRef.current);

  // Generate field descriptors with stable IDs
  const fields = useMemo(() => {
    return array.map((_, index) => ({
      name: `${name}[${index}]`,
      __id: `${name}[${index}]`,
      index,
    }));
  }, [name, array]);

  // Memoized array manipulation methods
  const arrayMethods = useMemo(() => ({
    push: (item) => {
      const currentArray = engine.get(name) || [];

      engine.set(name, [...currentArray, item]);
    },

    remove: (index) => {
      const currentArray = engine.get(name) || [];
      const newArray = currentArray.filter((_, i) => i !== index);

      engine.set(name, newArray);
    },

    insert: (index, item) => {
      const currentArray = engine.get(name) || [];
      const newArray = [...currentArray];

      newArray.splice(index, 0, item);

      engine.set(name, newArray);
    },

    move: (fromIndex, toIndex) => {
      const currentArray = engine.get(name) || [];
      const newArray = [...currentArray];
      const [movedItem] = newArray.splice(fromIndex, 1);

      newArray.splice(toIndex, 0, movedItem);

      engine.set(name, newArray);
    },

    swap: (indexA, indexB) => {
      const currentArray = engine.get(name) || [];
      const newArray = [...currentArray];

      [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]];

      engine.set(name, newArray);
    },

    update: (index, item) => {
      const currentArray = engine.get(name) || [];
      const newArray = [...currentArray];

      newArray[index] = item;

      engine.set(name, newArray);
    },

    clear: () => {
      engine.set(name, []);
    },

    length: array.length,
  }), [engine, name, array.length]);

  // Render with children function
  if (isFunction(children)) {
    return children({ fields, ...arrayMethods });
  }

  // Default render
  return (
    <div>
      {fields.map((field) => (
        <div key={field.__id}>
          {children}
        </div>
      ))}
    </div>
  );
});

FieldArray.displayName = 'FieldArray';

export default FieldArray;
