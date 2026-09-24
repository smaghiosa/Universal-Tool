# Universal Forecaster - Complete File Guide

## 📁 Project Structure

```
/mnt/project/
├── Core Application Files
│   ├── main.jsx                  ← Entry point (loads UniversalForecaster)
│   ├── UniversalForecaster.jsx   ← Main app component (3000+ lines)
│   ├── index.html                ← HTML template
│   ├── index.css                 ← Global styles (legacy, CSS in component)
│   └── package.json              ← Dependencies & scripts
│
├── Documentation
│   ├── README.md                 ← Full feature guide (START HERE)
│   ├── QUICKSTART.md             ← 5-minute tutorial
│   ├── TECHNICAL.md              ← Deep dive into algorithms
│   └── FILE_GUIDE.md             ← This file
│
├── Example Datasets
│   ├── example_vessels.csv       ← 195 pressure vessel records
│   ├── example_realestate.csv    ← 65 real estate properties
│   └── [Your own CSV files here]
│
└── Build & Config
    ├── vite.config.js            ← Vite bundler config (if exists)
    └── .gitignore                ← Git ignore patterns (if exists)
```

---

## 📄 File Descriptions

### Application Files

#### **main.jsx**
- **Size**: ~100 lines
- **Purpose**: React entry point
- **Contains**: React DOM render call
- **Edit**: Only if changing main component

#### **UniversalForecaster.jsx**
- **Size**: ~3000 lines
- **Purpose**: Main application component
- **Contains**: 
  - ML algorithms (Linear, Ridge, Tree, KNN)
  - React components (tabs, forms, charts)
  - Data processing logic
  - UI styling (inline CSS)
- **Key Sections**:
  - Lines 1-200: CSS theme system
  - Lines 201-400: Utility functions (toNum, fmt)
  - Lines 401-700: ML model implementations
  - Lines 701-850: Metrics calculations
  - Lines 851-1000: React components
  - Lines 1001-3000: Main app component with tabs

#### **index.html**
- **Size**: ~30 lines
- **Purpose**: HTML template
- **Edit**: Title, meta tags, favicon

#### **index.css**
- **Size**: ~100 lines
- **Purpose**: Global styles (mostly unused, all CSS in component)
- **Edit**: For global CSS variables if needed

#### **package.json**
- **Size**: ~20 lines
- **Purpose**: Node dependencies and scripts
- **Key scripts**:
  - `npm run dev`: Development server
  - `npm run build`: Production build
  - `npm run lint`: Code linting
  - `npm run preview`: Preview build locally
- **Dependencies**:
  - react, react-dom: UI framework
  - papaparse: CSV parsing
  - recharts: Charts
  - lucide-react: Icons
  - simple-statistics: Stats helpers

---

### Documentation Files

#### **README.md** (★ START HERE)
- **Size**: ~500 lines
- **Purpose**: Complete user guide
- **Covers**:
  - Feature overview
  - Installation & setup
  - How to use (6 steps)
  - Use cases by industry
  - Tips & tricks
  - Troubleshooting
  - Future roadmap
- **Read this for**: Understanding what the app can do

#### **QUICKSTART.md** (★ QUICK TUTORIAL)
- **Size**: ~200 lines
- **Purpose**: 5-minute getting started guide
- **Covers**:
  - Installation (2 commands)
  - Loading example data
  - Example walkthrough (Vessels → Weight Prediction)
  - Result interpretation
  - Common issues & fixes
- **Read this for**: Quick start with examples

#### **TECHNICAL.md** (★ DEEP DIVE)
- **Size**: ~400 lines
- **Purpose**: Algorithm and technical details
- **Covers**:
  - Each algorithm explained (formula + implementation)
  - Data flow diagram
  - Performance analysis (speed, memory)
  - Accuracy expectations
  - Feature scaling
  - Edge case handling
  - Browser compatibility
  - How to extend with new models
- **Read this for**: Understanding HOW the tool works

#### **FILE_GUIDE.md** (THIS FILE)
- **Size**: ~300 lines
- **Purpose**: File organization reference
- **Covers**:
  - Where each file is
  - What each file does
  - Which files to edit for different changes
  - Modification guide
- **Read this for**: Understanding project structure

---

### Example Datasets

#### **example_vessels.csv**
- **Size**: 195 rows × 8 columns
- **Purpose**: Pressure vessel dataset for demo
- **Columns**:
  - Tag: Vessel identifier (V-101, V-102, ...)
  - Diameter: ID in mm (400-7010)
  - Height: TL-TL in mm (1000-38024)
  - Pressure: Design pressure kg/cm² (0.2-194)
  - Temperature: Design temp °C (65-454)
  - FabWeight: Fabrication weight MT (0.6-505)
  - OperatingWeight: Operating weight MT (0.7-1424)
- **Use case**: Predict weight from geometry & design conditions
- **Accuracy**: R² ~0.85-0.92 typical

#### **example_realestate.csv**
- **Size**: 65 rows × 8 columns
- **Purpose**: Real estate dataset for demo
- **Columns**:
  - Address: Street address
  - SquareFeet: Property size (1200-3300)
  - Bedrooms: Count (2-5)
  - Bathrooms: Count (1-3)
  - YearBuilt: Construction year (1995-2019)
  - GarageSpaces: Count (1-3)
  - LotSize: Lot size in sq ft (2500-7100)
  - Price: Selling price $ (380000-880000)
- **Use case**: Predict house price from features
- **Accuracy**: R² ~0.80-0.88 typical

#### **[Your Data].csv**
- **Format**: CSV with headers
- **Requirements**:
  - 5+ rows minimum
  - At least 1 numeric column for input
  - At least 1 numeric column for output
- **Recommended**: 20+ rows for good model training

---

## 🔧 Modification Guide

### To Add a New Model Algorithm

**Edit**: `UniversalForecaster.jsx`

1. **Add training function** (line ~550):
```javascript
function myNewModel(X, y, params = {}) {
  // ... implementation
  return { type: "mynewmodel", ... };
}
```

2. **Add prediction function** (line ~600):
```javascript
function predictMyNew(model, x) {
  // ... implementation
  return prediction;
}
```

3. **Add to training logic** (line ~1800, in handleTrainModels):
```javascript
if (selectedModels.has("mynewmodel")) {
  models.mynewmodel = myNewModel(Xvalid, yvalid);
}
```

4. **Add to prediction logic** (line ~1900):
```javascript
else if (name === "mynewmodel") {
  preds[name] = predictMyNew(model, x);
}
```

5. **Add to UI options** (line ~1400, MODEL_OPTIONS):
```javascript
{ id: "mynewmodel", name: "My New Model", desc: "Description" }
```

### To Change Color Scheme

**Edit**: `UniversalForecaster.jsx`, line ~50 (CSS constant)

Change variables like:
```css
--cyan: #5fd4e8;  /* Primary accent */
--ink: #dce9f5;   /* Text color */
--paper: #0b1f33; /* Background */
```

### To Add New Tab

**Edit**: `UniversalForecaster.jsx`

1. Add tab to TABS array (line ~1400)
2. Add conditional rendering in JSX (line ~1700+)
3. Create component function for new tab

### To Change Training Parameters

**Edit**: `UniversalForecaster.jsx`

- **Linear Regression** (line ~420):
  - Learning rate: `const lr = 0.01;`
  - Epochs: `for (let epoch = 0; epoch < 100; epoch++)`

- **Ridge Regression** (line ~445):
  - Lambda (regularization): `function ridgeRegression(X, y, lambda = 0.08)`
  - Learning rate: `const lr = 0.1;`

- **Decision Tree** (line ~475):
  - Max depth: `if (depth >= maxDepth)` where `maxDepth = 5`
  - Min samples: `if (indices.length < 4)`

- **KNN** (line ~520):
  - K neighbors: In prediction `Math.min(model.k, ...)` where `k = 5`

### To Support New File Formats

**Edit**: `UniversalForecaster.jsx`, handleFile function (line ~1550)

Currently supports: CSV, XLSX
Change accept attribute:
```javascript
<input accept=".csv,.xlsx,.xls,.tsv" ... />
```

For JSON:
```javascript
Papa.parse(file, {
  dynamicTyping: true,  // Auto-convert numbers
  ...
})
```

---

## 🚀 Development Workflow

### Start Development
```bash
cd /mnt/project
npm install        # First time only
npm run dev        # Starts dev server with hot reload
```

### Make Changes
1. Edit `UniversalForecaster.jsx`
2. Browser auto-reloads (usually instant)
3. Test with example data

### Build for Production
```bash
npm run build      # Creates optimized /dist folder
npm run preview    # Test production build locally
```

### Deploy
Copy `/dist` contents to web server or:
- GitHub Pages
- Vercel (auto-deploy)
- Netlify (auto-deploy)
- Any static hosting

---

## 📊 Code Statistics

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| UniversalForecaster.jsx | 120 KB | 3200 | Main app |
| README.md | 25 KB | 500 | User guide |
| TECHNICAL.md | 20 KB | 400 | Algorithm docs |
| example_vessels.csv | 12 KB | 195 | Demo data |
| example_realestate.csv | 8 KB | 65 | Demo data |
| **Total** | **185 KB** | **4360** | **Complete tool** |

---

## 🔍 Finding Things

### "Where do I...?"

| Question | Answer |
|----------|--------|
| Change colors? | UniversalForecaster.jsx, line ~50 (CSS) |
| Add a model? | UniversalForecaster.jsx, line ~550 onwards |
| Change training time? | UniversalForecaster.jsx, lines ~420-520 (epochs, lr) |
| Add a new tab? | UniversalForecaster.jsx, line ~1400 (TABS array) |
| Understand an algorithm? | TECHNICAL.md, section "Algorithm Details" |
| See example usage? | QUICKSTART.md or load example_vessels.csv |
| Debug slow training? | TECHNICAL.md section "Performance Optimization" |
| Add a new feature? | README.md section "Future Enhancements" |

---

## 📦 Build Artifacts

### Development Build
```
/node_modules/    ← Installed dependencies (can delete, npm install to restore)
/dist/            ← Production build output (created by npm run build)
```

### What's in /dist?
```
dist/
├── index.html          ← Bundled HTML
├── assets/
│   ├── main-*.js       ← Bundled JavaScript
│   └── main-*.css      ← Bundled CSS
└── (other static assets)
```

---

## ✅ Checklist: Before First Use

- [ ] Read README.md
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Load example_vessels.csv
- [ ] Configure inputs/outputs
- [ ] Click "Train Models"
- [ ] View results
- [ ] Make prediction
- [ ] Export JSON

---

## 🎯 Quick Links

- **Start**: Run `npm run dev` → http://localhost:5173
- **Learn**: Open `README.md`
- **Try**: Upload `example_vessels.csv`
- **Understand**: Read `TECHNICAL.md`
- **Deploy**: Run `npm run build`

---

**Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: ✅ Production Ready
