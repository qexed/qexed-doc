import {
  Container,
} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';



const YXNavbar = () => (
  <Navbar sticky="top" expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="https://www.qexed.com">
        <img src={`${process.env.PUBLIC_URL}/favicon.ico`}
          width="30"
          height="30"
          className="d-inline-block align-top" alt="logo" />
          {' '}
        Qexed 文档</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">首页</Nav.Link>
          <Nav.Link href="https://doc.qexed.com">文档</Nav.Link>
          <Nav.Link href="https://uc.qexed.com">用户中心</Nav.Link>
          {/* <Nav.Link href="https://open.qexed.com">云行开放平台</Nav.Link> */}
          {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>*/}
          
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>

);
export default YXNavbar;