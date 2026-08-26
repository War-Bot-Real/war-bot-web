import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BackgroundMusic from './components/BackgroundMusic.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackgroundMusic />
    <App />
  </StrictMode>,
)
