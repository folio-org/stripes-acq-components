# Holdings Abandonment Strategies

This document describes all strategies for determining when a holding becomes abandoned after entity removal.

## Core Concepts

**Abandoned Holding** - A holding is considered abandoned when it has no remaining connections to:
- PO Lines
- Pieces
- Items

**Closure** - The set of all entities that are considered for removal analysis.

---

## PO_LINE Strategy

### Key Rules

1. **Synchronized Lines (checkinItems=false)**:
   - Removing the line automatically removes its pieces and items
   - Check if any entities remain after removal

2. **Independent Lines (checkinItems=true)**:
   - Removing the line removes its pieces
   - Items are NOT removed (they can exist independently without pieces)
   - Check if any entities remain (items may remain even when pieces are removed)

3. **Mixed Scenarios**:
   - Different lines in the same holding can have different `checkinItems` values
   - Each line is processed according to its own type

### Decision Matrix

| Scenario | Pieces Remain | Items Remain | PO Lines Remain | Result |
|----------|---------------|--------------|-----------------|---------|
| All entities removed | No | No | No | **Abandoned** |
| Some pieces remain | Yes | - | - | **Not Abandoned** |
| Some items remain | - | Yes | - | **Not Abandoned** |
| Some PO lines remain | - | - | Yes | **Not Abandoned** |
| Independent items remain | No | Yes | No | **Not Abandoned** |

---

## Test Cases and Examples

### PO_LINE Strategy Cases

#### Case 1: Single Synchronized Line - Complete Removal
```javascript
// Setup
holding: 'H-1'
PO Line: 'POL-1' (checkinItems=false, synchronized)
Pieces: ['P-1', 'P-2'] (belong to POL-1)
Items: ['I-1', 'I-2'] (belong to pieces)

// Action: Remove POL-1
ids: ['POL-1']

// Expected Result
abandoned: true

// Explanation:
// POL-1 is synchronized → P-1, P-2, I-1, I-2 are auto-removed
// No entities remain → ABANDONED
```

#### Case 2: Single Independent Line - Items Remain
```javascript
// Setup
holding: 'H-1'
PO Line: 'POL-1' (checkinItems=true, independent)
Pieces: ['P-1', 'P-2'] (belong to POL-1)
Items: ['I-1', 'I-2'] (belong to pieces)

// Action: Remove POL-1
ids: ['POL-1']

// Expected Result
abandoned: false

// Explanation:
// POL-1 is independent → P-1, P-2 REMOVED, but I-1, I-2 STAY
// Items remain (can exist without pieces) → NOT ABANDONED
```

#### Case 3: Multiple Lines - Remove Synchronized Only
```javascript
// Setup
holding: 'H-1'
PO Lines: 
  - 'POL-1' (checkinItems=false, synchronized)
  - 'POL-2' (checkinItems=true, independent)
Pieces: 
  - ['P-1', 'P-2'] (belong to POL-1)
  - ['P-3', 'P-4'] (belong to POL-2)
Items: ['I-1', 'I-2', 'I-3', 'I-4']

// Action: Remove POL-1
ids: ['POL-1']

// Expected Result
abandoned: false

// Explanation:
// POL-1 is synchronized → P-1, P-2 removed
// POL-2 remains → P-3, P-4 remain
// POL-2 still connects holding → NOT ABANDONED
```

#### Case 4: Multiple Lines - Remove Independent Only
```javascript
// Setup
holding: 'H-1'
PO Lines:
  - 'POL-1' (checkinItems=false, synchronized)
  - 'POL-2' (checkinItems=true, independent)
Pieces:
  - ['P-1', 'P-2'] (belong to POL-1)
  - ['P-3', 'P-4'] (belong to POL-2)
Items: ['I-3', 'I-4'] (belong to P-3, P-4)

// Action: Remove POL-2
ids: ['POL-2']

// Expected Result
abandoned: false

// Explanation:
// POL-2 is independent → P-3, P-4 REMOVED, but I-3, I-4 STAY
// POL-1 remains with P-1, P-2
// Items and POL-1 with pieces remain → NOT ABANDONED
```

#### Case 5: Multiple Lines - Remove All Synchronized and Independent
```javascript
// Setup
holding: 'H-1'
PO Lines:
  - 'POL-1' (checkinItems=false, synchronized)
  - 'POL-2' (checkinItems=true, independent)
Pieces:
  - ['P-1'] (belongs to POL-1)
  - ['P-2'] (belongs to POL-2)
Items:
  - ['I-1'] (belongs to P-1)
  - ['I-2'] (belongs to P-2)

// Action: Remove POL-1 and POL-2
ids: ['POL-1', 'POL-2']

// Expected Result
abandoned: false

// Explanation:
// POL-1 is synchronized → P-1, I-1 removed
// POL-2 is independent → P-2 removed, but I-2 STAYS
// I-2 remains → NOT ABANDONED
```

#### Case 6: Only Independent Lines - Remove All
```javascript
// Setup
holding: 'H-1'
PO Lines:
  - 'POL-1' (checkinItems=true, independent)
  - 'POL-2' (checkinItems=true, independent)
Pieces:
  - ['P-1'] (belongs to POL-1)
  - ['P-2'] (belongs to POL-2)
Items:
  - ['I-1'] (belongs to P-1)
  - ['I-2'] (belongs to P-2)

// Action: Remove all lines
ids: ['POL-1', 'POL-2']

// Expected Result
abandoned: false

// Explanation:
// POL-1 is independent → P-1 removed, but I-1 STAYS
// POL-2 is independent → P-2 removed, but I-2 STAYS
// All PO Lines and pieces removed, but items remain → NOT ABANDONED
```

#### Case 7: Only Synchronized Lines - Remove All
```javascript
// Setup
holding: 'H-1'
PO Lines:
  - 'POL-1' (checkinItems=false, synchronized)
  - 'POL-2' (checkinItems=false, synchronized)
Pieces:
  - ['P-1'] (belongs to POL-1)
  - ['P-2'] (belongs to POL-2)

// Action: Remove all lines
ids: ['POL-1', 'POL-2']

// Expected Result
abandoned: true

// Explanation:
// POL-1 is synchronized → P-1 removed
// POL-2 is synchronized → P-2 removed
// No entities remain → ABANDONED
```

#### Case 8: Mixed Lines - One Synchronized Remains
```javascript
// Setup
holding: 'H-1'
PO Lines:
  - 'POL-1' (checkinItems=false, synchronized)
  - 'POL-2' (checkinItems=false, synchronized)
  - 'POL-3' (checkinItems=true, independent)
Pieces:
  - ['P-1'] (belongs to POL-1)
  - ['P-2'] (belongs to POL-2)
  - ['P-3'] (belongs to POL-3)
Items:
  - ['I-1'] (belongs to P-1)
  - ['I-2'] (belongs to P-2)
  - ['I-3'] (belongs to P-3)

// Action: Remove POL-1 and POL-3
ids: ['POL-1', 'POL-3']

// Expected Result
abandoned: false

// Explanation:
// POL-1 is synchronized → P-1, I-1 removed
// POL-3 is independent → P-3 removed, but I-3 STAYS
// POL-2 remains with P-2, I-2
// POL-2 with P-2, I-2, I-3 remain → NOT ABANDONED
```

#### Case 9: Empty Holding
```javascript
// Setup
holding: 'H-1'
PO Lines: []
Pieces: []
Items: []

// Action: Remove nothing
ids: []

// Expected Result
abandoned: true

// Explanation:
// No entities exist → ABANDONED
```

#### Case 10: Line Without Pieces
```javascript
// Setup
holding: 'H-1'
PO Lines: ['POL-1'] (checkinItems=false, synchronized)
Pieces: []
Items: []

// Action: Remove POL-1
ids: ['POL-1']

// Expected Result
abandoned: true

// Explanation:
// POL-1 removed, no pieces/items exist
// No entities remain → ABANDONED
```

#### Case 11: Synchronized Line with Items Only (no pieces)
```javascript
// Setup
holding: 'H-1'
PO Lines: ['POL-1'] (checkinItems=false, synchronized)
Pieces: []
Items: ['I-1'] (linked to holding via purchase order)

// Action: Remove POL-1
ids: ['POL-1']

// Expected Result
abandoned: true

// Explanation:
// POL-1 is synchronized → associated items removed
// No entities remain → ABANDONED
```

#### Case 12: Unopen Order with Independent Line - No Pieces, Items Remain
```javascript
// Setup
holding: 'H-1'
PO Order: 'PO-1' (status: open)
PO Line: 'POL-1' (checkinItems=true, independent, belongs to PO-1)
Pieces: [] (no pieces attached to POL-1)
Items: ['I-1', 'I-2'] (standalone items in holding, independent of line)

// Action: Unopen the order (PO-1)
// Independent line has no pieces, so nothing to remove
ids: ['POL-1']

// Expected Result
abandoned: false

// Explanation:
// POL-1 is independent receiving line
// POL-1 has no pieces attached (line is empty)
// When unopening the order, nothing is removed from closure
// I-1, I-2 REMAIN (independent items persist)
// Items remain in holding → NOT ABANDONED
// 
// Real-world scenario:
// Order was created with independent receiving
// PO Line was added but items were never received through it
// Items exist in holding independently
// Unopening the empty line doesn't affect holding status
// Holding retains connection via items
```

#### Case 13: Unopen Order with Synchronized Line - All Removed
```javascript
// Setup
holding: 'H-1'
PO Order: 'PO-1' (status: open)
PO Line: 'POL-1' (checkinItems=false, synchronized, belongs to PO-1)
Pieces: ['P-1', 'P-2'] (belong to POL-1)
Items: ['I-1', 'I-2'] (belong to pieces)

// Action: Unopen the order (PO-1)
// Synchronized receiving removes all related pieces and items
ids: ['POL-1']

// Expected Result
abandoned: true

// Explanation:
// POL-1 is synchronized receiving line
// When unopening the order, synchronized connection is removed
// P-1, P-2 REMOVED (pieces are tied to line)
// I-1, I-2 REMOVED (items are tied to pieces)
// No entities remain → ABANDONED
// 
// Real-world scenario:
// Order was created with synchronized receiving
// Unopening the order severs the receiving relationship
// Items cannot exist independently in this workflow
// Holding loses all purchasing connections
// 
// Key Difference from Independent:
// Independent: Unopening preserves pieces and items (can reconnect later)
// Synchronized: Unopening removes pieces and items (one-time receiving)
```

---

## PIECE Strategy

### Key Rules

1. **Direct Removal**: Only the specified pieces are removed/changed holdings
2. **Associated Items**: Items linked to removed pieces are also removed
3. **PO Line Handling**:
   - **Synchronized lines (checkinItems=false)**: PO Line connection cleared if NO other pieces remain from that line
   - **Independent lines (checkinItems=true)**: PO Line connection is **ALWAYS PRESERVED** - holding stays connected even when all pieces removed
4. **Abandonment**: Holding is abandoned when NO pieces, items, OR PO lines remain
5. **Independent Lines Protect Holding**: If any independent PO lines exist, holding is NOT abandoned

### Decision Matrix

| Scenario | Remaining Pieces | Remaining Items | Remaining PO Lines (Sync) | Remaining PO Lines (Independent) | Result |
|----------|------------------|-----------------|------------------------|-------------------------------|------|
| All removed, no independent lines | 0 | 0 | 0 | 0 | **Abandoned** |
| Some pieces remain | >0 | - | - | - | **Not Abandoned** |
| Some items remain | 0 | >0 | 0 | - | **Not Abandoned** |
| Some PO lines (sync) remain | >0 | - | >0 | - | **Not Abandoned** |
| Independent line exists | 0 | 0 | 0 | >0 | **Not Abandoned** |
| Items + independent line | 0 | >0 | 0 | >0 | **Not Abandoned** |

---

## Test Cases and Examples

### PIECE Strategy Cases

#### Case 1: Remove All Pieces - Holding Becomes Empty
```javascript
// Setup
holding: 'H-1'
Pieces: ['P-1', 'P-2']
Items: ['I-1', 'I-2']
PO Lines: ['POL-1']

// Action: Remove all pieces
ids: ['P-1', 'P-2']

// Expected Result
abandoned: true

// Explanation:
// P-1, P-2 removed → I-1, I-2 removed
// POL-1 in closure (no pieces remain for it)
// No entities remain → ABANDONED
```

#### Case 2: Remove Some Pieces - Others Remain
```javascript
// Setup
holding: 'H-1'
Pieces: ['P-1', 'P-2', 'P-3']
Items: ['I-1', 'I-2', 'I-3']
PO Lines: ['POL-1']

// Action: Remove P-1
ids: ['P-1']

// Expected Result
abandoned: false

// Explanation:
// P-1, I-1 removed
// P-2, P-3, I-2, I-3 remain
// Pieces remain → NOT ABANDONED
```

#### Case 3: Remove Pieces from Multiple Lines
```javascript
// Setup
holding: 'H-1'
Pieces:
  - ['P-1', 'P-2'] (belong to POL-1)
  - ['P-3'] (belongs to POL-2)
Items: ['I-1', 'I-2', 'I-3']
PO Lines: ['POL-1', 'POL-2']

// Action: Remove P-1, P-2
ids: ['P-1', 'P-2']

// Expected Result
abandoned: false

// Explanation:
// P-1, P-2, I-1, I-2 removed
// P-3, I-3, POL-2 remain
// Pieces and PO Line remain → NOT ABANDONED
```

#### Case 4: Remove All Pieces - PO Line Has No Pieces Left
```javascript
// Setup
holding: 'H-1'
Pieces: ['P-1'] (belongs to POL-1)
Items: ['I-1']
PO Lines: ['POL-1']

// Action: Remove P-1
ids: ['P-1']

// Expected Result
abandoned: true

// Explanation:
// P-1, I-1 removed
// POL-1 in closure (no pieces remain)
// No entities remain → ABANDONED
```

#### Case 5: Empty Holding
```javascript
// Setup
holding: 'H-1'
Pieces: []
Items: []
PO Lines: []

// Action: Remove nothing
ids: []

// Expected Result
abandoned: true

// Explanation:
// No entities exist → ABANDONED
```

#### Case 6: Piece Without Items
```javascript
// Setup
holding: 'H-1'
Pieces: ['P-1']
Items: []
PO Lines: ['POL-1']

// Action: Remove P-1
ids: ['P-1']

// Expected Result
abandoned: true

// Explanation:
// P-1 removed
// No items exist
// POL-1 in closure
// No entities remain → ABANDONED
```

#### Case 7: Multiple Holdings - Different Results
```javascript
// Setup
Holdings:
  H-1: Pieces=['P-1'], POL-1
  H-2: Pieces=['P-2', 'P-3'], POL-2

// Action: Remove P-1 and P-2
ids: ['P-1', 'P-2']

// Expected Results
H-1: abandoned: true  (all pieces removed)
H-2: abandoned: false (P-3 remains)

// Explanation:
// H-1: P-1 removed, no pieces remain → ABANDONED
// H-2: P-2 removed, P-3 remains → NOT ABANDONED
```

#### Case 8: Remove All Pieces - Independent Line Preserves Holding
```javascript
// Setup
holding: 'H-1'
Pieces: ['P-1'] (belongs to POL-1)
Items: ['I-1']
PO Lines:
  - 'POL-1' (checkinItems=true, independent)

// Action: Remove P-1
ids: ['P-1']

// Expected Result
abandoned: false

// Explanation:
// P-1, I-1 removed
// POL-1 is INDEPENDENT line → connection PRESERVED
// Independent PO Line remains → NOT ABANDONED
//
// Key behavior:
// Even though all pieces and items removed,
// independent line keeps holding alive for potential future pieces
```

#### Case 9: Remove Pieces - Independent Line with Other Synchronized Line
```javascript
// Setup
holding: 'H-1'
Pieces:
  - ['P-1'] (belongs to POL-1, synchronized)
  - ['P-2'] (belongs to POL-2, independent)
Items: ['I-1', 'I-2']
PO Lines:
  - 'POL-1' (checkinItems=false, synchronized)
  - 'POL-2' (checkinItems=true, independent)

// Action: Remove P-1
ids: ['P-1']

// Expected Result
abandoned: false

// Explanation:
// P-1, I-1 removed
// P-2, I-2, POL-2 (independent) remain
// Independent line ensures holding NOT ABANDONED
```

#### Case 10: Remove All Pieces - Only Independent Lines in Holding
```javascript
// Setup
holding: 'H-1'
Pieces:
  - ['P-1'] (belongs to POL-1, independent)
  - ['P-2'] (belongs to POL-2, independent)
Items: ['I-1', 'I-2']
PO Lines:
  - 'POL-1' (checkinItems=true, independent)
  - 'POL-2' (checkinItems=true, independent)

// Action: Remove P-1 and P-2
ids: ['P-1', 'P-2']

// Expected Result
abandoned: false

// Explanation:
// P-1, P-2, I-1, I-2 removed
// POL-1, POL-2 (both independent) REMAIN
// Independent lines preserve holding → NOT ABANDONED
//
// Use case:
// Pieces were received through independent receiving
// Pieces and items deleted but order lines stay alive
// Future pieces can be received on the same lines
// Holding retains purchasing connection
```

---

## Strategy Comparison

| Aspect | PO_LINE Strategy | PIECE Strategy |
|--------|------------------|----------------|
| **Input** | PO Line IDs | Piece IDs |
| **Removal Behavior** | Depends on `checkinItems` | Direct piece removal |
| **Cascade to Items** | Yes (for synchronized) | Yes (always) |
| **Independent Line Impact** | Preserves items | Preserves PO Line connection |
| **checkinItems Impact** | Controls entity removal | Controls PO Line preservation |
| **Complexity** | High (two workflows) | Medium (respects line type) |

---

## Usage Examples

### Basic Usage
```javascript
const analyzer = new HoldingsAbandonmentAnalyzer({
  pieces,
  items,
  poLines
});

// Using PO_LINE strategy
const results = analyzer.analyze({
  strategy: 'PO_LINE',
  ids: ['po-line-1', 'po-line-2'],
  holdingIds: ['holding-1', 'holding-2']
});

// Using PIECE strategy
const results = analyzer.analyze({
  strategy: 'PIECE',
  ids: ['piece-1', 'piece-2'],
  holdingIds: ['holding-1']
});
```

### With Explanation
```javascript
const results = analyzer.analyze({
  strategy: 'PO_LINE',
  ids: ['po-line-1'],
  holdingIds: ['holding-1'],
  explain: true
});

// Result includes detailed breakdown
// {
//   id: 'holding-1',
//   abandoned: false,
//   explain: {
//     related: { pieces: [...], items: [...], poLines: [...] },
//     remaining: { pieces: [...], items: [...], poLines: [...] }
//   }
// }
```
