# Universal Forecaster - Technical Documentation

## Algorithm Details

### 1. Linear Regression

**Formula**: `y = b + w₁x₁ + w₂x₂ + ... + wₙxₙ`

**Implementation**: Gradient Descent
```javascript
function linearRegression(X, y) {
  const n = X.length;
  const d = X[0].length;
  let w = new Array(d).fill(0);
  let b = mean(y);
  const lr = 0.01;  // Learning rate
  
  for (let epoch = 0; epoch < 100; epoch++) {
    for (let i = 0; i < n; i++) {
      let pred = b + sum(w * X[i]);
      let error = pred - y[i];
      // Update weights and bias
      w -= lr * (error * X[i]) / n;
      b -= lr * error / n;
    }
  }
  return { w, b };
}
```

**Advantages**:
- Fast to train
- Interpretable (each weight shows feature impact)
- Good baseline
- Works well with linear data

**Disadvantages**:
- Only captures linear relationships
- Sensitive to outliers
- Requires scaled features

**Best For**: Simple, linear problems with few features

---

### 2. Ridge Regression

**Formula**: `minimize(MSE + λ * sum(w²))`

**Key Difference from Linear**: Adds penalty term for large weights

```javascript
function ridgeRegression(X, y, lambda = 0.08) {
  // Same as linear regression, but with penalty:
  w -= lr * (gradW[j] + (lambda * w[j]) / n);
}
```

**Regularization Parameter (λ)**:
- λ = 0: Becomes Linear Regression
- λ = 0.08: Default (good balance)
- λ → ∞: All weights → 0

**Advantages**:
- Reduces overfitting
- Handles correlated features
- More stable than linear regression

**Disadvantages**:
- Shrinks all weights (loses some information)
- Still assumes linear relationship

**Best For**: Noisy data, highly correlated features, small datasets

---

### 3. Decision Tree Regressor

**Algorithm**: Recursive binary splitting using greedy information gain

```javascript
function buildTree(indices, depth) {
  if (depth >= maxDepth || indices.length < 4) {
    return { isLeaf: true, value: mean(y[indices]) };
  }
  
  // Find best feature/split combination
  let bestGain = 0, bestFeature, bestSplit;
  for (let feature = 0; feature < d; feature++) {
    for (let splitVal in sortedValues[feature]) {
      let left = indices.filter(i => X[i][feature] < splitVal);
      let right = indices.filter(i => X[i][feature] >= splitVal);
      
      // Calculate gain (reduction in variance)
      let gain = calculateGain(left, right);
      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
        bestSplit = splitVal;
      }
    }
  }
  
  // Recursively build left and right subtrees
  return {
    feature: bestFeature,
    split: bestSplit,
    left: buildTree(leftIndices, depth + 1),
    right: buildTree(rightIndices, depth + 1)
  };
}
```

**Parameters**:
- `maxDepth = 5`: Prevents overfitting
- Min samples = 4: Stops at small groups

**Advantages**:
- Non-linear relationships
- Captures feature interactions
- Handles categorical/numeric mix
- Interpretable (can visualize tree)

**Disadvantages**:
- Prone to overfitting (even with depth limit)
- Can create step-wise predictions
- Unstable (small data changes = big tree changes)

**Best For**: Non-linear patterns, feature interactions, medium datasets

---

### 4. K-Nearest Neighbors (KNN)

**Algorithm**: Weighted average of k nearest neighbors

```javascript
function predictKnn(model, x, k = 5) {
  // Calculate distance to all training points
  let distances = model.X.map((xi, i) => ({
    distance: euclidean(xi, x),
    y: model.y[i]
  }));
  
  // Sort and get k nearest
  distances.sort((a, b) => a.distance - b.distance);
  let neighbors = distances.slice(0, k);
  
  // Weighted average (closer = higher weight)
  let weightedSum = 0, weightSum = 0;
  for (let { distance, y } of neighbors) {
    let weight = 1 / (distance + 0.001);  // Avoid division by zero
    weightedSum += weight * y;
    weightSum += weight;
  }
  
  return weightedSum / weightSum;
}
```

**Parameters**:
- `k = 5`: Number of neighbors to consider
- Distance metric: Euclidean

**Advantages**:
- Non-parametric (no assumptions)
- Can capture complex patterns
- Intuitive

**Disadvantages**:
- Slow to predict (checks all training points)
- Sensitive to scale (needs normalization)
- Needs lots of data to generalize
- Poor with high-dimensional data

**Best For**: Local patterns, small-medium datasets, non-linear relationships

---

## Data Flow

```
┌─────────────────┐
│  CSV/XLSX File  │
└────────┬────────┘
         │ Papa.parse()
         ▼
┌─────────────────────┐
│  Array of Objects   │
│  [{ col: val }, ...] │
└────────┬────────────┘
         │ Extract numeric columns
         ▼
┌─────────────────────┐
│   X matrix (n×d)    │  Input features
│   y vector (n,)     │  Target values
└────────┬────────────┘
         │ Train all models
         ▼
┌─────────────────────────────┐
│  Model Objects              │
│  { type, weights, params }  │
└────────┬────────────────────┘
         │ Evaluate on training data
         ▼
┌──────────────────────────┐
│  Metrics Results         │
│  { rmse, mae, r2, ...}   │
└────────┬─────────────────┘
         │ User enters new X values
         ▼
┌─────────────────────────────┐
│  Predictions from all       │
│  trained models             │
└─────────────────────────────┘
```

---

## Performance Optimization

### Training Speed
- Linear/Ridge: O(n×d×epochs) = O(n×d×100) ≈ 100ms for n=1000, d=10
- Tree: O(n×d×unique_values×depth) ≈ 500ms typical
- KNN: O(1) - just stores data

### Prediction Speed
- Linear/Ridge: O(d) ≈ <1μs per prediction
- Tree: O(depth) ≈ <1μs per prediction
- KNN: O(n×d) ≈ 1-10ms per prediction (checks all training points)

### Memory Usage
- All models stored in JavaScript
- ~100MB per 10,000 rows × 100 features
- KNN stores full training set (largest memory user)

---

## Accuracy Expectations

### RMSE Interpretation
```
RMSE = 5.2 units means:
- 68% of predictions within ±5.2 (1σ)
- 95% of predictions within ±10.4 (2σ)
```

### R² Interpretation
```
R² = 0.90 means:
- Model explains 90% of variance
- Model captures most relationships
- Still 10% unexplained (noise, missing features)

Guidelines:
- R² > 0.9  : Excellent fit
- R² 0.8-0.9: Good fit
- R² 0.6-0.8: Fair, acceptable
- R² 0.4-0.6: Weak, questionable
- R² < 0.4  : Poor, model may not be useful
```

---

## Feature Scaling

Applied internally before training:

```javascript
function standardize(X) {
  const d = X[0].length;
  const means = Array(d).fill(0);
  const stds = Array(d).fill(0);
  
  // Calculate mean for each feature
  for (let j = 0; j < d; j++) {
    means[j] = mean(X.map(row => row[j]));
    stds[j] = std(X.map(row => row[j]));
  }
  
  // Normalize: (x - mean) / std
  return X.map(row =>
    row.map((val, j) => (val - means[j]) / stds[j])
  );
}
```

**Benefits**:
- All features on same scale (1-100 vs 0.01-1.5 treated fairly)
- Faster convergence for linear models
- Fairer feature comparison

---

## Cross-Validation (Future Enhancement)

Currently: Training on full dataset → evaluating on same data
Planned: K-Fold Cross-Validation → better generalization estimate

```javascript
function kFoldCV(X, y, k = 5) {
  const n = X.length;
  const folds = createFolds(n, k);
  const scores = [];
  
  for (let testFold of folds) {
    const trainData = X.filter((_, i) => !testFold.has(i));
    const testData = X.filter((_, i) => testFold.has(i));
    
    let model = train(trainData, testData);
    let preds = predict(model, testData);
    let metrics = evaluate(testData, preds);
    scores.push(metrics);
  }
  
  return {
    mean: mean(scores),
    std: std(scores)
  };
}
```

---

## Feature Importance (Future)

### For Trees
```
Importance = (Gain when split on feature) / (Total gains)
Higher gain = more important feature
```

### For Linear Models
```
Importance = |coefficient| * input_std / output_std
Larger coefficient = larger impact
```

### For KNN
```
Importance = Correlation with target
Measures linear relationship strength
```

---

## Handling Edge Cases

### Missing Values
- Automatically filtered during training
- Rows with any NaN excluded
- Logged but doesn't error

### Outliers
- Kept in training (models see them)
- May reduce accuracy slightly
- Tree model more robust to outliers
- Consider removing if >3 standard deviations

### Constant Features
- All values same → drops during training
- Caught and warned to user
- Doesn't cause errors

### Small Datasets
- Tree: May overfit with <50 samples
- KNN: K=5 requires ≥5 samples
- Linear: Works ok with any size
- Ridge: Better with small datasets

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ❌ No |

**Requirements**:
- ES6+ JavaScript
- FileReader API
- LocalStorage API
- Canvas (for charts via Recharts)

---

## Security & Privacy

### Data Handling
- All data stays in browser
- No server communication (except file serving)
- CSV never uploaded to cloud
- Training happens locally

### Export Format
- JSON only (no unencrypted passwords/keys)
- Model weights exported (not source data)
- Safe to share (no sensitive info exposed)

---

## Extending the Tool

### Adding a New Model

```javascript
// 1. Implement training function
function myModel(X, y, params = {}) {
  // ... training logic
  return { type: "mymodel", weights: ..., params: ... };
}

// 2. Implement prediction function
function predictMyModel(model, x) {
  // ... prediction logic
  return prediction;
}

// 3. Add to model loop in trainer
if (selectedModels.has("mymodel")) {
  models.mymodel = myModel(Xvalid, yvalid);
}

// 4. Add to prediction loop
else if (name === "mymodel") {
  preds[name] = predictMyModel(model, x);
}

// 5. Add to UI (MODEL_OPTIONS)
{ id: "mymodel", name: "My Model", desc: "My algorithm" }
```

---

## Debugging Tips

### Slow Training
- Check browser console for errors
- Verify data is numeric (not text)
- Try smaller dataset first (100 rows)
- Check RAM availability

### Bad Predictions
- Plot X vs Y manually (in Excel)
- Check for missing relationships
- Try adding derived features manually
- Increase training epochs

### Accuracy Metrics Weird
- Verify input/output columns correct
- Check for NaN/Infinity values
- Ensure sufficient data (>20 rows)
- Try different random seed

---

## References

### Papers
- Linear Regression: Gauss (1795)
- Ridge Regression: Hoerl & Kennard (1970)
- CART Trees: Breiman et al. (1984)
- KNN: Cover & Hart (1967)

### Online Resources
- [Scikit-Learn Regression Guide](https://scikit-learn.org/stable/modules/linear_model.html)
- [Fast.ai ML Course](https://course.fast.ai/)
- [StatQuest (YouTube)](https://www.youtube.com/c/joshstarmer)

---

**Version**: 1.0.0 | **Updated**: 2026
