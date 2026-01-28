import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import YXNavbar from './baseui/yxnavbar';
import YXFooter from './baseui/yxfooter';
import Index from './page/index';
import Page404 from './page/error/404';
import Docs from './page/docs';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');

  // 从本地存储加载主题偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem('qexed-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('qexed-theme', newTheme);

    // 更新文档根元素的主题属性
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  // 初始化主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <div
      className={`app ${theme === 'dark' ? 'app-dark' : 'app-light'}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <YXNavbar theme={theme} onThemeToggle={toggleTheme} />

      <main
        className="main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Routes>
          <Route path="/" element={<Index theme={theme} />} />
          <Route path="/docs" element={<Docs theme={theme} />} />
          <Route path="/docs/*" element={<Docs theme={theme} />} />
          <Route path="*" element={<Page404 theme={theme} />} />
        </Routes>
      </main>

      <YXFooter theme={theme} />
    </div>
  );
}

export default App;