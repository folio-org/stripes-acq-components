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

  describe('Array Search Modifiers', () => {
    it('AND modifiers with single modifier', () => {
      const query = builder
        .andModifiersSearch('contributors', { type: 'author' }, 'John')
        .build();

      expect(query).toBe('contributors =/@type=author "John"');
    });

    it('AND modifiers with multiple modifiers', () => {
      const query = builder
        .andModifiersSearch(
          'contributors',
          { type: 'author', role: 'primary' },
          'John',
        )
        .build();

      expect(query).toBe('contributors =/@type=author/@role=primary "John"');
    });

    it('OR modifiers with single modifier', () => {
      const query = builder
        .orModifiersSearch('contributors', 'type', 'John')
        .build();

      expect(query).toBe('contributors =/@type "John"');
    });

    it('OR modifiers with multiple modifiers', () => {
      const query = builder
        .orModifiersSearch('contributors', ['type', 'role'], 'John')
        .build();

      expect(query).toBe('contributors =/@type/@role "John"');
    });

    it('modifiers with numeric values', () => {
      const query = builder
        .andModifiersSearch('items', { locationId: 123 }, 'book')
        .build();

      expect(query).toBe('items =/@locationId=123 "book"');
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
        .andModifiersSearch('metadata', { type: 'book' }, 'dinosaur')
        .or()
        .orModifiersSearch('classification', ['category', 'genre'], 'science')
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

    it('grouped conditions with modifiers', () => {
      const query = builder
        .equal('status', 'active')
        .group((b) => b
          .andModifiersSearch('authors', { type: 'primary' }, 'John')
          .or()
          .orModifiersSearch('authors', ['secondary', 'editor'], 'Jane'))
        .modifier('caseInsensitive', true)
        .fuzzy('title', 'history')
        .build();

      expect(query).toBe(
        'status=="active" AND ' +
        '(authors =/@type=primary "John" OR authors =/@secondary/@editor "Jane") AND ' +
        'title="history" caseInsensitive=true',
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

    it('modifiers apply only to next condition', () => {
      const query = builder
        .modifier('caseInsensitive', true)
        .equal('field1', 'value1')
        .equal('field2', 'value2')
        .build();

      expect(query).toBe(
        'field1=="value1" caseInsensitive=true AND field2=="value2"',
      );
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
        .andModifiersSearch('items', { type: 'book' }, 'history')
        .or()
        .andModifiersSearch('items', { type: 'journal' }, 'science')
        .build();

      expect(query).toBe(
        'items =/@type=book "history" OR items =/@type=journal "science"',
      );
    });

    it('should handle OR between different condition types', () => {
      const query = builder
        .equal('category', 'fiction')
        .or()
        .andModifiersSearch('metadata', { lang: 'en' }, 'dinosaur')
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
        .andModifiersSearch('contributors', { role: 'author' }, 'John')
        .or()
        .orModifiersSearch('contributors', ['editor', 'reviewer'], 'Jane')
        .build();

      expect(query).toBe(
        'contributors =/@role=author "John" OR contributors =/@editor/@reviewer "Jane"',
      );
    });

    it('should handle multiple OR combinations with sorting', () => {
      const query = builder
        .equal('lang', 'en')
        .or()
        .andModifiersSearch('metadata', { lang: 'fr' }, 'special')
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
});
