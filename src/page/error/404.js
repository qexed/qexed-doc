import { Container, Row, Col, Card } from 'react-bootstrap';


const Page404 = () => (
  <Container className="d-flex align-items-center justify-content-center" style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }}>
    {/* 保持原有内容结构 */}
    <Card className="border-0 shadow-lg" style={{ maxWidth: '800px' }}>
      <Card.Body className="text-center p-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src={`${process.env.PUBLIC_URL}/image/404.png`}
              alt="404 插图"
              className="img-fluid"
              style={{
                filter: 'drop-shadow(0 0 2rem rgba(0, 102, 255, 0.2))',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />
          </Col>
          <Col md={6} className="mt-md-0 mt-4">
            <div className="text-md-start text-center">
              <h1 className="display-4 fw-bold text-primary mb-3">404</h1>
              <h2 className="h3 mb-3">页面迷路了</h2>
              <p className="lead text-muted mb-4">
                您访问的页面不存在或已被移除
                <br />
                请检查 URL 或返回首页
              </p>
              <a
                href="/"
                className="btn btn-primary px-5 py-3"
                style={{ borderRadius: '2rem' }}
              >
                返回首页
              </a>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Container>
);
export default Page404;