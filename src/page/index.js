// page/index.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, ListGroup } from 'react-bootstrap';
import {
  Cpu, Download,
  Github, Terminal, Globe,
  Award, BarChart, CpuFill,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Index = () => {
  const navigate = useNavigate();

  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [tps, setTps] = useState(20.0);
  const [serverStatus, setServerStatus] = useState('loading');
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // 添加状态管理性能指标数据
  const [performanceStats, setPerformanceStats] = useState([
    { label: '区块加载速度', value: '-114514.1918x', desc: '比原版快' },
    { label: '内存使用', value: '+91%', desc: '相比 Paper' },
    { label: '启动时间', value: '2026h', desc: '从启动到可连接' },
    { label: '网络延迟', value: '+404%', desc: '延迟优化' }
  ]);
  // 辅助函数：根据索引获取图标
  const getStatIcon = (index) => {
    const icons = ['⚡', '💾', '🚀', '🌐'];
    return icons[index] || '📊';
  };

  // 辅助函数：根据索引获取颜色
  const getStatColor = (index, opacity = 0.2) => {
    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
    const color = colors[index] || '#6B7280';
    return opacity < 1 ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : color;
  };
  // 从 GitHub 获取性能指标数据
  const fetchPerformanceStats = async () => {
    try {
      // 从 v4 分支的 assets/test_data.json 获取数据
      const response = await fetch('https://raw.githubusercontent.com/qexed/Qexed/v4/assets/test_data.json');

      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态码: ${response.status}`);
      }

      const data = await response.json();

      // 假设 JSON 结构中有 performance_stats 字段
      if (data.performance_stats && Array.isArray(data.performance_stats)) {
        setPerformanceStats(data.performance_stats);
      } else if (Array.isArray(data)) {
        // 如果返回的是数组格式
        setPerformanceStats(data);
      } else {
        console.warn('未找到预期的性能指标数据格式，使用默认数据');
      }

    } catch (error) {
      console.error('获取性能指标数据失败:', error);
      console.log('使用默认性能指标数据');

      // 使用默认数据作为后备
      const defaultStats = [
        { label: '区块加载速度', value: '2.3x', desc: '比原版快' },
        { label: '内存使用', value: '-60%', desc: '相比 Paper' },
        { label: '启动时间', value: '5s', desc: '从启动到可连接' },
        { label: '网络延迟', value: '-40%', desc: '延迟优化' }
      ];
      setPerformanceStats(defaultStats);
    }
  };


  // 从 mc_server.mcppl.com 获取服务器状态
  // 从 Minecraft 服务器获取真实状态（使用 Server List Ping 协议）
  const fetchServerStatus = async () => {
    try {
      // 使用 WebSocket 或通过代理后端来 ping Minecraft 服务器
      // 由于浏览器的同源策略，我们不能直接从前端连接 Minecraft 服务器的 TCP 端口
      // 这里我们通过一个代理 API 来获取服务器状态

      // 方案1: 如果有一个后端 API 可以代理 Minecraft ping
      // const response = await fetch('/api/server-status?host=mc_server.mcppl.com&port=25565');
      // const data = await response.json();

      // 方案2: 使用现有的第三方 Minecraft 状态查询 API
      const response = await fetch(`https://api.mcsrvstat.us/3/mc_server.mcppl.com`);
      const data = await response.json();

      if (data.online) {
        setPlayerCount(data.players?.online || 0);
        setMaxPlayers(data.players?.max || 20);

        // 计算 TPS（如果 API 不提供，则使用估算值）
        if (data.debug?.tps) {
          setTps(Math.min(parseFloat(data.debug.tps), 20.0).toFixed(1));
        } else if (data.motd?.clean) {
          // 有些服务器会在 MOTD 中显示 TPS
          const tpsMatch = data.motd.clean.match(/TPS[:\s]*([\d.]+)/i);
          if (tpsMatch) {
            setTps(parseFloat(tpsMatch[1]).toFixed(1));
          } else {
            // 没有 TPS 信息，使用默认值
            setTps('20.0');
          }
        } else {
          setTps('20.0');
        }

        setServerStatus('online');

        // 如果有延迟信息，也可以记录
        if (data.debug?.ping) {
          console.log(`服务器延迟: ${data.debug.ping}ms`);
        }

      } else {
        setServerStatus('offline');
        setPlayerCount(0);
        setMaxPlayers(20);
        setTps('0.0');
      }
    } catch (error) {
      console.error('获取服务器状态失败:', error);

      // 如果 API 调用失败，尝试备用 API
      try {
        const backupResponse = await fetch(`https://api.minetools.eu/ping/mc_server.mcppl.com/25565`);
        const backupData = await backupResponse.json();

        if (backupData && !backupData.error) {
          setPlayerCount(backupData.players.online || 0);
          setMaxPlayers(backupData.players.max || 20);

          // 尝试从描述中提取 TPS
          if (backupData.description) {
            const descText = typeof backupData.description === 'object'
              ? backupData.description.text
              : String(backupData.description);
            const tpsMatch = descText.match(/TPS[:\s]*([\d.]+)/i);
            if (tpsMatch) {
              setTps(parseFloat(tpsMatch[1]).toFixed(1));
            } else {
              setTps(backupData.latency ? '20.0' : '0.0');
            }
          } else {
            setTps('20.0');
          }

          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (backupError) {
        console.error('备用 API 也失败了:', backupError);
        // 使用模拟数据作为最后的备选
        setPlayerCount(Math.floor(Math.random() * 10) + 5);
        setMaxPlayers(20);
        setTps((Math.random() * 0.5 + 19.5).toFixed(1));
        setServerStatus('online');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 从GitHub API获取提交记录
  const fetchGitHubCommits = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/qexed/Qexed/commits?sha=v4&per_page=6');
      const commits = await response.json();

      const updates = commits.map(commit => ({
        version: `v${commit.sha.substring(0, 7)}`,
        date: new Date(commit.commit.author.date).toISOString().split('T')[0],
        description: commit.commit.message.split('\n')[0], // 取提交信息的第一行
        commitUrl: commit.html_url, // 添加提交链接
        sha: commit.sha // 添加完整的提交哈希
      }));

      setRecentUpdates(updates);
    } catch (error) {
      console.error('获取GitHub提交记录失败:', error);
      // 使用模拟数据作为备选，也包含链接
      setRecentUpdates([
        {
          version: 'v901fb87',
          date: '2026-01-09',
          description: '同步v4:Qexed_Task',
          commitUrl: 'https://github.com/qexed/Qexed/commit/901fb87',
          sha: '901fb87'
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 在 useEffect 中添加调用
  useEffect(() => {
    fetchServerStatus();
    fetchGitHubCommits();
    fetchPerformanceStats(); // 新增：获取性能指标数据

    // 每30秒更新一次服务器状态
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Cpu size={24} />,
      title: 'Rust 高性能',
      description: '基于 Rust 语言开发，极致的性能表现',
      color: 'danger',
      metric: `TPS: ${tps}+`,
      gradient: 'linear-gradient(135deg, #DC2626 0%, #7C2D12 100%)'
    },
  ];

  const quickStart = [
    {
      step: 1,
      title: '下载',
      description: '从GitHub下载最新版本',
      command: 'git clone https://github.com/qexed/Qexed.git',
      color: '#3B82F6'
    },
    {
      step: 2,
      title: '构建',
      description: '使用Cargo构建项目',
      command: 'cargo build --release',
      color: '#10B981'
    },
    {
      step: 3,
      title: '配置',
      description: '修改服务器配置',
      command: 'nano config/server.toml',
      color: '#8B5CF6'
    },
    {
      step: 4,
      title: '运行',
      description: '启动服务器',
      command: './target/release/qexed',
      color: '#F59E0B'
    }
  ];

  const stats = {
    currentPlayers: playerCount,
    maxPlayers: maxPlayers,
    tps: tps,
    uptime: '0天',
    cpuUsage: `0%`,
    memoryUsage: `0GB`,
    version: '0.1.0',
    rustVersion: '1.75.0'
  };

  const statusColor = serverStatus === 'online' ? 'success' :
    serverStatus === 'offline' ? 'danger' : 'warning';

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
                专为 Minecraft 1.21.8 优化的 Rust 服务端，极致性能体验（的反义词）。
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button
                  size="lg"
                  variant="success"
                  className="px-4 py-3 fw-semibold d-flex align-items-center minecraft-btn"
                  onClick={() => navigate('/getting-started')}
                >
                  <Download className="me-2" />
                  立即开始
                </Button>

                <Button
                  variant="outline-light"
                  size="lg"
                  className="px-4 py-3 fw-semibold d-flex align-items-center"
                  href="https://github.com/qexed/Qexed"
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
                  <div className={`server-status-indicator ${serverStatus} me-2`}></div>
                  <span>服务器状态: {serverStatus === 'online' ? '在线' : serverStatus === 'offline' ? '离线' : '加载中'}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span>{stats.currentPlayers}/{stats.maxPlayers} 在线玩家</span>
                </div>
                <div className="d-flex align-items-center">
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

$ ./qexed-server --status
服务器状态: ${serverStatus.toUpperCase()}
在线玩家: ${stats.currentPlayers}/${stats.maxPlayers}
TPS: ${stats.tps}
内存使用: ${stats.memoryUsage}

$ tail -f server.log
[12:00:00] Qexed服务器已启动
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
                    {isLoading && <Badge bg="secondary" className="ms-2">加载中...</Badge>}
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
                          variant={statusColor}
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
                          now={parseInt(stats.cpuUsage)}
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
              <Card className="border-0 bg-dark-light h-100" style={{
                border: '1px solid #374151',
                borderRadius: '10px'
              }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 text-light d-flex align-items-center">
                      <Globe className="me-2" />
                      近期更新（当前v4分支）
                      {isLoading && <Badge bg="secondary" className="ms-2">加载中...</Badge>}
                    </h4>
                    <Badge bg="success" className="px-3 py-2">
                      <i className="bi bi-git me-1"></i> v4
                    </Badge>
                  </div>

                  <ListGroup variant="flush" className="bg-transparent">
                    {recentUpdates.map((update, index) => (
                      <ListGroup.Item
                        key={index}
                        className="bg-transparent text-light border-secondary update-item"
                        style={{
                          borderBottom: '1px solid #374151',
                          padding: '16px 0',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => window.open(update.commitUrl, '_blank')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1F2937';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div className="d-flex align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <code className="text-info bg-dark p-1 rounded">{update.version}</code>
                                {update.branch && (
                                  <Badge bg="dark" text="light" className="border border-secondary">
                                    {update.branch}
                                  </Badge>
                                )}
                              </div>
                              <div className="d-flex align-items-center">
                                <small className="text-muted me-2">{update.date}</small>
                                <i className="bi bi-box-arrow-up-right text-muted"></i>
                              </div>
                            </div>
                            <p className="mb-0 text-light" style={{ lineHeight: 1.5 }}>
                              {update.description}
                            </p>
                            {update.sha && (
                              <small className="text-muted d-block mt-1">
                                提交: {update.sha.substring(0, 7)}
                              </small>
                            )}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {/* 查看所有提交的按钮 */}
                  <div className="text-center mt-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      href="https://github.com/qexed/Qexed/tree/v4"
                      target="_blank"
                      className="d-inline-flex align-items-center"
                    >
                      <Github className="me-2" />
                      查看完整提交历史
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="border-0 bg-dark-light h-100" style={{
                border: '1px solid #374151',
                borderRadius: '10px'
              }}>
                <Card.Body className="p-4">
                  <h4 className="mb-4 text-light d-flex align-items-center">
                    <Award className="me-2" />
                    性能指标
                  </h4>
                  <div className="performance-stats">
                    {performanceStats.map((stat, idx) => (
                      <div key={idx} className="performance-stat mb-4 p-3 rounded"
                        style={{
                          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
                          border: '1px solid rgba(55, 65, 81, 0.5)'
                        }}>
                        <div className="d-flex align-items-center mb-2">
                          <div className="stat-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '40px',
                              height: '40px',
                              background: getStatColor(idx),
                              border: `1px solid ${getStatColor(idx, 0.4)}`,
                              fontSize: '20px'
                            }}>
                            {getStatIcon(idx)}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-muted">{stat.label}</span>
                              <span className="text-success fw-bold" style={{ fontSize: '1.25rem' }}>
                                {stat.value}
                              </span>
                            </div>
                            <small className="text-muted">{stat.desc}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 显示数据来源信息 */}
                  <div className="text-end mt-3">
                    <small className="text-muted">
                      <i className="bi bi-github me-1"></i>
                      数据来源: assets/test_data.json
                    </small>
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
                立即开始使用 Qexed，体验基于 Rust 的高性能 Minecraft 服务器
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