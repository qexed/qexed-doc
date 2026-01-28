import { useState, useEffect} from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Enroll = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    code: '',
    agreed: false
  });
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    general: ''
  });
  const [success, setSuccess] = useState(false);
  // 验证规则
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[\w\W]{8,}$/;
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };


  // 处理输入变化
  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'agreed' ? checked : value
    }));

    // 实时验证
    if (id === 'phone') {
      setErrors(prev => ({
        ...prev,
        phone: EMAIL_REGEX.test(value) ? '' : '邮箱格式不正确'
      }));
    }
    if (id === 'password') {
      setErrors(prev => ({
        ...prev,
        password: PASSWORD_REGEX.test(value) ? '' : '必须包含大小写字母和数字'
      }));
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!EMAIL_REGEX.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入有效的邮箱' }));
      return;
    }

    try {
      const response = await fetch('/api/send_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });

      if (!response.ok) throw new Error('验证码发送失败');

      setCountdown(60);
      setErrors({ ...errors, phone: '', general: '' });
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
    }
  };
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1); // 使用函数式更新避免闭包问题
      }, 1000);

      // 清理函数：组件卸载或countdown变化时清除定时器
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  // 提交注册
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      setErrors(prev => ({ ...prev, general: '请阅读并同意用户协议' }));
      return;
    }

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: await hashPassword(formData.password),
          code: formData.code
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || '注册失败');

      setSuccess(true);
      setErrors({ general: '' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <Card className="border-0 shadow-lg" style={{ maxWidth: '800px' }}>
        <Card.Body className="p-3 p-md-5">
          <Row className="align-items-center">
            <Col md={6} className="d-none d-md-block text-center">
              <img
                src={`${process.env.PUBLIC_URL}/image/Login.png`}
                alt="注册插图"
                className="img-fluid"
                style={{
                  filter: 'drop-shadow(0 0 2rem rgba(0, 102, 255, 0.2))',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </Col>

            <Col xs={12} md={6}>
              <h2 className="h3 mb-4">账户注册</h2>

              {errors.general && <Alert variant="danger">{errors.general}</Alert>}
              {success && <Alert variant="success">注册成功，正在跳转到登录页...</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>邮箱</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="输入邮箱"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                    required
                  />
                  <Form.Text className="text-muted">
                    我们绝不会与他人共享您的信息
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>密码</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="输入密码"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    pattern={PASSWORD_REGEX.source}
                    required
                  />
                  <Form.Text className="text-muted">
                    必须包含大小写字母和数字，至少8位
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="code">
                  <Form.Label>验证码</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      placeholder="6位验证码"
                      value={formData.code}
                      onChange={handleChange}
                      minLength="6"
                      maxLength="6"
                      required
                    />
                    <Button
                      variant="outline-primary"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || !formData.phone}
                    >
                      {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="agreed">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span className="text-muted">
                        我已阅读并同意
                        <a
                          href="/User_Agreement"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-primary ms-1"
                          style={{
                            transition: "color 0.2s",
                            borderBottom: "1px solid transparent"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#0d6efd';
                            e.target.style.borderBottomColor = '#0d6efd';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#0d6efd';
                            e.target.style.borderBottomColor = 'transparent';
                          }}
                        >
                          《Qexed 文档用户协议》
                        </a>
                      </span>
                    }
                    checked={formData.agreed}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg">
                    立即注册
                  </Button>
                </div>

                <Row className="text-center mt-3">
                  <Col>
                    <Link to="/login" className="me-3">已有账户？立即登录</Link>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Enroll;