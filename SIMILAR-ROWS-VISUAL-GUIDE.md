# 🎯 Similar Rows Feature - Visual Guide

## 🏗️ Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  USER ENTERS FORECAST INPUTS                     │
│              (Bays=3, Diameter=4200, Height=18000)              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         CALCULATE PREDICTIONS (4 Models in Parallel)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ LINEAR   │  │  RIDGE   │  │  TREE    │  │   KNN    │        │
│  │ 45.23 MT │  │ 45.10 MT │  │ 44.80 MT │  │ 45.50 MT │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           FIND SIMILAR ROWS (NEW FEATURE ✨)                    │
│                                                                  │
│  1. Convert user input to vector:                               │
│     X_input = [3, 4200, 18000]                                  │
│                                                                  │
│  2. Calculate distance to each database row:                    │
│     dist(row_i) = √[(3-row_i[Bays])² + (4200-row_i[D])² + ...] │
│                                                                  │
│  3. Sort by distance (ascending)                                │
│                                                                  │
│  4. Return top 5 closest matches                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              DISPLAY BOTH RESULTS TO USER                       │
│                                                                  │
│  Predictions:              Similar Records:                     │
│  ┌──────────────────┐     ┌─────────────────────────────────┐  │
│  │ LINEAR: 45.23    │     │ Rank │ Dist │ Bays │ D    │ W  │  │
│  │ RIDGE:  45.10    │     │──────┼──────┼──────┼──────┼────│  │
│  │ TREE:   44.80    │     │ 1🎯  │ 0.12 │ 3    │ 4185 │45.2│  │
│  │ KNN:    45.50    │     │ 2    │ 0.45 │ 3    │ 4210 │45.5│  │
│  └──────────────────┘     │ 3    │ 0.78 │ 3    │ 4150 │44.9│  │
│                            │ 4    │ 1.23 │ 3    │ 4290 │45.8│  │
│                            │ 5    │ 1.56 │ 3    │ 4050 │45.1│  │
│                            └─────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Distance Calculation Example

### User Input
```
Diameter = 4200
Height = 18000
Pressure = 25
```

### Database Has 195 Rows

**Row 1:**
```
Diameter = 4185
Height = 17980
Pressure = 24
```

**Distance Calculation:**
```
distance = √[(4200-4185)² + (18000-17980)² + (25-24)²]
         = √[15² + 20² + 1²]
         = √[225 + 400 + 1]
         = √626
         = 25.02
```

(Normalized in feature space: 0.12)

---

**Row 50:**
```
Diameter = 4000
Height = 17500
Pressure = 20
```

**Distance Calculation:**
```
distance = √[(4200-4000)² + (18000-17500)² + (25-20)²]
         = √[200² + 500² + 5²]
         = √[40000 + 250000 + 25]
         = √290025
         = 538.54
```

(Normalized: 2.74 - Much farther!)

---

## 📊 Distance Visualization

### Feature Space (3D: Diameter × Height × Pressure)

```
                  Height
                    ▲
                    │
        18000       │  ●  Row 1 (Similar)
                    │  ⊗ User Input
                    │  ●  Row 2
                    │
        17500       │              ●  Row 50 (Far)
                    │
                    │
        17000       │
                    │
                    └──────────────────────────► Diameter
                        4000   4200   4400
```

**Visual:**
```
✓ Row 1 is very close to user input (distance ≈ 0.12)
✗ Row 50 is far from user input (distance ≈ 2.74)
```

---

## 🎯 Interpretation Guide

### What Does Distance Mean?

| Metric | Name | Meaning |
|--------|------|---------|
| **0.0** | Perfect Match | Identical to input |
| **0.1 - 0.5** | Very Similar | Closest records in database |
| **0.5 - 1.5** | Quite Similar | Still pretty close |
| **1.5 - 3.0** | Moderately Similar | In same general area |
| **3.0 - 5.0** | Somewhat Similar | Different but same scale |
| **> 5.0** | Dissimilar | Extrapolating outside data |

---

## 📈 Use Cases

### Use Case 1: Validate Prediction

```
Your Prediction:  Weight = 45.23 MT
Rank 1 (similar): Weight = 45.20 MT  ✅ Match!
Rank 2 (similar): Weight = 45.50 MT  ✅ Close!

Conclusion: Prediction is GOOD ✓
```

### Use Case 2: Find Outlier

```
Your Input:      Diameter = 6000, Height = 25000
Rank 1 (similar): Distance = 4.56  ⚠️ VERY FAR!
Rank 2 (similar): Distance = 4.89
Rank 3 (similar): Distance = 5.12

Conclusion: Input is UNUSUAL ✗ Low confidence
```

### Use Case 3: Debug Model Disagreement

```
Model Predictions:
LINEAR:  42.10 MT
RIDGE:   42.05 MT
TREE:    48.50 MT  ← Different!
KNN:     42.30 MT

Rank 1 Similar Record: Weight = 42.15 MT

Conclusion: TREE is probably wrong for this input
            TREE doesn't generalize well here
```

### Use Case 4: Estimate Trend

```
Rank 1 (D=4200, H=18000): Weight = 45.2
Rank 2 (D=4210, H=18050): Weight = 45.5
Rank 3 (D=4150, H=17850): Weight = 44.9

Pattern: Similar inputs → Similar outputs ✓
Consistency: High confidence in prediction ✓
```

---

## 🔧 How Similar Rows Are Found

### Step 1: Prepare Input Vector

```python
user_input = [3, 4200, 18000]  # [Bays, Diameter, Height]
```

### Step 2: For Each Database Row

```python
for each row in database:
    if row has valid values for all X columns:
        distance = euclidean_distance(user_input, row)
```

### Step 3: Sort by Distance

```python
distances_with_rows = [
    {distance: 0.12, row: {...}},  # Rank 1
    {distance: 0.45, row: {...}},  # Rank 2
    {distance: 0.78, row: {...}},  # Rank 3
    {distance: 1.23, row: {...}},  # Rank 4
    {distance: 1.56, row: {...}},  # Rank 5
    ...
]

top_5 = sort(distances_with_rows)[:5]
```

### Step 4: Display

```python
Display predictions + similar_rows table
```

---

## 💡 Confidence Score (Derived from Distance)

You can calculate confidence based on distance:

```javascript
function calculateConfidence(distance) {
  if (distance < 0.5) return "Very High ✓✓✓";
  if (distance < 1.0) return "High ✓✓";
  if (distance < 2.0) return "Medium ✓";
  if (distance < 3.0) return "Low ✗";
  return "Very Low ✗✗";
}

// Examples:
calculateConfidence(0.12);  // "Very High ✓✓✓"
calculateConfidence(0.95);  // "High ✓✓"
calculateConfidence(1.85);  // "Medium ✓"
calculateConfidence(2.50);  // "Low ✗"
calculateConfidence(5.00);  // "Very Low ✗✗"
```

---

## 🎨 UI/UX Layout

### Before Similar Rows Feature

```
┌─────────────────────────────────────────┐
│         FORECAST TAB                    │
├─────────────────────────────────────────┤
│                                         │
│  Prediction Inputs:                     │
│  ┌─────────────────────────────────┐   │
│  │ Bays: [3]                       │   │
│  │ Diameter: [4200]                │   │
│  │ Height: [18000]                 │   │
│  │                                 │   │
│  │ [Forecast Button]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Predictions:                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 45.2 │ │ 45.1 │ │ 44.8 │ │ 45.5 │  │
│  │ LIN  │ │ RIDGE│ │ TREE │ │ KNN  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### After Similar Rows Feature ✨

```
┌─────────────────────────────────────────────────────┐
│         FORECAST TAB (ENHANCED)                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Prediction Inputs:                                 │
│  ┌──────────────────────────┐                       │
│  │ Bays: [3]                │                       │
│  │ Diameter: [4200]         │                       │
│  │ Height: [18000]          │                       │
│  │ [Forecast Button]        │                       │
│  └──────────────────────────┘                       │
│                                                     │
│  Predictions:                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ 45.2 │ │ 45.1 │ │ 44.8 │ │ 45.5 │              │
│  │ LIN  │ │ RIDGE│ │ TREE │ │ KNN  │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  ✨ Similar Records from Database (Top 5) ✨       │
│  ┌────┬────────┬──────┬──────────┬────────┬──────┐ │
│  │Rank│Distance│ Bays │ Diameter │ Height │Weight│ │
│  ├────┼────────┼──────┼──────────┼────────┼──────┤ │
│  │ 1🎯│ 0.12   │  3   │  4185    │ 17980  │ 45.2 │ │
│  │ 2  │ 0.45   │  3   │  4210    │ 18050  │ 45.5 │ │
│  │ 3  │ 0.78   │  3   │  4150    │ 17850  │ 44.9 │ │
│  │ 4  │ 1.23   │  3   │  4290    │ 18120  │ 45.8 │ │
│  │ 5  │ 1.56   │  3   │  4050    │ 17700  │ 45.1 │ │
│  └────┴────────┴──────┴──────────┴────────┴──────┘ │
│                                                     │
│  💡 Distance = How different from your inputs      │
│  🎯 Rank 1 = Closest match in database             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Performance Characteristics

### Time Complexity

```
N = Number of rows
D = Number of input features

For each forecast:
- Distance calculation: O(N × D)
- Sorting top 5: O(N × log(N))
- Total: O(N × D) ≈ Linear time

Expected times:
- 100 rows × 3 features: < 1ms
- 1,000 rows × 3 features: < 5ms
- 10,000 rows × 3 features: < 50ms
- 100,000 rows × 3 features: < 500ms
```

### Space Complexity

```
Memory for similar rows data:
- 5 rows × ~100 bytes per row ≈ 500 bytes
- Very small compared to full dataset
```

---

## 🔄 Integration with Existing Features

### Works With:

✅ **Any CSV file** - All files supported
✅ **Any columns** - Works with any X/Y selections
✅ **All 4 models** - Linear, Ridge, Tree, KNN
✅ **Single or multi-output** - Works with any Y count
✅ **Export feature** - Similar rows included in JSON export

### Doesn't Break:

✅ Training process
✅ Prediction accuracy
✅ Feature importance
✅ Metrics calculations
✅ Existing UI

---

## 📝 Example: Complete Workflow

### Step 1: Upload Data
```
example_vessels.csv
195 rows
8 columns: Bays, Diameter, Height, Pressure, Material, Weight, TestWt, FabWt
```

### Step 2: Select Variables
```
X (Inputs):  Bays, Diameter, Height
Y (Outputs): Weight
```

### Step 3: Train Models
```
Training Linear...  ✓
Training Ridge...   ✓
Training Tree...    ✓
Training KNN...     ✓

Results:
LINEAR:  RMSE=78, MAE=52, R²=0.82
RIDGE:   RMSE=77, MAE=51, R²=0.83
TREE:    RMSE=2.9, MAE=2.1, R²=0.96
KNN:     RMSE=5.2, MAE=3.6, R²=0.86
```

### Step 4: Enter Forecast Inputs
```
Bays:     3
Diameter: 4200
Height:   18000
```

### Step 5: Get Predictions + Similar Records
```
Predictions:
LINEAR:  45.23 MT
RIDGE:   45.10 MT
TREE:    44.80 MT ← Tree is best model (R²=0.96)
KNN:     45.50 MT

Similar Records:
Rank 1: Distance=0.12, Weight=45.2 ✓ Matches prediction!
Rank 2: Distance=0.45, Weight=45.5
Rank 3: Distance=0.78, Weight=44.9
Rank 4: Distance=1.23, Weight=45.8
Rank 5: Distance=1.56, Weight=45.1

Confidence: VERY HIGH ✓✓✓
- Distance very low (0.12)
- Similar records match predictions
- Tree model has best R²
- Interpolating within data range
```

### Step 6: Make Decision
```
✓ Forecast Weight ≈ 45 MT with HIGH CONFIDENCE
✓ Can proceed with manufacturing/planning
✓ If needed, validate against Rank 1 record (45.2)
```

---

## 🎁 Bonus Features Coming

With this foundation, you could add:

1. **Confidence Score**
   ```
   Low confidence if distance > 2.0
   ```

2. **Anomaly Detection**
   ```
   Alert if distance > 3.0 (extrapolating)
   ```

3. **Cluster Analysis**
   ```
   Show which cluster input belongs to
   ```

4. **Trend Analysis**
   ```
   Show trend of similar records' outputs
   ```

5. **Data Gap Detection**
   ```
   Alert if no similar records exist
   ```

---

## ✅ Summary

**Similar Rows Feature provides:**

1. 📊 **Transparency** - See what the model learned from
2. ✅ **Validation** - Compare predictions to real data
3. 🎯 **Confidence** - Know if you're interpolating or extrapolating
4. 🔍 **Context** - Understand similar historical cases
5. 🎓 **Learning** - Discover patterns in your data

**Key Metric:** Distance
- Use it to judge prediction confidence
- Lower = more similar = higher confidence
- > 3.0 = risky extrapolation

---

**Ready to deploy?** See `DEPLOY-SIMILAR-ROWS.md` 🚀
