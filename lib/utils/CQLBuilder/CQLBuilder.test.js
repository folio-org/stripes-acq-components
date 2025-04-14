import { CQLBuilder } from './CQLBuilder';

describe('CQLBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new CQLBuilder();
  });

  test('should build exact match query', () => {
    const query = builder.exact('title', '1984').build();

    expect(query).toBe('title=="1984"');
  });

  test('should build fuzzy match query', () => {
    const query = builder.fuzzy('author', 'Orwell*').build();

    expect(query).toBe('author="Orwell*"');
  });

  test('should build contains query', () => {
    const query = builder.contains('text', 'quick brown fox').build();

    expect(query).toBe('text all "quick brown fox"');
  });

  test('should build boolean combination', () => {
    const query = builder
      .exact('status', 'active')
      .and()
      .fuzzy('title', '1984*')
      .build();

    expect(query).toBe('status=="active" AND title="1984*"');
  });

  test('should build grouped query', () => {
    const query = builder
      .exact('language', 'english')
      .and()
      .group(b => b
        .fuzzy('title', 'war*')
        .or()
        .fuzzy('author', 'Tolstoy*'))
      .build();

    expect(query).toBe('language=="english" AND (title="war*" OR author="Tolstoy*")');
  });

  test('should build proximity query', () => {
    const query = builder
      .index('text').relation('=').value('quick')
      .prox(3)
      .index('text')
      .relation('=')
      .value('fox')
      .build();

    expect(query).toBe('text = "quick" prox/word/3 text = "fox"');
  });

  test('should build sorted query', () => {
    const query = builder
      .fuzzy('title', '1984*')
      .sortBy('createdDate', 'desc')
      .build();

    expect(query).toBe('title="1984*" sortBy createdDate/sort.descending');
  });

  test('should build query with modifiers', () => {
    const query = builder
      .contains('title', 'war peace')
      .modifier('caseInsensitive', true)
      .build();

    expect(query).toBe('title all "war peace" caseInsensitive=true');
  });

  test('should build special operator query', () => {
    const query = builder
      .specialOperator('fundDistribution', '=/', '@fundId', 'qwerty')
      .build();

    expect(query).toBe('fundDistribution =/@fundId "qwerty"');
  });

  test('should reset state after build', () => {
    builder.exact('title', '1984').build();
    expect(builder.build()).toBe('');
  });

  test('should throw error when value without relation', () => {
    expect(() => builder.value('test')).toThrow('Value must follow a relation');
  });

  test('should throw error when relation without index', () => {
    expect(() => builder.relation('=')).toThrow('Index must be set before relation');
  });
});
