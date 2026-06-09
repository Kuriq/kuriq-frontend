import { createRoot } from "react-dom/client"
import "./styles/index.css"
import App from "./App.jsx"

const originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function(key) {
  if (key === 'accessToken') {
    console.error('🚨 accessToken 삭제됨!', new Error().stack);
  }
  return originalRemoveItem(key);
};

createRoot(document.getElementById("root")).render(
  <App />
)
