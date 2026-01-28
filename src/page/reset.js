import { useState, useEffect, } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Reset = () => {
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
  });
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // 密码强度正则表达式
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[\w\W]{8,}$/;

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 实时密码验证
  const validatePassword = (password, confirmPassword) => {
    if (!PASSWORD_REGEX.test(password)) {
      return "必须包含大小写字母和数字，至少8位";
    }
    if (confirmPassword && password !== confirmPassword) {
      return "两次输入的密码不一致";
    }
    return '';
  };

  // 处理输入变化
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prevFormData => {
      // 使用函数式更新保证获取最新值
      const newFormData = { ...prevFormData, [id]: value };

      // 当修改任一密码字段时触发验证
      if (id === 'password' || id === 'confirmPassword') {

        setErrors(prevErrors => ({
          ...prevErrors,
          password: validatePassword(newFormData.password, newFormData.confirmPassword)
        }));
      }

      return newFormData;
    });
  };
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };
  // 发送验证码
  const handleSendCode = async () => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.phone)) {
      setErrors({ ...errors, general: '请输入有效的邮箱' });
      return;
    }

    try {
      const response = await fetch('/api/send_reset_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      if (!response.ok) throw new Error('发送失败');

      setCountdown(60);
      setErrors({ ...errors, general: '' });
    } catch (err) {
      setErrors({ ...errors, general: err.message });
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
  // 提交重置请求
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 开始提交，禁用按钮
    const passwordError = validatePassword(formData.password);
    if (passwordError || formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, password: passwordError || "两次输入的密码不一致" });
      setIsSubmitting(false); // 验证失败，启用按钮
      return;
    }
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          code: formData.code,
          new_password: await hashPassword(formData.password)
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '重置失败');
      setSuccess(true);
      setErrors({ password: '', general: '' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setErrors({ ...errors, general: err.message });
    } finally {
      setIsSubmitting(false); // 无论成功或失败，启用按钮
    }
  };
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <Card className="border-0 shadow-lg" style={{ maxWidth: '800px' }}>
        <Card.Body className="p-3 p-md-5">
          <Row className="align-items-center">
            <Col md={6} className="d-none d-md-block text-center">
              <img
                src={`${process.env.PUBLIC_URL}/image/login.png`}
                alt="重置密码"
                className="img-fluid"
                style={{
                  filter: 'drop-shadow(0 0 2rem rgba(0, 102, 255, 0.2))',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </Col>

            <Col xs={12} md={6}>
              <h2 className="h3 mb-4">账户重置</h2>

              {errors.general && <Alert variant="danger">{errors.general}</Alert>}
              {errors.password && <Alert variant="danger">{errors.password}</Alert>}
              {success && <Alert variant="success">密码重置成功，正在跳转登录页...</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>邮箱</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="输入邮箱"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    我们绝不会与他人共享您的信息
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="code">
                  <Form.Label>验证码</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      placeholder="6位验证码"
                      minLength="6"
                      maxLength="6"
                      value={formData.code}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      variant="outline-primary"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || !formData.phone}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>新密码</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="输入新密码"
                    value={formData.password}
                    onChange={handleChange}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[\w\W]{8,}$"
                    required
                  />
                  <Form.Text className="text-muted">
                    必须包含大小写字母和数字，至少8位
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>确认新密码</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="再次输入密码"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* 新增重置密码按钮 */}
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !formData.phone || !formData.code || !formData.password || !formData.confirmPassword}
                >
                  {isSubmitting ? '处理中...' : '重置密码'}
                </Button>

                <Row className="text-center">
                  <Col>
                    <Link to="/enroll" className="me-3">注册账户</Link>
                    <Link to="/login">登录账户</Link>
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

export default Reset;