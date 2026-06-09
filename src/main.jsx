import { createRoot } from "react-dom/client"
import "./styles/index.css"
import App from "./App.jsx"

const _setItem = localStorage.setItem.bind(localStorage);
const _removeItem = localStorage.removeItem.bind(localStorage);
const _clear = localStorage.clear.bind(localStorage);

localStorage.setItem = function(key, value) {
  if (key === 'accessToken') {
    console.warn('📝 setItem:', key, '=', String(value).substring(0, 15), new Error().stack);
  }
  return _setItem(key, value);
};
localStorage.removeItem = function(key) {
  if (key === 'accessToken') {
    console.error('🗑️ removeItem:', key, new Error().stack);
  }
  return _removeItem(key);
};
localStorage.clear = function() {
  console.error('💣 localStorage.clear() 호출!', new Error().stack);
  return _clear();
};

createRoot(document.getElementById("root")).render(
  <App />
)
