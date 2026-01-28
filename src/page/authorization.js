import React, { useEffect, useState } from 'react';
import {
    Container,
    Card,
    Button,
    Alert,
    Spinner,
    ListGroup,
    Row,
    Col,
    Form
} from 'react-bootstrap';
import * as icons from 'react-bootstrap-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ================= 主组件 =================
const AuthPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const appId = params.get('appid');
    const [app_name, setapp_name] = useState("未知应用")
    const [app_author, setapp_author] = useState("未知作者")
    // 状态管理
    const [status, setStatus] = useState('loading'); // loading | auth_required | success | error
    const [permissions, setPermissions] = useState([]);
    const [selectedPerms, setSelectedPerms] = useState([]);
    const [error, setError] = useState("")
    // ============ 初始化验证 ============
    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            if (!appId) {
                navigate(`/login`);
                return;
            }
            navigate(`/login?appid=${appId}`);
            return;
        }

        verifyToken(token);
    }, []);

    const verifyToken = async (token) => {
        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "app_id": appId })
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error)
                setStatus('error');
            } else
                if (data.need_update) {
                    initPermissions(data.permissions);
                    setStatus('auth_required');
                    setapp_name(data.app_name);
                    setapp_author(data.app_author);
                    setSelectedPerms(data.selete_permissions);
                } else {
                    window.location.href = data.app_url;
                }
        } catch (error) {
            if (error.error) {
                setError(error.error)
            } else {
                setError(error)
                setStatus('error');
            }

        }
    };
    // ============ APP名字  ===========

    // ============ 权限管理 ============
    const initPermissions = (perms) => {
        const defaultSelected = perms
            .filter(p => p.required)
            .map(p => p.id);

        setPermissions(perms);
        setSelectedPerms(defaultSelected);
    };

    const togglePermission = (permId, isRequired) => {
        if (isRequired) return;

        setSelectedPerms(prev =>
            prev.includes(permId)
                ? prev.filter(id => id !== permId)
                : [...prev, permId]
        );
    };

    // ============ 提交处理 ============
    const handleSubmit = async () => {
        setStatus('submitting');

        try {
            const res = await fetch('/api/authorize', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    app_id: appId,
                    permissions: selectedPerms,
                    timestamp: Date.now()
                })
            });
            const data = await res.json()
            if (data.error) {
                setError(data.error)
                setStatus('error');
            } else
                if (res.ok) {
                    window.location.href = data.app_url;
                } else {
                    throw new Error('授权失败');
                }
        } catch (error) {
            if (error.error) {
                setError(error.error)
                setStatus('error');
            } else {
                setError(error)
                setStatus('error');
            }
        }
    };

    // ============ 渲染逻辑 ============
    if (status === 'loading') {
        return <LoadingScreen />;
    }

    if (status === 'error') {
        return <ErrorScreen error={error} />;
    }

    return (
        <AuthInterface
            appId={appId}
            permissions={permissions}
            selectedPerms={selectedPerms}
            setSelectedPerms={setSelectedPerms}
            onToggle={togglePermission}
            onSubmit={handleSubmit}
            isSubmitting={status === 'submitting'}
            app_name={app_name}
            app_author={app_author}
        />
    );
};

// ================= 子组件 =================
const LoadingScreen = () => (
    <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <h3 className="mt-3">正在验证您的身份...</h3>
    </Container>
);

const ErrorScreen = (error) => (
    <Container className="mt-5">
        <Alert variant="danger" className="shadow">
            <Alert.Heading>
                <icons.ExclamationTriangle className="me-2" />
                处理授权请求时出错
            </Alert.Heading>
            {error !== null ? (
                <div>
                    <p>具体原因：</p>
                    <ul>
                        <li>
                            {(() => {
                                if (typeof error === 'string') {
                                    try {
                                        // 尝试处理可能存在的 JSON 字符串
                                        const parsed = JSON.parse(error);
                                        return parsed.error || error;
                                    } catch {
                                        return error;
                                    }
                                } else if (typeof error === 'object' && error !== null) {
                                    if (typeof error.error === 'string') {
                                        return error.error;
                                    }
                                    try {
                                        return JSON.stringify(error, null, 2);
                                    } catch {
                                        return '无法解析错误信息';
                                    }
                                } else {
                                    return String(error);
                                }
                            })()}
                        </li>
                    </ul>
                </div>
            ) : (
                <div>
                    <p>可能原因：</p>
                    <ul>
                        <li>应用配置不正确</li>
                        <li>网络连接问题</li>
                        <li>登录会话过期</li>
                    </ul>
                </div>
            )}

            <Button
                variant="outline-danger"
                onClick={() => window.location.reload()}
            >
                重试
            </Button>
        </Alert>
    </Container>
);

const AuthInterface = ({
    appId,
    permissions,
    selectedPerms,
    setSelectedPerms,
    onToggle,
    onSubmit,
    isSubmitting,
    app_name,
    app_author
}) => {
    const requiredPerms = permissions.filter(p => p.required);
    const optionalPerms = permissions.filter(p => !p.required);
    const allOptionalSelected = optionalPerms.every(p => selectedPerms.includes(p.id));

    return (
        <Container className="auth-container my-5">
            <Card className="shadow">
                <Card.Header className="bg-primary text-white p-4">
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <icons.ShieldCheck size={36} />
                        </Col>
                        <Col>
                            <h1 className="h3 mb-1">应用授权请求</h1>
                            <small className="opacity-75">应用: {app_name},</small>
                            <small className="opacity-75">开发者: {app_author}</small>

                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body>
                    <SecurityAlert />

                    <div className="permission-section">
                        <h5 className="text-muted mb-3">必需权限</h5>
                        <PermissionList
                            perms={requiredPerms}
                            selectedPerms={selectedPerms}
                            onToggle={onToggle}
                        />
                    </div>

                    {optionalPerms.length > 0 && (
                        <div className="permission-section mt-4">
                            <h5 className="text-muted mb-3">可选权限</h5>
                            <PermissionList
                                perms={optionalPerms}
                                selectedPerms={selectedPerms}
                                onToggle={onToggle}
                            />
                            <div className="mt-3">
                                <Form.Check
                                    type="switch"
                                    label="全选可选权限"
                                    checked={allOptionalSelected}
                                    onChange={e => handleSelectAll(e.target.checked)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="action-buttons mt-5">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onSubmit}
                            disabled={isSubmitting || !validatePermissions()}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    授权中...
                                </>
                            ) : '确认授权'}
                        </Button>

                        <Button
                            variant="outline-secondary"
                            size="lg"
                            className="ms-2"
                            onClick={() => window.history.back()}
                        >
                            取消
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );

    function handleSelectAll(checked) {
        const ids = optionalPerms.map(p => p.id);
        setSelectedPerms(prev =>
            checked ? [...new Set([...prev, ...ids])] : prev.filter(id => !ids.includes(id))
        );
    }

    function validatePermissions() {
        return requiredPerms.every(p => selectedPerms.includes(p.id));
    }
};

// ================= 辅助组件 =================
const SecurityAlert = () => (
    <Alert variant="warning" className="mb-4">
        <Alert.Heading>⚠️ 安全提示</Alert.Heading>
        <p>
            您正在授予以下权限给第三方应用，请确认：<br />
            1. 此应用的开发者可信<br />
            2. 权限范围在合理使用范围内<br />
            3. 授权后行为符合平台规范
        </p>
    </Alert>
);

const PermissionList = ({ perms, selectedPerms, onToggle, isRequired }) => (
    <ListGroup variant="flush">
        {perms.map(perm => (
            <ListGroup.Item key={perm.id} className="py-3">
                <Row className="align-items-center">
                    <Col xs={1}>
                        <div className="perm-icon">
                            {(typeof perm.icon === 'string' && perm.icon) ? (
                                // 类型验证通过后分类型处理
                                perm.icon.startsWith('http') ? (
                                    <img
                                        src={perm.icon}
                                        alt="perm-icon"
                                        style={{ width: 20, height: 20 }}
                                        onError={(e) => { // 增加图片加载失败处理
                                            e.target.style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    icons[perm.icon] ?
                                        React.createElement(icons[perm.icon], { size: 20 }) :
                                        <icons.QuestionCircle size={20} className="text-warning" />
                                )
                            ) : (
                                // 不合法值处理
                                <div className="icon-error">
                                    <icons.QuestionCircle size={20} className="text-danger" />
                                    {typeof perm.icon !== 'undefined' && (
                                        <span className="error-badge" title={`非法的图标类型: ${typeof perm.icon}`}>
                                            <icons.XCircleFill size={12} />
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col>
                        <h5 className="mb-1">{perm.name}</h5>
                        <p className="text-muted mb-0 small">{perm.description}</p>
                    </Col>
                    <Col xs={2}>
                        <Form.Check
                            type="switch"
                            checked={selectedPerms.includes(perm.id)}
                            onChange={() => onToggle(perm.id, isRequired)}
                            disabled={isRequired}
                        />
                    </Col>
                </Row>
            </ListGroup.Item>
        ))}
    </ListGroup>
);

export default AuthPage;