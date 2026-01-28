import {
  Container,
} from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';

const YXFooter = () => (
<Navbar fixed="bottom" expand="lg" className="bg-body-tertiary">
  <Container fluid className="d-flex justify-content-between flex-nowrap">
    {/* 版权信息容器 */}
    <Container className="text-truncate pe-2" style={{ maxWidth: "calc(100% - 80px)" }}>
      Copyright © 2024-2025 云行工作室; © 2025-2026 Inotart. All rights reserved.
    </Container>

    {/* 版本号容器 */}
    <Container className="d-none d-sm-inline-flex flex-shrink-0 justify-content-end" style={{ width: "auto" }}>
      版本:2.1
    </Container>
  </Container>
</Navbar>
);
export default YXFooter;