import { includeItem } from './FieldAutoSuggest';

describe('FieldAutoSuggest', () => {
  describe('includeItem', () => {
    it('returns true when item[valueKey] contains search string', () => {
      // now you, too, will hear hoMEOWner in your head every time you read it
      expect(includeItem({ aMinor: 'homeowner' }, 'aMinor', 'meow')).toBe(true);
    });

    describe('returns false', () => {
      it('when item[valueKey] does not contain search string', () => {
        expect(includeItem({ aMinor: 'homeowner' }, 'aMinor', 'woof')).toBe(false);
      });
      it('when item[valueKey] is undefined', () => {
        expect(includeItem({ nothing: 'gourmet' }, 'aMinor', 'toothpaste')).toBe(false);
      });
      it('when item is undefined', () => {
        expect(includeItem(null, 'aMinor', 'toothpaste')).toBe(false);
      });
    });
  });
});
