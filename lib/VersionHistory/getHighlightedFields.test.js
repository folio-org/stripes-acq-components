import { FIELD_CHANGE_TYPES } from '../utils';
import { getHighlightedFields } from './getHighlightedFields';

const fieldNames = ['foo', 'bar', 'baz'];

const changes = [
  { type: FIELD_CHANGE_TYPES.update, path: 'fieldOne[0].foo' },
  { type: FIELD_CHANGE_TYPES.create, path: 'fieldOne[1]' },
  { type: FIELD_CHANGE_TYPES.update, path: 'field.two[0].baz' },
  { type: FIELD_CHANGE_TYPES.create, path: 'field.two[1]' },
  { type: FIELD_CHANGE_TYPES.create, path: 'fieldThree' },
];

describe('getHighlightedFields', () => {
  it('should return highlights for field specified by name', () => {
    const name = 'fieldOne';
    const highlights = getHighlightedFields({ changes, fieldNames, name });

    highlights.forEach((fieldPath) => {
      expect(fieldPath.startsWith(name));
    });
  });

  it('should highlight all related fields (whole row for MCL) for added repeatable field', () => {
    const name = 'field.two';
    const highlights = getHighlightedFields({ changes, fieldNames, name });

    const fieldChanges = changes.filter(
      ({ type, path }) => type === FIELD_CHANGE_TYPES.create && path.startsWith(name),
    );

    fieldChanges.forEach(({ path }) => {
      fieldNames.forEach((fieldName) => {
        expect(highlights.includes(`${path}.${fieldName}`)).toBeTruthy();
      });
    });
  });
});
