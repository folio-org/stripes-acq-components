# CQL Query Builder

A complete implementation of CQL (Contextual Query Language) 1.2 specification with FOLIO-specific extensions.

## Installation

```javascript
import { CQLBuilder } from './CQLBuilder';
```

## Basic Usage

```javascript
const query = new CQLBuilder()
  .exact('title', '1984')
  .and()
  .fuzzy('author', 'Orwell*')
  .build();
// Returns: title=="1984" AND author="Orwell*"
```

## API Reference

### Basic Clauses

#### `.index(field: string)`
Sets the field name for scoped operations.

#### `.relation(operator: string)`
Sets the relation operator (=, ==, >, <, etc.).

#### `.value(value: string | number)`
Sets the value to compare against.

### Shorthand Methods

#### `.exact(field, value)`
Exact match using `==` operator.

#### `.fuzzy(field, value)`
Fuzzy match using `=` operator (supports wildcards).

#### `.contains(field, value)`
Contains all terms using `all` operator.

#### `.containsAny(field, value)`
Contains any term using `any` operator.

### Boolean Operators

#### `.and()`
Adds AND operator.

#### `.or()`
Adds OR operator.

#### `.not()`
Adds NOT operator.

### Advanced Features

#### `.prox(distance, unit = 'word')`
Proximity search.

#### `.group(callback)`
Groups conditions in parentheses.

#### `.sortBy(field, order = 'asc')`
Adds sorting specification.

#### `.modifier(name, value)`
Adds a modifier to the next condition.

#### `.specialOperator(field, prefix, suffix, value)`
Creates special operator syntax (e.g., =/@fundId).

### Building Queries

#### `.build()`
Returns the final CQL query string.

## Examples

### Complex Query
```javascript
const query = new CQLBuilder()
  .exact('status', 'active')
  .and()
  .group(b => b
    .contains('title', 'war peace')
    .or()
    .fuzzy('author', 'Tolstoy*')
  )
  .sortBy('createdDate', 'desc')
  .build();
```

### Special Operators
```javascript
const query = new CQLBuilder()
  .specialOperator('fundDistribution', '=', '@fundId', 'qwerty')
  .build();
// Returns: fundDistribution =@fundId "qwerty"
```
