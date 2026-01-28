import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// React Bootstrap 组件
import { 
  Container, 
  Row, 
  Col, 
  Nav, 
  Card, 
  Form, 
  InputGroup, 
  Badge,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap';

import { getDocContent, getNavigation, getFirstDocPath } from '../../docs/loader';
import './docs.css';

// 自定义链接组件
const CustomLink = ({ href, children, ...props }) => {
  if (href && href.startsWith('/docs/')) {
    const to = href.replace('/docs/', '');
    return (
      <Link to={`/docs/${to}`} {...props}>
        {children}
      </Link>
    );
  }
  
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

// 自定义图片组件，处理相对路径
const CustomImage = ({ src, alt, title, ...props }) => {
  const { '*': docPath } = useParams();
  
  // 处理图片路径
  const processedSrc = useMemo(() => {
    if (!src) return '';
    
    // 如果是绝对URL（http/https），直接返回
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // 如果是绝对路径（以/开头），添加PUBLIC_URL前缀
    if (src.startsWith('/')) {
      return `${process.env.PUBLIC_URL || ''}${src}`;
    }
    
    // 相对路径：基于当前文档路径计算
    if (docPath) {
      // 获取当前文档所在目录
      const lastSlashIndex = docPath.lastIndexOf('/');
      const baseDir = lastSlashIndex >= 0 ? docPath.substring(0, lastSlashIndex + 1) : '';
      
      // 处理常见的相对路径情况
      let resolvedPath = src;
      
      // 处理 ../ 上级目录
      if (src.startsWith('../')) {
        // 计算上级目录
        const dirLevels = baseDir.split('/').filter(Boolean);
        let upCount = 0;
        let tempSrc = src;
        
        while (tempSrc.startsWith('../')) {
          upCount++;
          tempSrc = tempSrc.substring(3);
        }
        
        if (dirLevels.length >= upCount) {
          const newDir = dirLevels.slice(0, -upCount).join('/');
          resolvedPath = `${newDir ? newDir + '/' : ''}${tempSrc}`;
        } else {
          // 如果超出了根目录，就放在根目录
          resolvedPath = tempSrc;
        }
      } 
      // 处理 ./ 当前目录
      else if (src.startsWith('./')) {
        resolvedPath = `${baseDir}${src.substring(2)}`;
      }
      // 处理不带 ./ 的相对路径
      else {
        resolvedPath = `${baseDir}${src}`;
      }
      
      console.log(`图片路径处理: ${src} -> ${resolvedPath} (baseDir: ${baseDir})`);
      
      // 返回完整路径
      return `${process.env.PUBLIC_URL || ''}/docs/${resolvedPath}`;
    }
    
    // 如果没有文档路径，使用原始路径
    return `${process.env.PUBLIC_URL || ''}/docs/${src}`;
  }, [src, docPath]);
  
  return (
    <img 
      src={processedSrc} 
      alt={alt || ''} 
      title={title}
      style={{ maxWidth: '100%', height: 'auto' }}
      {...props}
    />
  );
};

// Mermaid 图表组件
const MermaidDiagram = ({ chart, theme = 'default' }) => {
  const diagramRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // 组件挂载时标记为已挂载
    isMounted.current = true;
    
    const renderMermaid = async () => {
      if (!chart || !diagramRef.current) return;
      
      try {
        // 动态导入 mermaid
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        
        // 生成唯一 ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // 配置 mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          flowchart: {
            htmlLabels: true,
            curve: 'linear'
          },
          securityLevel: 'loose'
        });
        
        // 使用 mermaid.render 渲染 SVG
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted.current) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err) {
        if (isMounted.current) {
          console.error('Mermaid 渲染失败:', err);
          setError(err.message);
        }
      }
    };
    
    renderMermaid();
    
    // 清理函数
    return () => {
      isMounted.current = false;
    };
  }, [chart, theme]);
  
  if (error) {
    return (
      <Alert variant="warning" className="my-3">
        <Alert.Heading>Mermaid 图表渲染失败</Alert.Heading>
        <pre className="bg-light p-3 rounded small">{chart}</pre>
        <hr />
        <p className="mb-0 text-muted">错误信息: {error}</p>
      </Alert>
    );
  }
  
  return (
    <div className="mermaid-diagram text-center my-4">
      <div ref={diagramRef}>
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <div style={{ minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="text-muted">
              <Spinner animation="border" size="sm" className="me-2" />
              正在渲染图表...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 导航项组件
const NavItem = ({ item, currentDocPath, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = currentDocPath === item.path;

  const getIcon = () => {
    return '📂'
  };
  
  return (
    <Nav.Item className={`mb-1 level-${level}`}>
      <div className="d-flex align-items-center">
        {hasChildren ? (
          <Button
            variant="link"
            size="sm"
            className="p-0 me-1 text-muted border-0"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ width: '24px', height: '24px' }}
          >
            {isExpanded ? '▼' : '▶'}
          </Button>
        ) : (
          <div style={{ width: '24px', height: '24px' }} className="me-1"></div>
        )}
        <Nav.Link
          as={Link}
          to={item.routePath}
          className={`d-flex align-items-center justify-content-between text-decoration-none py-2 px-3 rounded ${
            isActive 
              ? 'bg-primary text-white' 
              : 'text-body bg-transparent'
          }`}
          style={{ 
            marginLeft: level > 0 ? `${level * 16}px` : '0',
            flex: 1
          }}
        >
          <span className="d-flex align-items-center">
            <span className="me-2">{getIcon()}</span>
            <span className={hasChildren ? 'fw-semibold' : ''}>
              {item.title}
            </span>
          </span>
          {isActive && <Badge bg="light" text="dark" className="ms-2">●</Badge>}
        </Nav.Link>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1" style={{ marginLeft: '24px' }}>
          {item.children.map(child => (
            <NavItem
              key={child.id}
              item={child}
              currentDocPath={currentDocPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </Nav.Item>
  );
};

// 主文档组件
const Docs = ({ theme }) => {
  const { '*': docPath } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navLoading, setNavLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNavigation, setFilteredNavigation] = useState([]);

  const currentDocPath = docPath || 'introduction';

  // 搜索功能
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredNavigation(navigation);
      return;
    }
    
    const searchResults = [];
    const searchLower = query.toLowerCase();
    
    const searchInNode = (node) => {
      const nodeMatches = node.title.toLowerCase().includes(searchLower);
      let childrenMatches = [];
      
      if (node.children && node.children.length > 0) {
        childrenMatches = node.children.map(searchInNode).filter(Boolean);
      }
      
      if (nodeMatches || childrenMatches.length > 0) {
        return {
          ...node,
          children: childrenMatches.length > 0 ? childrenMatches : node.children
        };
      }
      
      return null;
    };
    
    navigation.forEach(section => {
      const filteredSection = searchInNode(section);
      if (filteredSection) {
        searchResults.push(filteredSection);
      }
    });
    
    setFilteredNavigation(searchResults);
  };

  // 如果没有指定文档路径，获取第一个文档的路径并重定向
  useEffect(() => {
    const initialize = async () => {
      if (!docPath) {
        try {
          const firstPath = await getFirstDocPath();
          navigate(`/docs/${firstPath}`, { replace: true });
        } catch (err) {
          console.error('获取第一个文档失败:', err);
        }
      }
    };
    
    initialize();
  }, [docPath, navigate]);

  // 加载导航配置
  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const navConfig = await getNavigation();
        setNavigation(navConfig);
        setFilteredNavigation(navConfig);
      } catch (err) {
        console.error('加载导航失败:', err);
        setError('加载导航配置失败');
      } finally {
        setNavLoading(false);
      }
    };
    
    loadNavigation();
  }, []);

  // 加载文档内容
  useEffect(() => {
    const loadDoc = async () => {
      if (!docPath) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const markdownContent = await getDocContent(docPath);
        setContent(markdownContent);
      } catch (err) {
        console.error('加载文档失败:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (docPath && !navLoading) {
      loadDoc();
    }
  }, [docPath, navLoading]);

  // 代码和 mermaid 图表组件
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (!inline && language === 'mermaid') {
      const codeString = String(children).replace(/\n$/, '');
      return <MermaidDiagram chart={codeString} theme={theme} />;
    }
    
    return !inline && language ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  // 计算总文档数
  const getTotalDocs = (navItems) => {
    let count = 0;
    const countItems = (items) => {
      items.forEach(item => {
        count++;
        if (item.children && item.children.length > 0) {
          countItems(item.children);
        }
      });
    };
    countItems(navItems);
    return count;
  };

  // 渲染侧边栏
  const renderSidebar = () => {
    if (navLoading) {
      return (
        <Card className="h-100">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2">加载导航中...</div>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className="h-100">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <span className="fs-4 me-2">📂</span>
            <div>
              <h5 className="mb-0">Qexed 文档</h5>
              <small>文档中心</small>
            </div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <Badge bg="light" text="dark" className="me-2">
              {theme === 'dark' ? '🌙' : '☀️'}
            </Badge>
            <small>{theme === 'dark' ? '暗色主题' : '亮色主题'}</small>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0 d-flex flex-column">
          {/* 搜索框 */}
          <div className="p-3 border-bottom">
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="搜索文档..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </div>
          
          {/* 文档统计 */}
          <div className="p-3 border-bottom d-flex justify-content-between text-muted small">
            <span>📚 共 {getTotalDocs(navigation)} 篇文档</span>
            <span>📊 最近更新</span>
          </div>
          
          {/* 导航 */}
          <div className="flex-grow-1" style={{ overflowY: 'auto'}}>
            <Nav className="flex-column p-3">
              {(searchQuery ? filteredNavigation : navigation).map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  currentDocPath={currentDocPath}
                />
              ))}
            </Nav>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Row className="g-4">
          <Col lg={3}>
            {renderSidebar()}
          </Col>
          <Col lg={9}>
            <Card>
              <Card.Body className="text-center py-5">
                <Spinner animation="border" variant="primary" size="lg" />
                <div className="mt-3">正在加载文档...</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Row className="g-4">
          <Col lg={3}>
            {renderSidebar()}
          </Col>
          <Col lg={9}>
            <Alert variant="danger">
              <Alert.Heading>加载文档时出错</Alert.Heading>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button as={Link} to="/docs" variant="outline-danger">
                  返回文档首页
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col lg={3}>
          {renderSidebar()}
        </Col>
        <Col lg={9}>
          <Card>
            <Card.Body>
              <article className="docs-article">
                <ReactMarkdown
                  components={{
                    code: CodeBlock,
                    a: CustomLink,
                    img: CustomImage
                  }}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {content}
                </ReactMarkdown>
              </article>
              
              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    发现错误？{' '}
                    <a 
                      href={`https://github.com/qexed/qexed-doc/edit/main/public/docs/${currentDocPath}.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      编辑此页面
                    </a>
                  </small>
                </div>
                <div>
                  {/* 可以添加上一篇/下一篇导航 */}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Docs;