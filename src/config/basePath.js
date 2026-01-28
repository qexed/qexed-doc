// src/config/basePath.js
const getBasePath = () => {
  if (window.location.hostname.includes('github.io')) {
    return '/qexed-doc';
  }
  return ''; // 生产环境使用根路径
};

export const BASE_PATH = getBasePath();