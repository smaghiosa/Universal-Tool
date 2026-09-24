import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UniversalForecaster from './UniversalForecaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UniversalForecaster />
  </StrictMode>,
)
