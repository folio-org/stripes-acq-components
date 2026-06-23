# CQL Builder

A CQL (Contextual Query Language) Query Builder supporting CQL 1.2 features with FOLIO-specific extensions including array search modifiers and multi-field sorting.

## Basic Usage Examples

### Simple Queries

**Exact match:**
```javascript
const query = new CQLBuilder()
  .equal('title', 'Harry Potter')
  .build();
// title=="Harry Potter"
```

**Multiple conditions:**
```javascript
const query = new CQLBuilder()
  .equal('language', 'eng')
  .and() // optional, will be added automatically
  .contains('subject', 'fantasy')
  .build();
// language=="eng" AND subject all "fantasy"
```

### Condition Grouping

**Complex logic with groups:**
```javascript
const query = new CQLBuilder()
  .group(g => g
    .equal('type', 'book')
    .or()
    .equal('type', 'journal')
  )
  .and()
  .fuzzy('status', 'available')
  .build();
// (type=="book" OR type=="journal") AND status="available"
```

**Nested groups:**
```javascript
const query = new CQLBuilder()
  .group(g1 => g1
    .equal('location', 'main')
    .and()
    .group(g2 => g2
      .equal('format', 'print')
      .or()
      .equal('format', 'large-print')
    )
  )
  .build();
// (location=="main" AND (format=="print" OR format=="large-print"))
```

### Relation Modifiers

**AND-style (object — each key/value becomes `/@key=value`):**
```javascript
const query = new CQLBuilder()
  .fuzzy('items', 'science', { modifiers: [
    { name: '@location', value: 'main' },
    { name: '@status', value: 'available' },
  ]})
  .build();
// items =/@location=main/@status=available "science"
```

**OR-style (name-only modifiers):**
```javascript
const query = new CQLBuilder()
  .fuzzy('contributors', 'Tolkien', { modifiers: [
    { name: '@author' },
    { name: '@editor' },
  ]})
  .build();
// contributors =/@author/@editor "Tolkien"
```

### Boolean Modifiers and Proximity

**Boolean modifiers before `and()`/`or()`:**
```javascript
const query = new CQLBuilder()
  .fuzzy('text', 'quantum')
  .booleanModifier('unit', 'word')
  .and()
  .fuzzy('text', 'physics')
  .build();
// text="quantum" AND/unit=word text="physics"
```

**Proximity search:**
```javascript
const query = new CQLBuilder()
  .fuzzy('text', 'quantum')
  .prox([
    { name: 'unit', value: 'word' },
    { name: 'distance', value: 1, symbol: '<=' },
    { name: 'unordered' },
  ])
  .fuzzy('text', 'physics')
  .build();
// text="quantum" prox/unit=word/distance<=1/unordered text="physics"
```

### Sorting

**Multi-field sorting:**
```javascript
const query = new CQLBuilder()
  .equal('department', 'history')
  .sortByMultiple([
    { field: 'year', order: 'desc' },
    { field: 'title', order: 'asc' }
  ])
  .build();
// department=="history" sortBy year/sort.descending title/sort.ascending
```

### Advanced Examples

**Complex query:**
```javascript
const query = new CQLBuilder()
  .group(g => g
    .contains('title', 'war peace')
    .or()
    .contains('title', 'crime punishment')
  )
  .and()
  .group(g => g
    .equal('language', 'eng')
    .or()
    .equal('language', 'fr')
  )
  .and()
  .fuzzy('status', 'available')
  .sortBy('publicationDate', 'desc')
  .build();
```


## .and() Method Behavior

The `.and()` method is optional in most cases, as the builder automatically adds AND between conditions:

```javascript
// These two variants produce identical results
const q1 = new CQLBuilder()
  .equal('a', 1)
  .and() // explicit AND
  .equal('b', 2)
  .build();

const q2 = new CQLBuilder()
  .equal('a', 1)
  .equal('b', 2) // AND added automatically
  .build();
  
// Both queries: a==1 AND b==2
```

**When to use explicit .and():**
1. When you need to separate conditions visually in your code
2. When building conditions dynamically in loops
3. When combining with .not() operator

## API Reference

| Method | Description | Example |
|--------|-------------|---------|
| `.equal(field, value, opts?)` | Exact match | `title=="Book"` |
| `.fuzzy(field, value, opts?)` | Fuzzy match | `title="Book*"` |
| `.contains(field, value, opts?)` | Contains all terms | `subject all "science physics"` |
| `.group(callback)` | Logical grouping | `(a==1 OR b==2)` |
| `.booleanModifier(name, value?, symbol?)` | Queue modifier for next boolean op | `.booleanModifier('unit', 'word').and()` |
| `.booleanModifiers(mods[])` | Queue multiple boolean modifiers | — |
| `.relationModifier(name, value?)` | Queue relation modifier for next clause | `=/@type=book` |
| `.relationModifiers(mods[])` | Queue multiple relation modifiers | — |
| `.prox(mods[]?)` | Proximity operator | `term1 prox/unit=word term2` |
| `.sortByMultiple(specs[])` | Multi-field sorting | `sortBy year/sort.descending title/sort.ascending` |

## Best Practices

1. **Chain methods fluently** for readability
2. **Use groups** for complex boolean logic
3. **Prefer automatic AND** for simple queries
4. **Apply modifiers** for advanced array searching
