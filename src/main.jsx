import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import App from "./App.jsx"

// localStorage.removeItem 감지 — accessToken 삭제 위치 추적
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
