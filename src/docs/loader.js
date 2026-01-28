// 缓存已加载的文档内容和导航配置
let docCache = {};
let navigationCache = null;

// 解析 SUMMARY.md 内容，支持多层嵌套结构
const parseSummary = (content) => {
  const lines = content.split('\n');
  const navigation = [];
  const stack = [];
  
  // 每级缩进对应2个空格
  const indentSize = 2;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 跳过空行、注释和标题
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('<!--')) {
      continue;
    }
    
    // 计算缩进级别
    const leadingSpaces = line.length - line.trimStart().length;
    const level = Math.floor(leadingSpaces / indentSize);
    
    // 解析链接
    const match = trimmedLine.match(/\[(.*?)\]\((.*?)(\.md)?\)/);
    if (!match) continue;
    
    const title = match[1];
    let path = match[2];
    
    // 移除 .md 后缀（如果有）
    if (path.endsWith('.md')) {
      path = path.slice(0, -3);
    }
    
    const node = {
      title,
      path: path,
      id: path,
      routePath: `/docs/${path}`,
      children: []
    };
    
    // 处理缩进层级
    if (level === 0) {
      // 根级节点
      navigation.push(node);
      stack.length = 0; // 清空栈
      stack.push({ node, level });
    } else {
      // 找到父节点
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      if (stack.length > 0) {
        const parent = stack[stack.length - 1].node;
        parent.children.push(node);
      } else {
        // 如果没有父节点，作为根节点
        navigation.push(node);
      }
      
      stack.push({ node, level });
    }
  }
  
  return navigation;
};

// 获取导航配置
export const getNavigation = async () => {
  if (navigationCache) {
    return navigationCache;
  }
  
  try {
    // 尝试从 public/docs 加载 SUMMARY.md
    const response = await fetch(`${process.env.PUBLIC_URL || ''}/docs/SUMMARY.md`);
    
    if (!response.ok) {
      throw new Error(`无法加载 SUMMARY.md: ${response.status}`);
    }
    
    const content = await response.text();
    navigationCache = parseSummary(content);
    
    console.log('从 SUMMARY.md 生成的导航配置:', navigationCache);
    return navigationCache;
    
  } catch (error) {
    console.error('加载 SUMMARY.md 失败，使用默认配置:', error);
    
    // 使用您图片中显示的默认配置
    return [
      {
        title: '项目介绍',
        id: 'introduction',
        path: 'introduction',
        routePath: '/docs/introduction',
        children: []
      },
      {
        title: 'Qexed One 单机版本',
        id: 'standalone',
        path: 'standalone',
        routePath: '/docs/standalone',
        children: []
      },
      {
        title: '服务列表',
        id: 'services',
        path: 'services',
        routePath: '/docs/services',
        children: [
          {
            title: 'TCP连接入口',
            id: 'services/tcp-connect',
            path: 'services/tcp-connect',
            routePath: '/docs/services/tcp-connect',
            children: [
              {
                title: '配置',
                id: 'services/tcp-connect/config',
                path: 'services/tcp-connect/config',
                routePath: '/docs/services/tcp-connect/config',
                children: []
              },
              {
                title: '命令',
                id: 'services/tcp-connect/command',
                path: 'services/tcp-connect/command',
                routePath: '/docs/services/tcp-connect/command',
                children: []
              }
            ]
          },
          {
            title: '服务器状态',
            id: 'services/server-status',
            path: 'services/server-status',
            routePath: '/docs/services/server-status',
            children: []
          },
          {
            title: '聊天',
            id: 'services/chat',
            path: 'services/chat',
            routePath: '/docs/services/chat',
            children: []
          }
        ]
      }
    ];
  }
};

// 获取第一个文档的路径（递归查找）
export const getFirstDocPath = async () => {
  const navigation = await getNavigation();
  
  const findFirstPath = (nodes) => {
    for (const node of nodes) {
      if (!node.children || node.children.length === 0) {
        return node.path;
      }
      const childPath = findFirstPath(node.children);
      if (childPath) return childPath;
    }
    return null;
  };
  
  const firstPath = findFirstPath(navigation);
  return firstPath || 'introduction';
};

// 异步获取文档内容
export const getDocContent = async (docPath) => {
  console.log(`请求文档路径: ${docPath}`);
  
  // 检查缓存
  if (docCache[docPath]) {
    console.log(`从缓存获取文档: ${docPath}`);
    return docCache[docPath];
  }
  
  try {
    const url = `${process.env.PUBLIC_URL || ''}/docs/${docPath}.md`;
    console.log(`请求URL: "${url}"`);
    
    const response = await fetch(url);
    
    console.log(`响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`文档 "${docPath}" 不存在 (404)`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    
    // 检查返回的是否是 HTML
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
      throw new Error(`文档 "${docPath}" 不存在，服务器返回了默认页面`);
    }
    
    // 缓存结果
    docCache[docPath] = content;
    
    console.log(`文档 ${docPath} 加载成功`);
    return content;
    
  } catch (error) {
    console.error(`加载文档 ${docPath} 失败:`, error);
    
    return `# 文档未找到\n\n抱歉，您查找的文档 "${docPath}" 不存在。\n\n错误信息: ${error.message}\n\n请检查文档路径或返回[文档首页](/docs)。`;
  }
};

// 获取所有文档ID（递归）
export const getAllDocIds = async () => {
  const navigation = await getNavigation();
  
  const collectPaths = (nodes) => {
    let paths = [];
    for (const node of nodes) {
      paths.push(node.path);
      if (node.children && node.children.length > 0) {
        paths = paths.concat(collectPaths(node.children));
      }
    }
    return paths;
  };
  
  return collectPaths(navigation);
};

// 检查文档是否存在
export const docExists = async (docId) => {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL || ''}/docs/${docId}.md`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};