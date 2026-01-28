// index.js
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 增加路由包裹
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/darkly/bootstrap.min.css'
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);