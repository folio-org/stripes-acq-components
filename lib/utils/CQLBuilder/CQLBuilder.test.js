import { escapeCqlWildcards } from '@folio/stripes/util';

import { CQLBuilder } from './CQLBuilder';

describe('CQLBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new CQLBuilder();
  });

  describe('Basic Functionality', () => {
    it('should build exact match query', () => {
      const query = builder.equal('title', '1984').build();

      expect(query).toBe('title=="1984"');
    });

    it('should build fuzzy match query', () => {
      const query = builder.fuzzy('author', 'Orwell*').build();

      expect(query).toBe('author="Orwell*"');
    });

    it('should build greater than query', () => {
      const query = builder.greaterThan('price', 100).build();

      expect(query).toBe('price > 100');
    });

    it('should build greater than or equal match query', () => {
      const query = builder.gte('price', 100).build();

      expect(query).toBe('price >= 100');
    });

    it('should build less than match query', () => {
      const query = builder.lessThan('price', 100).build();

      expect(query).toBe('price < 100');
    });

    it('should build less than or equal match query', () => {
      const query = builder.lte('price', 100).build();

      expect(query).toBe('price <= 100');
    });

    it('should build not equal match query', () => {
      const query = builder.notEqual('author', 'Orwell*').build();

      expect(query).toBe('author <> "Orwell*"');
    });

    it('should build boolean combination', () => {
      const query = builder
        .equal('status', 'active')
        .and()
        .fuzzy('title', '1984*')
        .build();

      expect(query).toBe('status=="active" AND title="1984*"');
    });
  });

  describe('Sorting', () => {
    it('single field sort', () => {
      const query = builder
        .fuzzy('title', 'dinosaur')
        .sortBy('dc.date', 'desc')
        .build();

      expect(query).toBe('title="dinosaur" sortBy dc.date/sort.descending');
    });

    it('multi-field sort', () => {
      const query = builder
        .equal('type', 'fossil')
        .sortByMultiple([
          { field: 'dc.date', order: 'desc' },
          { field: 'dc.title', order: 'asc' },
        ])
        .build();

      expect(query).toBe(
        'type=="fossil" sortBy dc.date/sort.descending dc.title/sort.ascending',
      );
    });

    it('mixed sort order formats', () => {
      const query = builder
        .sortByMultiple([
          { field: 'created', order: 'sort.descending' },
          { field: 'modified', order: 'asc' },
          { field: 'title', order: 'sort.ascending' },
        ])
        .build();

      expect(query).toBe(
        'sortBy created/sort.descending modified/sort.ascending title/sort.ascending',
      );
    });
  });

  describe('Complex Queries', () => {
    it('should combine allRecords with other conditions', () => {
      const query = builder
        .allRecords()
        .not()
        .group(
          (b) => b
            .equal('lang', 'en')
            .or()
            .equal('name', 'John'),
        )
        .sortBy('name')
        .build();

      expect(query).toBe('cql.allRecords=1 NOT (lang=="en" OR name=="John") sortBy name/sort.ascending');
    });

    it('combined AND/OR modifiers with sorting', () => {
      const query = builder
        .fuzzy('metadata', 'dinosaur', { modifiers: [{ name: '@type', value: 'book' }] })
        .or()
        .fuzzy('classification', 'science', { modifiers: [{ name: '@category' }, { name: '@genre' }] })
        .sortByMultiple([
          { field: 'published', order: 'desc' },
          { field: 'title', order: 'asc' },
        ])
        .build();

      expect(query).toBe(
        'metadata =/@type=book "dinosaur" OR ' +
        'classification =/@category/@genre "science" ' +
        'sortBy published/sort.descending title/sort.ascending',
      );
    });

    it('grouped conditions', () => {
      const query = builder
        .equal('status', 'active')
        .group((b) => b
          .fuzzy('authors', 'John', { modifiers: [{ name: '@type', value: 'primary' }] })
          .or()
          .fuzzy('authors', 'Jane', { modifiers: [{ name: '@secondary' }, { name: '@editor' }] }))
        .fuzzy('title', 'history')
        .build();

      expect(query).toBe(
        'status=="active" AND ' +
        '(authors =/@type=primary "John" OR authors =/@secondary/@editor "Jane") AND ' +
        'title="history"',
      );
    });

    it('should handle nested groups', () => {
      const nestedGroup = (b2) => b2
        .fuzzy('title', 'history*')
        .or()
        .equal('author', 'Smith');

      const query = builder
        .group(
          (b) => b
            .equal('status', 'active')
            .group(nestedGroup),
        )
        .build();

      expect(query).toBe(
        '(status=="active" AND (title="history*" OR author=="Smith"))',
      );
    });
  });

  describe('Error Handling', () => {
    it('throws when value without relation', () => {
      expect(() => builder.value('test')).toThrow('Value must follow a relation');
    });

    it('throws when relation without index', () => {
      expect(() => builder.relation('=')).toThrow('Index must be set before relation');
    });
  });

  describe('State Management', () => {
    it('resets state after build', () => {
      builder.equal('title', '1984').build();
      expect(builder.build()).toBe('');
    });
  });

  describe('OR Combinations', () => {
    it('should handle OR between basic conditions', () => {
      const query = builder
        .equal('status', 'active')
        .or()
        .equal('status', 'pending')
        .build();

      expect(query).toBe('status=="active" OR status=="pending"');
    });

    it('should handle OR with fuzzy search', () => {
      const query = builder
        .fuzzy('title', 'science*')
        .or()
        .fuzzy('title', 'math*')
        .build();

      expect(query).toBe('title="science*" OR title="math*"');
    });

    it('should handle OR between AND-modifiers conditions', () => {
      const query = builder
        .fuzzy('items', 'history', { modifiers: [{ name: '@type', value: 'book' }] })
        .or()
        .fuzzy('items', 'science', { modifiers: [{ name: '@type', value: 'journal' }] })
        .build();

      expect(query).toBe(
        'items =/@type=book "history" OR items =/@type=journal "science"',
      );
    });

    it('should handle OR between different condition types', () => {
      const query = builder
        .equal('category', 'fiction')
        .or()
        .fuzzy('metadata', 'dinosaur', { modifiers: [{ name: '@lang', value: 'en' }] })
        .or()
        .contains('tags', 'popular')
        .build();

      expect(query).toBe(
        'category=="fiction" OR metadata =/@lang=en "dinosaur" OR tags all "popular"',
      );
    });
  });

  describe('Complex OR Combinations', () => {
    it('should handle OR with grouped conditions', () => {
      const query = builder
        .equal('status', 'active')
        .or()
        .group(
          (b) => b
            .equal('archived', true)
            .and()
            .fuzzy('title', 'archive*'),
        )
        .build();

      expect(query).toBe(
        'status=="active" OR (archived==true AND title="archive*")',
      );
    });

    it('should handle OR between groups', () => {
      const query = builder
        .group(
          (b) => b
            .equal('type', 'book')
            .and()
            .fuzzy('author', 'smith*'),
        )
        .or()
        .group(
          (b) => b
            .equal('type', 'article')
            .fuzzy('title', 'research*'),
        )
        .build();

      expect(query).toBe(
        '(type=="book" AND author="smith*") OR (type=="article" AND title="research*")',
      );
    });

    it('should handle OR with mixed modifiers', () => {
      const query = builder
        .fuzzy('contributors', 'John', { modifiers: [{ name: '@role', value: 'author' }] })
        .or()
        .fuzzy('contributors', 'Jane', { modifiers: [{ name: '@editor' }, { name: '@reviewer' }] })
        .build();

      expect(query).toBe(
        'contributors =/@role=author "John" OR contributors =/@editor/@reviewer "Jane"',
      );
    });

    it('should handle multiple OR combinations with sorting', () => {
      const query = builder
        .equal('lang', 'en')
        .or()
        .fuzzy('metadata', 'special', { modifiers: [{ name: '@lang', value: 'fr' }] })
        .or()
        .contains('notes', 'multilingual')
        .sortBy('created', 'desc')
        .build();

      expect(query).toBe(
        'lang=="en" OR metadata =/@lang=fr "special" OR notes all "multilingual" ' +
        'sortBy created/sort.descending',
      );
    });
  });

  describe('Edge Cases with OR', () => {
    it('should handle OR after NOT', () => {
      const query = builder
        .not()
        .equal('deleted', true)
        .or()
        .equal('status', 'archived')
        .build();

      expect(query).toBe('NOT deleted==true OR status=="archived"');
    });

    it('should handle consecutive OR operators', () => {
      const query = builder
        .equal('x', 1)
        .or()
        .or() // Should ignore duplicate
        .equal('y', 2)
        .build();

      expect(query).toBe('x==1 OR y==2');
    });
  });

  describe('Modifiers', () => {
    describe('Boolean modifiers', () => {
      it('booleanModifier() before and() appends modifier to operator', () => {
        const query = builder
          .fuzzy('title', 'fish')
          .booleanModifier('rel.algorithm', 'fuzzy')
          .and()
          .fuzzy('author', 'Smith')
          .build();

        expect(query).toBe('title="fish" AND/rel.algorithm=fuzzy author="Smith"');
      });

      it('booleanModifier() with custom symbol', () => {
        const query = builder
          .fuzzy('title', 'fish')
          .booleanModifier('distance', 1, '<=')
          .prox()
          .fuzzy('title', 'chips')
          .build();

        expect(query).toBe('title="fish" prox/distance<=1 title="chips"');
      });

      it('booleanModifier() before or()', () => {
        const query = builder
          .equal('status', 'active')
          .booleanModifier('unit', 'sentence')
          .or()
          .equal('status', 'pending')
          .build();

        expect(query).toBe('status=="active" OR/unit=sentence status=="pending"');
      });

      it('booleanModifier() before not()', () => {
        const query = builder
          .allRecords()
          .booleanModifier('unit', 'word')
          .not()
          .equal('deleted', true)
          .build();

        expect(query).toBe('cql.allRecords=1 NOT/unit=word deleted==true');
      });

      it('booleanModifiers() queues multiple modifiers', () => {
        const query = builder
          .fuzzy('title', 'fish')
          .booleanModifiers([
            { name: 'unit', value: 'word' },
            { name: 'distance', value: 1, symbol: '<=' },
            { name: 'unordered' },
          ])
          .prox()
          .fuzzy('title', 'chips')
          .build();

        expect(query).toBe('title="fish" prox/unit=word/distance<=1/unordered title="chips"');
      });
    });

    describe('prox()', () => {
      it('prox() with no args produces bare prox', () => {
        const query = builder
          .fuzzy('title', 'fish')
          .prox()
          .fuzzy('title', 'chips')
          .build();

        expect(query).toBe('title="fish" prox title="chips"');
      });

      it('prox() with inline modifiers', () => {
        const query = builder
          .fuzzy('title', 'fish')
          .prox([
            { name: 'unit', value: 'word' },
            { name: 'distance', value: 3, symbol: '<=' },
          ])
          .fuzzy('title', 'chips')
          .build();

        expect(query).toBe('title="fish" prox/unit=word/distance<=3 title="chips"');
      });

      it('prox() is a no-op when called with no left-hand term', () => {
        const query = builder
          .prox()
          .fuzzy('title', 'fish')
          .build();

        expect(query).toBe('title="fish"');
      });

      it('duplicate prox() calls are ignored', () => {
        const query = builder
          .fuzzy('title', 'fish')
          .prox()
          .prox()
          .fuzzy('title', 'chips')
          .build();

        expect(query).toBe('title="fish" prox title="chips"');
      });
    });

    describe('Relation modifiers', () => {
      it('relationModifier() still works as before', () => {
        const query = builder
          .relationModifier('@type', 'author')
          .fuzzy('contributors', 'John')
          .build();

        expect(query).toBe('contributors =/@type=author "John"');
      });

      it('relationModifiers() plural shorthand produces same output as chained calls', () => {
        const chained = new CQLBuilder()
          .relationModifier('@type', 'author')
          .relationModifier('@role', 'primary')
          .fuzzy('contributors', 'John')
          .build();

        const plural = builder
          .relationModifiers([{ name: '@type', value: 'author' }, { name: '@role', value: 'primary' }])
          .fuzzy('contributors', 'John')
          .build();

        expect(plural).toBe(chained);
        expect(plural).toBe('contributors =/@type=author/@role=primary "John"');
      });

      it('inline modifiers on fuzzy() via options.modifiers', () => {
        const query = builder
          .fuzzy('contributors', 'John', { modifiers: [{ name: '@type', value: 'author' }] })
          .build();

        expect(query).toBe('contributors =/@type=author "John"');
      });

      it('inline modifiers without value (OR-style)', () => {
        const query = builder
          .fuzzy('contributors', 'John', { modifiers: [{ name: '@type' }, { name: '@role' }] })
          .build();

        expect(query).toBe('contributors =/@type/@role "John"');
      });

      it('inline modifiers on equal()', () => {
        const query = builder
          .equal('items', 'book', { modifiers: [{ name: '@locationId', value: 123 }] })
          .build();

        expect(query).toBe('items ==/@locationId=123 "book"');
      });

      it('inline modifiers on relation() in three-call API', () => {
        const query = builder
          .index('contributors')
          .relation('=', [{ name: '@type', value: 'author' }])
          .value('John')
          .build();

        expect(query).toBe('contributors =/@type=author "John"');
      });

      it('inline modifiers merge with queued relationModifier()', () => {
        const query = builder
          .relationModifier('@role', 'primary')
          .fuzzy('contributors', 'John', { modifiers: [{ name: '@type', value: 'author' }] })
          .build();

        expect(query).toBe('contributors =/@type=author/@role=primary "John"');
      });
    });
  });

  describe('Options application', () => {
    describe('escapeCQL', () => {
      const customEscapeFn = (s) => escapeCqlWildcards(s);

      it.each([
        [true, '"quoted"', String.raw`\"quoted\"`],
        [false, '"quoted"', String.raw`"quoted"`],
        [true, String.raw`"Value \ with escaping`, String.raw`\"Value \\ with escaping`],
        [false, String.raw`"Value \ without escaping`, String.raw`"Value \ without escaping`],
        [customEscapeFn, String.raw`"[Value] \ *^ with "custom" escaping`, String.raw`\"[Value] \\ \*\^ with \"custom\" escaping`],
      ])('should properly escape search value when "escapeCQL" option value is %s"', (escapeCQL, rawValue, expected) => {
        const fieldName = 'filter';

        const methods = new Map([
          ['notEqual', CQLBuilder.OPERATORS.NOT_EQUAL],
          ['greaterThan', CQLBuilder.OPERATORS.GREATER_THAN],
          ['gte', CQLBuilder.OPERATORS.GREATER_THAN_EQUAL],
          ['lessThan', CQLBuilder.OPERATORS.GREATER_THAN_EQUAL],
          ['lessThan', CQLBuilder.OPERATORS.LESS_THAN],
          ['lte', CQLBuilder.OPERATORS.LESS_THAN_EQUAL],
          ['contains', CQLBuilder.OPERATORS.ALL],
          ['containsAny', CQLBuilder.OPERATORS.ANY],
        ]);

        expect(builder.equal(fieldName, rawValue, { escapeCQL }).build()).toBe(`${fieldName}=="${expected}"`);
        expect(builder.fuzzy(fieldName, rawValue, { escapeCQL }).build()).toBe(`${fieldName}="${expected}"`);
        expect(builder.fuzzy(fieldName, rawValue, { escapeCQL, modifiers: [{ name: '@foo', value: 'bar' }] }).build()).toBe(`${fieldName} =/@foo=bar "${expected}"`);
        expect(builder.fuzzy(fieldName, rawValue, { escapeCQL, modifiers: [{ name: '@foo' }] }).build()).toBe(`${fieldName} =/@foo "${expected}"`);

        expect(
          builder
            .index(fieldName)
            .relation('=')
            .value(rawValue, { escapeCQL })
            .build(),
        ).toBe(`${fieldName}="${expected}"`);

        methods.forEach((operator, method) => {
          const query = builder[method](fieldName, rawValue, { escapeCQL }).build();

          expect(query).toBe(`${fieldName} ${operator} "${expected}"`);
        });
      });
    });

    describe('formatter', () => {
      it('should use custom formatter when provided', () => {
        const customFormatter = (value) => `custom:${value}`;
        const query = builder.equal('field', 'value', { formatter: customFormatter }).build();

        expect(query).toBe('field==custom:value');
      });
    });

    describe('native array value', () => {
      it('should format a native array the same as CQLBuilderArrayValue', () => {
        expect(builder.fuzzy('field', ['a', 'b']).build()).toBe('field=("a" OR "b")');
      });

      it('should unwrap a single-element array', () => {
        expect(builder.fuzzy('field', ['only']).build()).toBe('field="only"');
      });
    });
  });
});
