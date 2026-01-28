// index.js
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 增加路由包裹
import { BASE_PATH } from './config/basePath';
import App from './App';
import 'bootswatch/dist/darkly/bootstrap.css'

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={BASE_PATH}>
    <App />
  </BrowserRouter>
);