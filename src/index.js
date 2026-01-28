// index.js
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 增加路由包裹
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> {/* 关键修复：添加路由上下文 */}
    <App />
  </BrowserRouter>
);