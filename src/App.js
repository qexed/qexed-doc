// App.js
import { Routes, Route } from 'react-router-dom';
import YXNavbar from './baseui/yxnavbar';
import YXFooter from './baseui/yxfooter';
import Page404 from './page/error/404';
import Index from './page/index';
import Login from './page/login';
import Reset from './page/reset';
import Enroll from './page/enroll';
import AuthorizationPage from './page/authorization';
import UserAgreement from './page/user_agreement';
import SummonCertificate from './page/summon_certificate';
const App = () => (
  <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
    <YXNavbar style={{ height: '64px' }} />

    <main className="flex-grow-1">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/summon-certificate' element={<SummonCertificate/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path='/enroll' element={<Enroll/>}/>
        <Route path="/reset" element={<Reset/>}/>
        <Route path='/authorization' element={<AuthorizationPage/>}/>
        <Route path='/user-agreement' element={<UserAgreement/>}/>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </main>

    <YXFooter style={{ height: '96px' }} />
  </div>

);
export default App;