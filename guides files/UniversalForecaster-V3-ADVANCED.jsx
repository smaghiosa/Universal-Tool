import { useState, useMemo, useCallback, useRef } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from "recharts";
import {
  Upload, Database, Settings, BarChart3, Layers, FileDown,
  AlertTriangle, CheckCircle2, Sliders, ChevronRight, Info, Zap,
  Trash2, Download, Eye, EyeOff, TrendingUp
} from "lucide-react";

/* ============================================================================
   UNIVERSAL FORECASTER V3 - PRODUCTION APPLICATION
   ========================================================================== */

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

:root {
  --text: #1f2937;
  --text-light: #6b7280;
  --bg: #ffffff;
  --border: #e5e7eb;
  --primary: #3b82f6;
  --primary-light: #dbeafe;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
}

.app-wrapper {
  background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 20px;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  background: linear-gradient(135deg, var(--primary) 0%, #1e40af 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-lg);
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.header p {
  font-size: 14px;
  opacity: 0.9;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border);
  flex-wrap: wrap;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-light);
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: var(--primary);
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 30px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.field {
  margin-bottom: 15px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover { background: #2563eb; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover { background: var(--primary-light); }

.btn-danger {
  background: white;
  color: var(--danger);
  border: 2px solid var(--danger);
}

.btn-danger:hover { background: #fee2e2; }

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-item input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-item label {
  margin: 0;
  cursor: pointer;
  font-size: 14px;
  text-transform: none;
  letter-spacing: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.metric-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.metric-label {
  font-size: 12px;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
}

.confidence-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.confidence-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.alert-warning {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  color: #92400e;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
}

.alert-danger {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0c2d6b;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 15px;
}

th {
  background: var(--primary-light);
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

tr:hover {
  background: #f9fafb;
}

.code-block {
  background: #1f2937;
  color: #e5e7eb;
  padding: 15px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
  line-height: 1.5;
  margin: 15px 0;
}

.equation-display {
  background: #f3f4f6;
  border-left: 4px solid var(--primary);
  padding: 15px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  margin: 15px 0;
  font-size: 14px;
  line-height: 1.6;
}

.file-upload-area {
  border: 2px dashed var(--border);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.file-upload-area:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.file-upload-area.drag-over {
  border-color: var(--primary);
  background: var(--primary-light);
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}
`;

/* ============================================================================
   CORE ML ALGORITHMS
   ========================================================================== */

// Standard Scaler
function StandardScaler() {
  return {
    mean: 0, std: 1,
    fit: function(X) {
      const n = X.length;
      this.mean = X.reduce((a, b) => a + b, 0) / n;
      const variance = X.reduce((a, b) => a + (b - this.mean) ** 2, 0) / n;
      this.std = Math.sqrt(variance) || 1;
    },
    transform: function(X) {
      return X.map(x => (x - this.mean) / this.std);
    },
    fit_transform: function(X) {
      this.fit(X);
      return this.transform(X);
    }
  };
}

// Linear Regression with Gradient Descent
function linearRegression(X, y, { lr = 0.001, epochs = 100 } = {}) {
  const n = X.length;
  const d = X[0].length;
  let w = new Array(d).fill(0);
  let b = y.reduce((a, v) => a + v, 0) / n;

  for (let e = 0; e < epochs; e++) {
    let pred = X.map(row => b + row.reduce((s, v, i) => s + w[i] * v, 0));
    let gradW = new Array(d).fill(0);
    let gradB = 0;

    for (let i = 0; i < n; i++) {
      const err = pred[i] - y[i];
      for (let j = 0; j < d; j++) gradW[j] += (err * X[i][j]) / n;
      gradB += err / n;
    }

    for (let j = 0; j < d; j++) w[j] -= lr * Math.min(Math.max(gradW[j], -10), 10);
    b -= lr * Math.min(Math.max(gradB, -10), 10);
  }
  return { w, b };
}

// Ridge Regression
function ridgeRegression(X, y, { lr = 0.001, epochs = 150, lambda = 0.08 } = {}) {
  const n = X.length;
  const d = X[0].length;
  let w = new Array(d).fill(0);
  let b = y.reduce((a, v) => a + v, 0) / n;

  for (let e = 0; e < epochs; e++) {
    let pred = X.map(row => b + row.reduce((s, v, i) => s + w[i] * v, 0));
    let gradW = new Array(d).fill(0);
    let gradB = 0;

    for (let i = 0; i < n; i++) {
      const err = pred[i] - y[i];
      for (let j = 0; j < d; j++) gradW[j] += (err * X[i][j]) / n;
      gradB += err / n;
    }

    for (let j = 0; j < d; j++) w[j] -= lr * (Math.min(Math.max(gradW[j], -10), 10) + (lambda * w[j]) / n);
    b -= lr * Math.min(Math.max(gradB, -10), 10);
  }
  return { w, b };
}

// Decision Tree Regressor
function decisionTreeRegressor(X, y, { maxDepth = 5 } = {}) {
  function buildTree(indices, depth) {
    if (depth >= maxDepth || indices.length < 2) {
      const avg = indices.reduce((s, i) => s + y[i], 0) / indices.length;
      return { value: avg };
    }

    let bestGain = 0, bestCol = -1, bestVal = 0;
    for (let col = 0; col < X[0].length; col++) {
      const vals = indices.map(i => X[i][col]).sort((a, b) => a - b);
      for (let i = 1; i < vals.length; i++) {
        const threshold = (vals[i - 1] + vals[i]) / 2;
        const left = indices.filter(idx => X[idx][col] < threshold);
        const right = indices.filter(idx => X[idx][col] >= threshold);
        if (left.length === 0 || right.length === 0) continue;

        const variance = (idx) => {
          const mean = idx.reduce((s, i) => s + y[i], 0) / idx.length;
          return idx.reduce((s, i) => s + (y[i] - mean) ** 2, 0) / idx.length;
        };
        const gain = variance(indices) - (left.length * variance(left) + right.length * variance(right)) / indices.length;
        if (gain > bestGain) { bestGain = gain; bestCol = col; bestVal = threshold; }
      }
    }

    if (bestCol === -1) {
      const avg = indices.reduce((s, i) => s + y[i], 0) / indices.length;
      return { value: avg };
    }

    const left = indices.filter(i => X[i][bestCol] < bestVal);
    const right = indices.filter(i => X[i][bestCol] >= bestVal);
    return { col: bestCol, val: bestVal, left: buildTree(left, depth + 1), right: buildTree(right, depth + 1) };
  }

  const tree = buildTree([...Array(X.length).keys()], 0);
  return {
    predict: (x) => {
      let node = tree;
      while (node.col !== undefined) {
        node = x[node.col] < node.val ? node.left : node.right;
      }
      return node.value;
    }
  };
}

// KNN Regressor
function knnRegressor(X, y, { k = 5 } = {}) {
  return {
    predict: (x) => {
      const distances = X.map((xi, i) => ({
        dist: Math.sqrt(xi.reduce((s, v, j) => s + (v - x[j]) ** 2, 0)),
        val: y[i]
      }));
      distances.sort((a, b) => a.dist - b.dist);
      const vals = distances.slice(0, k).map(d => d.val);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    }
  };
}

// Metrics
function regressionMetrics(yTrue, yPred) {
  const n = yTrue.length || 1;
  let se = 0, ae = 0, mean = yTrue.reduce((a, b) => a + b, 0) / n;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    se += (yTrue[i] - yPred[i]) ** 2;
    ae += Math.abs(yTrue[i] - yPred[i]);
    ssTot += (yTrue[i] - mean) ** 2;
  }
  return {
    rmse: Math.sqrt(se / n),
    mae: ae / n,
    r2: ssTot > 0 ? 1 - se / ssTot : 0
  };
}

// Outlier Detection (IQR)
function detectOutliers(data, columns) {
  const stats = {};
  columns.forEach(col => {
    const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v)).sort((a, b) => a - b);
    const q1 = vals[Math.floor(vals.length * 0.25)];
    const q3 = vals[Math.floor(vals.length * 0.75)];
    const iqr = q3 - q1;
    stats[col] = { q1, q3, iqr, lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr };
  });
  return stats;
}

function isOutlier(row, col, outlierStats) {
  if (!outlierStats[col]) return false;
  const v = parseFloat(row[col]);
  if (isNaN(v)) return false;
  return v < outlierStats[col].lower || v > outlierStats[col].upper;
}

function hasOutlier(row, columns, outlierStats) {
  return columns.some(col => isOutlier(row, col, outlierStats));
}

// Categorical Detection
function detectCategoricalColumns(data, numericCols) {
  const categories = {};
  const headers = Object.keys(data[0] || {});
  
  headers.forEach(col => {
    if (numericCols.includes(col)) return;
    const values = new Set(data.map(r => (r[col] || "").toString().trim()).filter(v => v));
    if (values.size > 0 && values.size < 20) {
      categories[col] = Array.from(values).sort();
    }
  });
  return categories;
}

// Euclidean Distance
function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
}

// Distance to Confidence
function distanceToConfidence(distance, maxDist = 5) {
  return Math.round(Math.max(0, 100 * (1 - Math.min(distance, maxDist) / maxDist)));
}

/* ============================================================================
   MAIN APP COMPONENT
   ========================================================================== */
export default function UniversalForecaster() {
  const [activeTab, setActiveTab] = useState("data");
  const [uploadedData, setUploadedData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  
  // Column Detection
  const numericCols = useMemo(() => {
    if (!uploadedData) return [];
    const headers = Object.keys(uploadedData[0] || {});
    return headers.filter(h => {
      const vals = uploadedData.map(r => parseFloat(r[h]));
      return vals.some(v => !isNaN(v));
    });
  }, [uploadedData]);

  const categoricalCols = useMemo(() => {
    if (!uploadedData) return {};
    return detectCategoricalColumns(uploadedData, numericCols);
  }, [uploadedData, numericCols]);

  // Outlier Detection
  const outlierStats = useMemo(() => {
    if (!uploadedData || numericCols.length === 0) return {};
    return detectOutliers(uploadedData, numericCols);
  }, [uploadedData, numericCols]);

  const [excludeOutliers, setExcludeOutliers] = useState(false);
  const filteredData = useMemo(() => {
    if (!uploadedData) return [];
    if (!excludeOutliers) return uploadedData;
    return uploadedData.filter(row => !hasOutlier(row, numericCols, outlierStats));
  }, [uploadedData, excludeOutliers, numericCols, outlierStats]);

  // Configuration
  const [selectedInputs, setSelectedInputs] = useState(new Set());
  const [selectedOutput, setSelectedOutput] = useState("");
  const [selectedModels, setSelectedModels] = useState(new Set(["linear", "ridge", "tree", "knn"]));
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  // Training
  const [results, setResults] = useState(null);
  const [training, setTraining] = useState(false);

  // Forecast
  const [forecastInputs, setForecastInputs] = useState({});
  const [predictions, setPredictions] = useState(null);

  // File Upload Handler
  const handleFile = useCallback((file) => {
    if (!file) return;
    setParseError("");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!res.data || res.data.length < 5) {
          setParseError("Need at least 5 rows of data");
          return;
        }
        setUploadedData(res.data);
        setFileName(file.name);
        setSelectedInputs(new Set());
        setSelectedOutput("");
        setForecastInputs({});
        setPredictions(null);
        setResults(null);
      },
      error: (err) => setParseError(err.message || "Parse error")
    });
  }, []);

  // Training Handler
  const handleTrain = useCallback(() => {
    if (selectedInputs.size === 0 || !selectedOutput) {
      alert("Select inputs and output");
      return;
    }

    setTraining(true);
    setTimeout(() => {
      try {
        const inputCols = Array.from(selectedInputs);
        const X = filteredData.map(row => {
          return inputCols.map(col => {
            if (selectedCategories.has(col)) {
              const levels = Array.from(categoricalCols[col] || []);
              return levels.indexOf((row[col] || "").toString().trim());
            }
            return parseFloat(row[col]) || 0;
          });
        });

        const y = filteredData.map(r => parseFloat(r[selectedOutput]) || 0);

        // Scale
        const scalers = inputCols.map((col, i) => {
          const scaler = StandardScaler();
          scaler.fit(X.map(row => row[i]));
          return scaler;
        });
        const XScaled = X.map(row => row.map((v, i) => scalers[i].transform([v])[0]));
        const yScaler = StandardScaler();
        yScaler.fit(y);
        const yScaled = yScaler.transform(y);

        // Train Models
        const trainedModels = {};
        const metrics = {};

        if (selectedModels.has("linear")) {
          const model = linearRegression(XScaled, yScaled);
          const preds = XScaled.map(x => model.b + x.reduce((s, v, i) => s + model.w[i] * v, 0));
          trainedModels.linear = { model, scalers, yScaler };
          metrics.linear = regressionMetrics(yScaled, preds);
        }

        if (selectedModels.has("ridge")) {
          const model = ridgeRegression(XScaled, yScaled);
          const preds = XScaled.map(x => model.b + x.reduce((s, v, i) => s + model.w[i] * v, 0));
          trainedModels.ridge = { model, scalers, yScaler };
          metrics.ridge = regressionMetrics(yScaled, preds);
        }

        if (selectedModels.has("tree")) {
          const model = decisionTreeRegressor(XScaled, yScaled);
          const preds = XScaled.map(x => model.predict(x));
          trainedModels.tree = { model, scalers, yScaler };
          metrics.tree = regressionMetrics(yScaled, preds);
        }

        if (selectedModels.has("knn")) {
          const model = knnRegressor(XScaled, yScaled);
          const preds = XScaled.map(x => model.predict(x));
          trainedModels.knn = { model, scalers, yScaler };
          metrics.knn = regressionMetrics(yScaled, preds);
        }

        setResults({
          models: trainedModels,
          metrics,
          inputCols,
          selectedOutput,
          dataSize: filteredData.length,
          excludedOutliers: uploadedData.length - filteredData.length
        });
        setActiveTab("results");
      } catch (e) {
        alert("Training error: " + e.message);
      }
      setTraining(false);
    }, 100);
  }, [selectedInputs, selectedOutput, selectedModels, filteredData, uploadedData, selectedCategories, categoricalCols]);

  // Forecast Handler
  const handleForecast = useCallback(() => {
    if (!results) {
      alert("Train a model first");
      return;
    }

    const inputCols = results.inputCols;
    const x = inputCols.map(col => {
      if (selectedCategories.has(col)) {
        const levels = Array.from(categoricalCols[col] || []);
        return levels.indexOf(forecastInputs[col] || "");
      }
      return parseFloat(forecastInputs[col]) || 0;
    });

    const xScaled = x.map((v, i) => results.models[Object.keys(results.models)[0]].scalers[i].transform([v])[0]);

    const preds = {};
    Object.entries(results.models).forEach(([modelType, { model, yScaler }]) => {
      let pred;
      if (modelType === "tree" || modelType === "knn") {
        pred = model.predict(xScaled);
      } else {
        pred = model.b + xScaled.reduce((s, v, i) => s + model.w[i] * v, 0);
      }
      preds[modelType] = yScaler.mean + pred * yScaler.std;
    });

    // Find similar
    const distances = uploadedData.map((row, i) => ({
      idx: i,
      dist: euclideanDistance(x, inputCols.map(col => {
        if (selectedCategories.has(col)) {
          const levels = Array.from(categoricalCols[col] || []);
          return levels.indexOf((row[col] || "").toString().trim());
        }
        return parseFloat(row[col]) || 0;
      })),
      row
    }));
    distances.sort((a, b) => a.dist - b.dist);
    const similar = distances.slice(0, 5).map(d => ({
      ...d,
      confidence: distanceToConfidence(d.dist)
    }));

    setPredictions({ preds, similar, inputs: inputCols });
    setActiveTab("forecast");
  }, [results, forecastInputs, selectedCategories, categoricalCols, uploadedData]);

  return (
    <div className="app-wrapper">
      <style>{CSS}</style>
      <div className="app-container">
        
        {/* Header */}
        <div className="header">
          <h1>🌍 Universal Forecaster V3</h1>
          <p>Upload any CSV • Select inputs/outputs • Get predictions instantly</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${activeTab === "data" ? "active" : ""}`} onClick={() => setActiveTab("data")}>
            <Database size={18} /> Data & Outliers
          </button>
          <button className={`tab-btn ${activeTab === "configure" ? "active" : ""}`} onClick={() => setActiveTab("configure")}>
            <Settings size={18} /> Configure
          </button>
          <button className={`tab-btn ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
            <BarChart3 size={18} /> Results
          </button>
          <button className={`tab-btn ${activeTab === "equations" ? "active" : ""}`} onClick={() => setActiveTab("equations")}>
            <Zap size={18} /> Equations
          </button>
          <button className={`tab-btn ${activeTab === "forecast" ? "active" : ""}`} onClick={() => setActiveTab("forecast")}>
            <TrendingUp size={18} /> Forecast
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">

          {/* DATA TAB */}
          {activeTab === "data" && (
            <div>
              <div className="card">
                <div className="card-title"><Upload size={18} /> Upload CSV File</div>
                <div
                  className={`file-upload-area ${dragOver ? "drag-over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => document.getElementById("file-input").click()}
                >
                  <Upload size={32} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
                  <p><strong>Drop CSV here or click to browse</strong></p>
                  <p style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Headers in row 1, data below</p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
                {parseError && <div className="alert alert-danger"><AlertTriangle size={18} /> {parseError}</div>}
                {fileName && <div className="alert alert-success"><CheckCircle2 size={18} /> Loaded: {fileName}</div>}
              </div>

              {uploadedData && (
                <div>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-label">Total Rows</div>
                      <div className="metric-value">{uploadedData.length}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Numeric Columns</div>
                      <div className="metric-value">{numericCols.length}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Category Columns</div>
                      <div className="metric-value">{Object.keys(categoricalCols).length}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Outliers Detected</div>
                      <div className="metric-value">{uploadedData.filter(r => hasOutlier(r, numericCols, outlierStats)).length}</div>
                    </div>
                  </div>

                  {uploadedData.filter(r => hasOutlier(r, numericCols, outlierStats)).length > 0 && (
                    <div className="card">
                      <div className="card-title"><AlertTriangle size={18} /> Outliers Detected</div>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={excludeOutliers}
                          onChange={(e) => setExcludeOutliers(e.target.checked)}
                        />
                        <span>Exclude outliers during training (trains on {filteredData.length} clean rows)</span>
                      </label>
                      {excludeOutliers && (
                        <div className="alert alert-warning" style={{ marginTop: "10px" }}>
                          Training on {filteredData.length} clean rows ({uploadedData.length - filteredData.length} excluded)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CONFIGURE TAB */}
          {activeTab === "configure" && (
            <div>
              {!uploadedData ? (
                <div className="empty-state">
                  <Database size={48} />
                  <p>Upload data first</p>
                </div>
              ) : (
                <div>
                  <div className="card">
                    <div className="card-title">Input Variables (X)</div>
                    <div className="checkbox-group">
                      {numericCols.map(col => (
                        <div key={col} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={selectedInputs.has(col)}
                            onChange={(e) => {
                              const newSet = new Set(selectedInputs);
                              if (e.target.checked) newSet.add(col);
                              else newSet.delete(col);
                              setSelectedInputs(newSet);
                            }}
                          />
                          <label>{col}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {Object.keys(categoricalCols).length > 0 && (
                    <div className="card">
                      <div className="card-title">Category Variables</div>
                      <div className="checkbox-group">
                        {Object.entries(categoricalCols).map(([col, values]) => (
                          <div key={col} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={selectedCategories.has(col)}
                              onChange={(e) => {
                                const newSet = new Set(selectedCategories);
                                if (e.target.checked) {
                                  newSet.add(col);
                                  setSelectedInputs(new Set(selectedInputs).add(col));
                                } else {
                                  newSet.delete(col);
                                }
                                setSelectedCategories(newSet);
                              }}
                            />
                            <label>{col} ({values.length})</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="card">
                    <div className="card-title">Output Variable (Y)</div>
                    <div className="field">
                      <select value={selectedOutput} onChange={(e) => setSelectedOutput(e.target.value)}>
                        <option value="">Select output variable</option>
                        {numericCols.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-title">Models</div>
                    <div className="checkbox-group">
                      {["linear", "ridge", "tree", "knn"].map(model => (
                        <div key={model} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={selectedModels.has(model)}
                            onChange={(e) => {
                              const newSet = new Set(selectedModels);
                              if (e.target.checked) newSet.add(model);
                              else newSet.delete(model);
                              setSelectedModels(newSet);
                            }}
                          />
                          <label>{model.charAt(0).toUpperCase() + model.slice(1)}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleTrain}
                    disabled={training || selectedInputs.size === 0 || !selectedOutput}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {training ? <div className="loading" /> : <Zap size={18} />}
                    {training ? "Training..." : "Train Models"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RESULTS TAB */}
          {activeTab === "results" && (
            <div>
              {!results ? (
                <div className="empty-state">
                  <BarChart3 size={48} />
                  <p>Train models first</p>
                </div>
              ) : (
                <div>
                  <div className="alert alert-success">
                    <CheckCircle2 size={18} />
                    <div>
                      <strong>Models trained!</strong>
                      <p style={{ fontSize: "12px", marginTop: "5px" }}>Data: {results.dataSize} rows{results.excludedOutliers > 0 ? ` ({results.excludedOutliers} outliers excluded)` : ""}</p>
                    </div>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Model</th>
                        <th>RMSE</th>
                        <th>MAE</th>
                        <th>R²</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(results.metrics).map(([model, m]) => (
                        <tr key={model}>
                          <td><strong>{model.charAt(0).toUpperCase() + model.slice(1)}</strong></td>
                          <td>{m.rmse.toFixed(2)}</td>
                          <td>{m.mae.toFixed(2)}</td>
                          <td>{m.r2.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="card" style={{ marginTop: "20px" }}>
                    <div className="card-title">Interpretation</div>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#666" }}>
                      <strong>RMSE:</strong> Average prediction error (lower is better)<br />
                      <strong>MAE:</strong> Mean absolute error (lower is better)<br />
                      <strong>R²:</strong> How well model explains data (0-1, higher is better)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EQUATIONS TAB */}
          {activeTab === "equations" && (
            <div>
              {!results ? (
                <div className="empty-state">
                  <Info size={48} />
                  <p>Train models to see equations</p>
                </div>
              ) : (
                <div>
                  {(results.models.linear || results.models.ridge) && (
                    <div className="card">
                      <div className="card-title">Prediction Equations</div>
                      <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
                        Use these formulas to make predictions manually in Excel or Python
                      </p>

                      {results.models.linear && (
                        <div>
                          <p style={{ fontWeight: 600, marginBottom: "10px" }}>Linear Regression</p>
                          <div className="equation-display">
                            {results.selectedOutput} = {results.models.linear.model.b.toFixed(4)} + 
                            {results.inputCols.map((col, i) => ` ${results.models.linear.model.w[i].toFixed(4)}×${col}`).join(" +")}
                          </div>
                        </div>
                      )}

                      {results.models.ridge && (
                        <div style={{ marginTop: "15px" }}>
                          <p style={{ fontWeight: 600, marginBottom: "10px" }}>Ridge Regression (λ=0.08)</p>
                          <div className="equation-display">
                            {results.selectedOutput} = {results.models.ridge.model.b.toFixed(4)} + 
                            {results.inputCols.map((col, i) => ` ${results.models.ridge.model.w[i].toFixed(4)}×${col}`).join(" +")}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {Object.keys(categoricalCols).length > 0 && Array.from(selectedCategories).length > 0 && (
                    <div className="card">
                      <div className="card-title">Category Encoding</div>
                      {Array.from(selectedCategories).map(col => (
                        <div key={col} style={{ marginBottom: "20px" }}>
                          <p style={{ fontWeight: 600, marginBottom: "8px" }}>{col}</p>
                          <div className="equation-display">
                            {categoricalCols[col].map((val, i) => (
                              <div key={val}>{val} = {i}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FORECAST TAB */}
          {activeTab === "forecast" && (
            <div>
              {!results ? (
                <div className="empty-state">
                  <TrendingUp size={48} />
                  <p>Train models first</p>
                </div>
              ) : (
                <div>
                  <div className="card">
                    <div className="card-title">Enter Input Values</div>
                    <div className="grid-2">
                      {results.inputCols.map(col => (
                        <div key={col} className="field">
                          <label>{col}</label>
                          {selectedCategories.has(col) ? (
                            <select
                              value={forecastInputs[col] || ""}
                              onChange={(e) => setForecastInputs({ ...forecastInputs, [col]: e.target.value })}
                            >
                              <option value="">Select {col}</option>
                              {(categoricalCols[col] || []).map(val => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="number"
                              step="any"
                              value={forecastInputs[col] || ""}
                              onChange={(e) => setForecastInputs({ ...forecastInputs, [col]: e.target.value })}
                              placeholder="Enter value"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleForecast}
                      style={{ width: "100%", marginTop: "20px", justifyContent: "center" }}
                    >
                      <Zap size={18} /> Make Forecast
                    </button>
                  </div>

                  {predictions && (
                    <div>
                      <div className="card">
                        <div className="card-title">Predictions</div>
                        <div className="grid-3">
                          {Object.entries(predictions.preds).map(([model, pred]) => (
                            <div key={model} className="metric-card" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderColor: "#86efac" }}>
                              <div className="metric-label">{model}</div>
                              <div className="metric-value" style={{ color: "#16a34a" }}>{pred.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-title">Similar Historical Records (Validation)</div>
                        <table>
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Confidence</th>
                              <th>Distance</th>
                              <th>Actual {results.selectedOutput}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {predictions.similar.map((s, i) => (
                              <tr key={i}>
                                <td>#{i + 1}</td>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div className="confidence-bar" style={{ width: "80px" }}>
                                      <div
                                        className="confidence-fill"
                                        style={{
                                          width: `${s.confidence}%`,
                                          background: s.confidence > 80 ? "#10b981" : s.confidence > 60 ? "#f59e0b" : "#ef4444"
                                        }}
                                      />
                                    </div>
                                    <span>{s.confidence}%</span>
                                  </div>
                                </td>
                                <td>{s.dist.toFixed(2)}</td>
                                <td><strong>{parseFloat(s.row[results.selectedOutput]).toFixed(2)}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
