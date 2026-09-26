// Fontes do tema Faísca: Google Sans Flex com eixo ROND (cantos arredondados) e Google Sans Code
import '@fontsource-variable/google-sans-flex/rond.css'
import '@fontsource/google-sans-code/400.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
