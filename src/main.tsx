import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug logging for GitHub Pages
console.log('Main.tsx loading...');
console.log('Current URL:', window.location.href);
console.log('Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering app...');
  createRoot(rootElement).render(<App />);
}
