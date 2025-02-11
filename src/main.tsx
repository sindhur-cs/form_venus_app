import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import '@contentstack/venus-components/build/main.css';
import "./index.css";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
