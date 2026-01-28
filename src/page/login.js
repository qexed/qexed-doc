
import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
const Login = ({ onLogin }) => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        agreed: false,

    });
    const [errors, setErrors] = useState({
        phone: '',
        password: '',
        general: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    // ============ 初始化验证 ============

    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };
    const validateForm = () => {
        const newErrors = {
            phone: EMAIL_REGEX.test(formData.phone) ? '' : '请输入有效的邮箱',
            password: formData.password.length >= 6 ? '' : '密码至少需要6位',
            general: formData.agreed ? '' : '请同意用户协议'
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/login', {
                phone: formData.phone,
                password: await hashPassword(formData.password),
                appid: searchParams.get('appid') || '',
            });

            localStorage.setItem('authToken', response.data.token);
            // 处理返回的appurl
            if (response.data.appurl) {

                // 检测URL格式
                if (response.data.appurl.startsWith('/')) {
                    // 使用客户端路由导航（保留SPA状态）
                    navigate(response.data.appurl);
                } else {

                    // 完整页面跳转（处理外部链接）
                    window.location.href = response.data.appurl;
                }
            } else {
                navigate("/authorization")
            }
        } catch (error) {
            localStorage.removeItem('authToken');
            setErrors(prev => ({
                ...prev,
                general: error.response?.data?.message || '登录失败，请检查网络连接'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'agreed' ? checked : value
        }));

        // 实时验证
        if (id === 'phone') {
            setErrors(prev => ({
                ...prev,
                phone: EMAIL_REGEX.test(value) ? '' : '请输入有效的邮箱'
            }));
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
                                alt="登录插图"
                                className="img-fluid"
                                style={{
                                    filter: 'drop-shadow(0 0 2rem rgba(0, 102, 255, 0.2))',
                                    userSelect: 'none',
                                    pointerEvents: 'none'
                                }}
                            />
                        </Col>

                        <Col xs={12} md={6}>
                            <h2 className="h3 mb-4">账户登录</h2>

                            {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label>邮箱</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="输入邮箱"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.phone}
                                        pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        我们绝不会与他人共享您的信息
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>密码</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="输入密码"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.password}
                                        minLength="6"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="agreed">
                                    <Form.Check
                                        type="checkbox"
                                        required
                                        label={
                                            <span className="text-muted">
                                                我已阅读并同意
                                                <Link
                                                    to="/user-agreement"
                                                    className="text-primary ms-1"
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
                                                </Link>
                                            </span>
                                        }
                                        checked={formData.agreed}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        ) : '登录'}
                                    </Button>
                                </div>

                                <Row className="mt-3 text-center">
                                    <Col>
                                        <Link to="/enroll" className="me-3">注册账户</Link>
                                        <Link to="/reset">重置密码</Link>
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

Login.propTypes = {
    onLogin: PropTypes.func
};

export default Login;