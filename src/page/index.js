import { Container, Row, Col, Card } from 'react-bootstrap';

const Index = () => (
  <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
    {/* 保持原有内容结构 */}
    <Card className="border-0 shadow-lg" style={{ maxWidth: '800px' }}>
      <Card.Body className="text-center p-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img 
              src={`${process.env.PUBLIC_URL}/image/index.png`}
              alt="首页 插图"
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
              <h1 className="display-4 fw-bold text-primary mb-3">欸,你直接访问首页干啥</h1>
              <h2 className="h3 mb-3">你找错了吧</h2>
              <p className="lead text-muted mb-4">
                Qexed 文档开源项目在这里
              </p>
              <a 
                href="https://github.com/qexed/Qexed 文档" 
                className="btn btn-primary px-5 py-3"
                style={{ borderRadius: '2rem' }}
              >
                Qexed 文档 项目地址
              </a>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Container>
);
export default Index;