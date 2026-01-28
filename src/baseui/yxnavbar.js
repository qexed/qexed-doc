import React from 'react';
import {
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';
import {
  Github,
  House,
  Book,
  Person,
  Shield,
} from 'react-bootstrap-icons';

const YXNavbar = ({ theme, onThemeToggle }) => (
  <Navbar
    expand="lg"
    className={`navbar-custom navbar-dark`}
    style={{
      backgroundColor: '#0f172a',
      borderBottom: '1px solid #334155'
    }}
  >
    <Container>
      <Navbar.Brand
        href="https://www.qexed.com"
        className="d-flex align-items-center"
        style={{
          color: '#f1f5f9',
          fontWeight: '600'
        }}
      >
        Qexed 文档(开发中)
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        style={{
          borderColor: '#475569'
        }}
      />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link
            href="https://www.qexed.com"
            style={{
              color: '#e2e8f0'
            }}
            className="d-flex align-items-center"
          >
            <House className="me-1" size={16} />
            首页
          </Nav.Link>

          <Nav.Link
            href="https://github.com/qexed/Qexed"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#e2e8f0'
            }}
            className="d-flex align-items-center"
          >
            <Github className="me-1" size={16} />
            开源地址
          </Nav.Link>

          <Nav.Link
            href="https://doc.qexed.com"
            style={{
              color: '#e2e8f0'
            }}
            className="d-flex align-items-center"
          >
            <Book className="me-1" size={16} />
            文档
          </Nav.Link>

          <Nav.Link
            href="https://uc.qexed.com"
            style={{
              color: '#e2e8f0'
            }}
            className="d-flex align-items-center"
          >
            <Person className="me-1" size={16} />
            用户中心
          </Nav.Link>

          <Nav.Link
            href="https://permission.qexed.com"
            style={{
              color: '#e2e8f0'
            }}
            className="d-flex align-items-center"
          >
            <Shield className="me-1" size={16} />
            权限管理
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default YXNavbar;