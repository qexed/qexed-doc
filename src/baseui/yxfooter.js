// baseui/yxfooter.jsx
import { Container, Row, Col } from 'react-bootstrap';

const YXFooter = ({ theme, style }) => {

  // 青绿色主题配色
  const cyanTheme = {
    light: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      text: '#0f766e',
      lightBg: '#f0fdfa',
      border: '#99f6e4',
      hover: '#0f766e'
    },
    dark: {
      primary: '#2dd4bf',
      secondary: '#5eead4',
      text: '#ccfbf1',
      darkBg: '#134e4a',
      border: '#5eead4',
      hover: '#5eead4'
    }
  };

  const colors = theme === 'dark' ? cyanTheme.dark : cyanTheme.light;

  return (
    <Container 
      fluid 
      className={`yx-footer py-3 ${theme === 'dark' ? 'text-light' : ''}`}
      style={{
        backgroundColor: theme === 'dark' ? colors.darkBg : colors.lightBg,
        borderTop: `1px solid ${colors.border}`,
        marginTop: 'auto',
        ...style
      }}
    >
      {/* 主要信息行 */}
      <Row className="align-items-center justify-content-center g-2">
        {/*公安备案 */}
        <Col xs={12} md="auto" className="text-center">
          <a 
            href="https://beian.mps.gov.cn/#/query/webSearch?code=还没搞"
            className="icp-link text-decoration-none"
            style={{
              color: colors.primary,
              fontSize: '0.8rem',
              borderBottom: `1px dashed ${colors.primary}`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.8';
              e.target.style.color = colors.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.color = colors.primary;
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/image/gonganbeianico.png`}
              alt="公安备案ico"
              className="img-fluid"
              style={{

              }}
            />
            公安备案: 还没搞
          </a>
        </Col>
        {/* 分隔符 */}
        <Col xs="auto" className="d-none d-md-block">
          <div 
            className="px-2"
            style={{ 
              color: colors.secondary,
              fontSize: '0.8rem'
            }}
          >
            |
          </div>
        </Col>

        {/* ICP备案信息 */}
        <Col xs={12} md="auto" className="text-center">
          <a 
            href="https://beian.miit.gov.cn/"
            className="icp-link text-decoration-none"
            style={{
              color: colors.primary,
              fontSize: '0.8rem',
              borderBottom: `1px dashed ${colors.primary}`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.8';
              e.target.style.color = colors.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.color = colors.primary;
            }}
          >
            ICP备案号: <a href="https://beian.miit.gov.cn/">苏ICP备2026006589号-1</a>
          </a>
        </Col>

        {/* 分隔符 */}
        <Col xs="auto" className="d-none d-md-block">
          <div 
            className="px-2"
            style={{ 
              color: colors.secondary,
              fontSize: '0.8rem'
            }}
          >
            |
          </div>
        </Col>

        {/* GitHub链接 */}
        <Col xs={12} md="auto" className="text-center text-md-end">
          <a 
            href="https://github.com/qexed/qexed-doc"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link text-decoration-none d-inline-flex align-items-center"
            style={{
              color: colors.primary,
              fontSize: '0.8rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.hover;
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.primary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="currentColor" 
              className="me-1"
              style={{ flexShrink: 0 }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub 开源
          </a>
        </Col>
      </Row>

      {/* 移动端额外的信息行 */}
      <Row className="d-md-none mt-2">
        <Col xs={12} className="text-center">
          <div 
            style={{ 
              color: colors.secondary,
              fontSize: '0.75rem',
              lineHeight: '1.4'
            }}
          >
            MIT License • 欢迎贡献代码
          </div>
        </Col>
      </Row>

      {/* 主题信息（桌面端显示） */}
      <Row className="d-none d-md-flex mt-2">
        <Col xs={12} className="text-center">
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              color: colors.secondary,
              fontSize: '0.75rem'
            }}
          >
            <div 
              className="theme-indicator me-2"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                animation: theme === 'dark' ? 'pulse 2s infinite' : 'none'
              }}
            ></div>
            当前主题: {theme === 'dark' ? '暗色' : '亮色'} • MIT License
          </div>
        </Col>
      </Row>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .yx-footer {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @media (max-width: 768px) {
          .yx-footer {
            padding: 1rem 0.5rem !important;
          }
          
          .version-badge {
            font-size: 0.7rem !important;
            padding: 0.25rem 0.5rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .yx-footer {
            font-size: 0.8rem;
          }
          
          .github-link,
          .icp-link {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default YXFooter;