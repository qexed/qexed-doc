// page/index.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Spinner, ProgressBar, ListGroup } from 'react-bootstrap';
import { 
  Cpu, Server,  Shield, Code, Download, 
  Github, Terminal, Plug,  Globe, 
  Award, BarChart, CpuFill, Memory, Wifi//Users,Zap,
} from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [playerCount, setPlayerCount] = useState(0);
  const [tps, setTps] = useState(20.0);
  const [serverStatus, setServerStatus] = useState('online');

  // 模拟实时数据
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount(prev => {
        const newCount = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(0, Math.min(100, newCount));
      });
      setTps(prev => (Math.random() * 0.5 + 19.5).toFixed(1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Cpu size={24} />,
      title: 'Rust 高性能',
      description: '基于 Rust 语言开发，极致的性能表现',
      color: 'danger',
      metric: 'TPS: 20+',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #7C2D12 100%)'
    },
    // {
    //   icon: <Server size={24} />,
    //   title: '稳定运行',
    //   description: '长时间运行无内存泄漏，高稳定性',
    //   color: 'success',
    //   metric: 'Uptime: 99.9%',
    //   gradient: 'linear-gradient(135deg, #059669 0%, #065F46 100%)'
    // },
    // {
    //   icon: <Shield size={24} />,
    //   title: '安全可靠',
    //   description: '内置防刷、反作弊机制',
    //   color: 'primary',
    //   metric: '0 漏洞记录',
    //   gradient: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
    // },
    // {
    //   icon: <Zap size={24} />,
    //   title: '低延迟',
    //   description: '优化的网络协议，极低的延迟',
    //   color: 'warning',
    //   metric: '< 20ms',
    //   gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)'
    // }
  ];

  const quickStart = [
    { 
      step: 1, 
      title: '下载', 
      description: '下载最新的服务器文件',
      command: 'curl -L https://qexed.com/download/latest',
      color: '#3B82F6'
    },
    { 
      step: 2, 
      title: '启动', 
      description: '运行服务器',
      command: './qexed_one',
      color: '#10B981'
    },
    { 
      step: 3, 
      title: '配置', 
      description: '修改配置文件',
      command: 'nano config/qexed.toml',
      color: '#8B5CF6'
    },
    { 
      step: 4, 
      title: '连接', 
      description: '玩家连接服务器',
      command: 'mc.qexed.com:25565',
      color: '#F59E0B'
    }
  ];

  const stats = {
    currentPlayers: playerCount,
    maxPlayers: 100,
    tps: tps,
    uptime: '30天',
    cpuUsage: '15%',
    memoryUsage: '2.1GB',
    version: '1.21.8',
    rustVersion: '1.75.0'
  };

  const recentUpdates = [
    { version: 'v2.1.0', date: '2026-01-28', description: '优化区块加载性能' },
    { version: 'v2.0.1', date: '2026-01-20', description: '修复实体同步问题' },
    { version: 'v2.0.0', date: '2026-01-15', description: '支持 Minecraft 1.21.8' },
  ];

  return (
    <div className="minecraft-homepage">
      {/* Hero Section with Minecraft Theme */}
      <section className="minecraft-hero">
        <div className="hero-bg">
          <div className="grid-bg"></div>
          <div className="particles"></div>
        </div>
        
        <Container className="position-relative">
          <Row className="align-items-center min-vh-100 py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <Badge bg="dark" className="mb-3 px-3 py-2 d-inline-flex align-items-center border border-success">
                <CpuFill className="me-2" /> 基于 Rust 的 Minecraft 服务器
              </Badge>
              
              <h1 className="display-3 fw-bold mb-4 text-white">
                <span className="text-gradient-primary">Qexed</span>
                <div className="version-badge">v{stats.version}</div>
              </h1>
              
              <h2 className="h1 mb-4 text-light">下一代高性能</h2>
              <h3 className="h1 fw-bold mb-4 text-warning">Minecraft 服务器</h3>
              
              <p className="lead text-light mb-4 opacity-75" style={{ fontSize: '1.25rem' }}>
                专为 Minecraft 1.21.8 优化的 Rust 服务端。
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button 
                  size="lg" 
                  variant="success"
                  className="px-4 py-3 fw-semibold d-flex align-items-center minecraft-btn"
                  onClick={() => navigate('/getting-started')}
                >
                  <Download className="me-2" />
                  立即下载
                </Button>
                
                <Button 
                  variant="outline-light" 
                  size="lg"
                  className="px-4 py-3 fw-semibold d-flex align-items-center"
                  href="https://github.com/qexed/qexed"
                  target="_blank"
                >
                  <Github className="me-2" />
                  GitHub
                </Button>
                
                <Button 
                  variant="outline-info" 
                  size="lg"
                  className="px-4 py-3 fw-semibold"
                  onClick={() => navigate('/docs')}
                >
                  <Terminal className="me-2" />
                  文档
                </Button>
              </div>
              
              <div className="d-flex flex-wrap gap-4 text-light opacity-75">
                <div className="d-flex align-items-center">
                  <div className="server-status-indicator online me-2"></div>
                  <span>服务器状态: {serverStatus === 'online' ? '在线' : '离线'}</span>
                </div>
                <div className="d-flex align-items-center">
                  {/* <Users className="me-2" /> */}
                  <span>{stats.currentPlayers}/{stats.maxPlayers} 在线玩家</span>
                </div>
                <div className="d-flex align-items-center">
                  {/* <Zap className="me-2" /> */}
                  <span>TPS: {stats.tps}</span>
                </div>
              </div>
            </Col>
            
            <Col lg={6}>
              <div className="minecraft-terminal position-relative">
                <div className="terminal-header">
                  <div className="dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="terminal-title">server@qexed:~</div>
                </div>
                <div className="terminal-body">
                  <pre className="mb-0">
                    <code>
{`$ ./qexed-server --version
Qexed Server v${stats.version}
基于 Rust ${stats.rustVersion}
支持 Minecraft 1.21.8

$ ./qexed-server --performance
TPS: ${stats.tps}
内存使用: ${stats.memoryUsage}
CPU使用率: ${stats.cpuUsage}
在线玩家: ${stats.currentPlayers}/${stats.maxPlayers}

$ tail -f server.log
[12:00:00] 服务器已启动
[12:00:01] 加载了 512 个区块
[12:00:02] 玩家 steve 加入游戏
[12:00:03] 玩家 alex 加入游戏
[12:00:05] 自动保存完成`}
                    </code>
                  </pre>
                </div>
              </div>
              
              {/* 实时数据仪表盘 */}
              <Card className="mt-4 border-0 bg-dark text-light stats-card">
                <Card.Body>
                  <h5 className="mb-3">
                    <BarChart className="me-2" />
                    实时服务器状态
                  </h5>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div className="stat-item">
                        <div className="d-flex justify-content-between mb-1">
                          <small>玩家数量</small>
                          <small>{stats.currentPlayers}/{stats.maxPlayers}</small>
                        </div>
                        <ProgressBar 
                          now={(stats.currentPlayers / stats.maxPlayers) * 100} 
                          variant="success"
                          className="minecraft-progress"
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="stat-item">
                        <div className="d-flex justify-content-between mb-1">
                          <small>TPS</small>
                          <small>{stats.tps}/20.0</small>
                        </div>
                        <ProgressBar 
                          now={(stats.tps / 20) * 100} 
                          variant={stats.tps >= 19 ? 'success' : 'warning'}
                          className="minecraft-progress"
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="stat-item">
                        <div className="d-flex justify-content-between mb-1">
                          <small>CPU 使用</small>
                          <small>{stats.cpuUsage}</small>
                        </div>
                        <ProgressBar 
                          now={15} 
                          variant="info"
                          className="minecraft-progress"
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="stat-item">
                        <div className="d-flex justify-content-between mb-1">
                          <small>内存</small>
                          <small>{stats.memoryUsage}</small>
                        </div>
                        <ProgressBar 
                          now={45} 
                          variant="primary"
                          className="minecraft-progress"
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-dark text-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3 text-light">核心特性</h2>
            <p className="text-muted">专为 Minecraft 服务器优化</p>
          </div>
          
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index}>
                <Card 
                  className="border-0 bg-dark-light feature-card hover-lift"
                  style={{ 
                    background: `linear-gradient(135deg, #1F2937 0%, #111827 100%)`,
                    border: '1px solid #374151'
                  }}
                >
                  <Card.Body className="p-4 text-center">
                    <div 
                      className="feature-icon mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        background: feature.gradient,
                        width: '60px',
                        height: '60px'
                      }}
                    >
                      {feature.icon}
                    </div>
                    <Card.Title className="h5 mb-3 text-light">{feature.title}</Card.Title>
                    <Card.Text className="text-muted mb-3">{feature.description}</Card.Text>
                    <Badge bg="dark" text="light" className="px-3 py-2 border border-secondary">
                      {feature.metric}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Quick Start */}
      <section className="quick-start-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3 text-light">快速开始</h2>
            <p className="text-muted">只需4步，部署你的 Minecraft 服务器</p>
          </div>
          
          <Row className="g-4 justify-content-center">
            {quickStart.map((step, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className="border-0 bg-dark text-light h-100 step-card" style={{ border: '1px solid #374151' }}>
                  <Card.Body className="p-4 text-center position-relative">
                    <div 
                      className="step-number mb-3 mx-auto text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        background: step.color,
                        width: '50px',
                        height: '50px',
                        border: '2px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <span className="h4 mb-0 fw-bold">{step.step}</span>
                    </div>
                    <Card.Title className="h5 mb-3 text-light">{step.title}</Card.Title>
                    <div className="code-snippet bg-black rounded p-3 mb-3 font-monospace text-start border border-secondary">
                      <code className="text-light">{step.command}</code>
                    </div>
                    <Card.Text className="text-muted">{step.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          <div className="text-center mt-5">
            <Button 
              size="lg" 
              variant="outline-light"
              className="px-4"
              onClick={() => navigate('/getting-started')}
            >
              查看完整安装指南
            </Button>
          </div>
        </Container>
      </section>

      {/* Recent Updates & Stats */}
      <section className="updates-section py-5 bg-dark text-light">
        <Container>
          <Row className="g-4">
            <Col lg={8}>
              <Card className="border-0 bg-dark-light h-100" style={{ border: '1px solid #374151' }}>
                <Card.Body className="p-4">
                  <h4 className="mb-4 text-light">
                    <Globe className="me-2" />
                    近期更新
                  </h4>
                  <ListGroup variant="flush" className="bg-transparent">
                    {recentUpdates.map((update, index) => (
                      <ListGroup.Item 
                        key={index} 
                        className="bg-transparent text-light border-secondary"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Badge bg="primary" className="px-3">{update.version}</Badge>
                          <small className="text-muted">{update.date}</small>
                        </div>
                        <p className="mb-0">{update.description}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="border-0 bg-dark-light h-100" style={{ border: '1px solid #374151' }}>
                <Card.Body className="p-4">
                  <h4 className="mb-4 text-light">
                    <Award className="me-2" />
                    性能指标
                  </h4>
                  <div className="performance-stats">
                    {[
                      { label: '区块加载速度', value: '2.3x', desc: '比原版快' },
                      { label: '内存使用', value: '-60%', desc: '相比 Paper' },
                      { label: '启动时间', value: '5s', desc: '从启动到可连接' },
                      { label: '网络延迟', value: '-40%', desc: '延迟优化' }
                    ].map((stat, idx) => (
                      <div key={idx} className="performance-stat mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-muted">{stat.label}</span>
                          <span className="text-success fw-bold">{stat.value}</span>
                        </div>
                        <small className="text-muted">{stat.desc}</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5" style={{ background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)' }}>
        <Container>
          <Row className="align-items-center text-center text-lg-start">
            <Col lg={8} className="mb-4 mb-lg-0">
              <h2 className="h1 mb-3 text-white">准备好开始了吗？</h2>
              <p className="lead mb-0 opacity-75 text-light">
                立即下载 Qexed，体验基于 Rust 的高性能 Minecraft 服务器
              </p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Button 
                size="lg" 
                variant="light" 
                className="px-4 py-3 fw-semibold"
                onClick={() => navigate('/getting-started')}
              >
                立即开始
                <Download className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Index;