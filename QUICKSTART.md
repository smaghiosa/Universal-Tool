# Quick Start Guide - Universal Forecaster

## 🎯 Get Running in 5 Minutes

### 1️⃣ Install & Start
```bash
npm install
npm run dev
```
Opens http://localhost:5173 automatically

---

### 2️⃣ Load Example Data

**Option A: Vessel Weight Prediction**
- Click upload area → select `example_vessels.csv`
- Dataset: 195 historical pressure vessels

**Option B: Real Estate Price**
- Click upload area → select `example_realestate.csv`
- Dataset: 65 properties with features

---

### 3️⃣ Configure Your Model (Vessel Example)

**Go to Configure Tab:**

✅ **Input Variables (X)** - Select these:
- [ ] Tag
- [x] Diameter ← Check
- [x] Height ← Check
- [x] Pressure ← Check
- [x] Temperature ← Check

✅ **Output Variable (Y)** - Select one:
```
FabWeight  ← Pick this (fabrication weight)
```

✅ **Models** - Use all 4:
- [x] Linear Regression
- [x] Ridge Regression
- [x] Decision Tree
- [x] KNN

---

### 4️⃣ Train Models
Click **"Train Models"** button → Wait 1-2 seconds

---

### 5️⃣ View Results (Model Results Tab)

See a table:
```
Model          RMSE    MAE     R²
Linear         15.32   10.45   0.82
Ridge          14.89   10.12   0.84
Decision Tree  12.45   8.32    0.88 ← Best!
KNN            13.78   9.54    0.86
```

**What does this mean?**
- Decision Tree is best (lowest RMSE)
- R² = 0.88 means it explains 88% of weight variation
- Typical error ±12.45 MT

---

### 6️⃣ Make Predictions (Forecast Tab)

**Enter new vessel specs:**
```
Diameter:     2500  mm
Height:       8000  mm
Pressure:     25    kg/cm²
Temperature:  150   °C
```

**Click Forecast:**
```
Results:
  Linear:        45.2 MT
  Ridge:         47.8 MT
  Decision Tree: 44.5 MT ← Use this (best model)
  KNN:           46.3 MT
```

**Conclusion**: New vessel will weigh ~44.5 MT

---

### 7️⃣ Export Results

Go to **Export Tab** → Click **"Export as JSON"**

Downloads file with:
- Model configuration
- Performance metrics
- Your predictions

---

## 🔄 Try Another Dataset

Upload your own CSV with columns like:
```csv
Feature1, Feature2, Feature3, ..., TargetValue
10,       20,       30,       ..., 100
15,       25,       35,       ..., 125
20,       30,       40,       ..., 150
```

**System will:**
1. Auto-detect numeric columns
2. Let you choose inputs/outputs
3. Train 4 models automatically
4. Show accuracy metrics
5. Predict for your inputs

---

## 📊 Interpreting Results

### RMSE (Root Mean Square Error)
- Lower is better
- Units match your target (e.g., MT, dollars, days)
- Example: RMSE=5 means typical error ±5 units

### MAE (Mean Absolute Error)
- Average absolute error
- Less sensitive to outliers than RMSE
- Example: MAE=3 means typical error 3 units

### R² (Coefficient of Determination)
- Range: 0 to 1
- Higher is better
- Example: R²=0.85 means model explains 85% of variance

| R² | Quality |
|----|---------|
| >0.9 | Excellent |
| 0.8-0.9 | Good |
| 0.6-0.8 | Fair |
| <0.6 | Questionable |

---

## 🎨 Themes

Click dots in top right:
- **Blue** (Blueprint): Dark professional
- **Gold** (Graphite): Dark industrial
- **Teal** (Paper): Light clean

Theme saves automatically!

---

## ⚠️ Common Issues

**"Need at least 5 rows"**
→ Upload file must have 5+ data rows

**"Select at least 1 input and 1 output"**
→ Check X boxes, pick Y column in Configure tab

**Models train very slowly**
→ Dataset probably too large; start with first 500 rows

**Poor accuracy (R² < 0.5)**
→ Likely missing important features or too much noise

**All predictions same value**
→ Check if output is constant in dataset

---

## 🚀 Next Steps

1. **Read README.md** for full feature list
2. **Check TECHNICAL.md** for algorithm details
3. **Try multiple models** to compare
4. **Adjust inputs** to see impact on predictions
5. **Export results** for use in reports

---

## 💡 Pro Tips

✨ **Feature Engineering**: Create new features in Excel first, then upload
- Example: If you have Age & Experience, create (Age - Experience) = Education

✨ **Data Quality**: Clean CSV before upload
- Remove extra columns you won't use
- Fix obvious data entry errors
- Convert text categories to numbers (Steel=1, Aluminum=2)

✨ **Model Selection**: 
- Use **Linear** for simple, fast baseline
- Use **Ridge** for noisy data
- Use **Tree** for non-linear patterns
- Use **KNN** for local patterns

✨ **Batch Predictions**: 
- Manually enter different values in Forecast tab
- Each prediction takes <1 second
- Export results per prediction

---

## 📞 Need Help?

Check README.md for:
- Use cases & examples
- Detailed feature explanation
- Troubleshooting guide
- Technology stack info

Check TECHNICAL.md for:
- Algorithm details
- Math behind models
- Performance expectations
- Advanced features

---

**Happy Forecasting! 🎯**
