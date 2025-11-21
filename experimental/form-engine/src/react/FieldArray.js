/**
 * FieldArray component - For managing arrays of fields with optimizations
 */

import PropTypes from 'prop-types';
import {
  memo,
  useMemo,
  useRef,
} from 'react';

import { isFunction } from '../utils/checks';
import { useFormEngine } from './FormContext';
import { useWatch } from './hooks';

const FieldArray = memo(({ name, children }) => {
  const engine = useFormEngine();

  // Stabilize selector function using useRef
  const arraySelectorRef = useRef((value) => value || []);

  // Watch array changes with selector
  const array = useWatch(name, { selector: arraySelectorRef.current });

  // Generate field descriptors with stable IDs
  const fields = useMemo(() => {
    return array.map((_, index) => ({
      name: `${name}[${index}]`,
      __id: `${name}[${index}]`,
      index,
    }));
  }, [name, array]);

  const arrayMethods = useMemo(() => ({
    push: (item) => {
      engine.set(name, [...array, item]);
    },

    remove: (index) => {
      const newArray = array.filter((_, i) => i !== index);

      engine.set(name, newArray);
    },

    insert: (index, item) => {
      const newArray = [...array];

      newArray.splice(index, 0, item);
      engine.set(name, newArray);
    },

    move: (fromIndex, toIndex) => {
      const newArray = [...array];
      const [movedItem] = newArray.splice(fromIndex, 1);

      newArray.splice(toIndex, 0, movedItem);
      engine.set(name, newArray);
    },

    swap: (indexA, indexB) => {
      const newArray = [...array];

      [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]];
      engine.set(name, newArray);
    },

    update: (index, item) => {
      const newArray = [...array];

      newArray[index] = item;
      engine.set(name, newArray);
    },

    clear: () => {
      engine.set(name, []);
    },

    length: array.length,
  }), [engine, name, array]);

  if (isFunction(children)) {
    return children({ fields, ...arrayMethods });
  }

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

FieldArray.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  name: PropTypes.string.isRequired,
};

export default FieldArray;
