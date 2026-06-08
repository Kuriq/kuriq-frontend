import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import App from "./App.jsx"

// localStorage 감시 — accessToken 저장/삭제 위치 추적
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  if (key === 'accessToken') {
    console.log('✅ accessToken 저장됨!', value?.substring(0, 20), new Error().stack);
  }
  return originalSetItem(key, value);
};

const originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function(key) {
  if (key === 'accessToken') {
    console.error('🚨 accessToken 삭제됨!', new Error().stack);
  }
  return originalRemoveItem(key);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
