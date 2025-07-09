# filter-and-sort

A flexible utility for filtering and sorting arrays of objects — ideal for lists, tables, search results, and admin interfaces.

---

## ✅ Features

- Rich filter operators (`equals`, `includes`, `gt`, `lt`, etc.)
- Supports `string`, `number`, `boolean`, `date`
- Full-text search across multiple fields (`searchIndexes`)
- Array filter values (OR-matching)
- Case-sensitive/insensitive filtering
- Custom filter and sort functions
- Stable, immutable sort

---

## ⚙️ Configuration

### `filtersConfig`

Describes how each filter field is mapped and compared:

```ts
filtersConfig: {
  [filterKey]: {
    field: string,                    // Path in object (supports dot notation)
    operator?: string,                // One of the supported operators (see below)
    type?: 'string' | 'number' | 'boolean' | 'date',
    caseSensitive?: boolean,          // For string comparisons (default: false)
    customFilter?: (itemValue, filterValue) => boolean,
  }
}
````

#### Supported Operators

| Operator                    | Description           | Types        |
| --------------------------- | --------------------- | ------------ |
| `equals`                    | Strict equality       | All types    |
| `includes`                  | Substring match       | string       |
| `startsWith`                | Prefix match          | string       |
| `endsWith`                  | Suffix match          | string       |
| `greaterThan`, `gt`         | Greater than          | number, date |
| `lessThan`, `lt`            | Less than             | number, date |
| `greaterThanOrEqual`, `gte` | Greater than or equal | number, date |
| `lessThanOrEqual`, `lte`    | Less than or equal    | number, date |

---

### `sortingConfig`

Describes sorting behavior per field:

```ts
sortingConfig: {
  [sortingKey]: {
    field: string,
    type?: 'string' | 'number' | 'date',     // Default: string
    direction?: 'ascending' | 'descending',  // Default: direction from filters
    customSort?: (a, b) => number,
  }
}
```

### 🔍 Full-text Search

```ts
keywordKey: 'search',                   // Key in activeFilters to trigger search
searchIndexes: ['customer.name', 'notes'], // Fields to search across
```

When the key (e.g. `search`) is present in `activeFilters`, a case-insensitive substring match will be applied to any of the listed fields.

## 🧪 Example: Orders Filtering

### Sample `items`:

```js
[
  {
    id: 'o-1001',
    status: 'open',
    total: 1500,
    createdAt: '2024-06-01T10:00:00Z',
    customer: { name: 'Alice Johnson' },
    notes: 'Urgent delivery'
  },
  {
    id: 'o-1002',
    status: 'closed',
    total: 700,
    createdAt: '2024-06-10T12:30:00Z',
    customer: { name: 'Bob Smith' },
    notes: 'Repeat order'
  },
  {
    id: 'o-1003',
    status: 'open',
    total: 200,
    createdAt: '2024-07-01T08:00:00Z',
    customer: { name: 'Charlie Kim' },
    notes: ''
  }
]
```

### Example `config`:

```js
{
  filtersConfig: {
    status: {
      field: 'status',
      operator: 'equals',
      type: 'string',
    },
    totalMin: {
      field: 'total',
      operator: 'greaterThanOrEqual',
      type: 'number',
    },
    createdBefore: {
      field: 'createdAt',
      operator: 'lessThan',
      type: 'date',
    },
    customer: {
      field: 'customer.name',
      operator: 'includes',
      type: 'string',
    },
  },
  sortingConfig: {
    total: {
      field: 'total',
      type: 'number',
    },
    createdAt: {
      field: 'createdAt',
      type: 'date',
    },
  },
  keywordKey: 'search',
  searchIndexes: ['customer.name', 'notes'],
}
```

### Example `activeFilters`:

```js
{
  status: 'open',
  totalMin: 300,
  customer: 'ali',
  search: 'urgent',
  sorting: 'createdAt',
  sortingDirection: 'descending',
}
```

### Result:

Returns only the first order (Alice Johnson), because:

* `status` is `'open'`
* `total >= 300`
* `customer.name` includes `'ali'`
* `notes` includes `'urgent'`
* Sorted by `createdAt DESC`


## 🧠 Tips

* Use `customFilter` or `customSort` for advanced control (e.g. fuzzy search, multi-field sort).
* The input array is never mutated.
* Fields not present in `filtersConfig` will be skipped silently.
