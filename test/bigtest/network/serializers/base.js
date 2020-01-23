import { RestSerializer } from 'miragejs';

const { isArray } = Array;

const BaseSerializer = RestSerializer.extend({
  keyForAttribute(attr) {
    return attr;
  },
});

export const buildBaseSerializer = (modelName, recordsName) => (
  BaseSerializer.extend({
    serialize(...args) {
      const json = BaseSerializer.prototype.serialize.apply(this, args);

      const items = json[modelName];

      if (isArray(items)) {
        return {
          [recordsName]: items,
          totalRecords: items.length,
        };
      }

      return items;
    },
  })
);

export default BaseSerializer;
