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

### Modifiers Usage

**AND-style modifiers search:**
```javascript
const query = new CQLBuilder()
  .andModifiersSearch('items', {
    location: 'main',
    status: 'available'
  }, 'science')
  .build();
// items =/@location=main/@status=available "science"
```

**OR-style modifiers:**
```javascript
const query = new CQLBuilder()
  .orModifiersSearch('contributors', ['author', 'editor'], 'Tolkien')
  .build();
// contributors =/@author/@editor "Tolkien"
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

**Proximity search:**
```javascript
const query = new CQLBuilder()
  .prox(3, 'sentence')
  .equal('text', 'quantum physics')
  .build();
// prox/sentence/3 text=="quantum physics"
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
| `.equal(field, value)` | Exact match | `title=="Book"` |
| `.fuzzy(field, value)` | Fuzzy match | `title="Book*"` |
| `.contains(field, value)` | Contains all terms | `subject all "science physics"` |
| `.group(callback)` | Logical grouping | `(a==1 OR b==2)` |
| `.andModifiersSearch()` | AND-style array search | `items =/@type=book/@loc=main "science"` |
| `.sortByMultiple()` | Multi-field sorting | `sortBy year/desc title/asc` |

## Best Practices

1. **Chain methods fluently** for readability
2. **Use groups** for complex boolean logic
3. **Prefer automatic AND** for simple queries
4. **Apply modifiers** for advanced array searching
