import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import RegisterUser from './pages/RegisterUser';
import ManageUser from './pages/ManageUser';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <Link to="/">사용자 등록</Link>
          <Link to="/manage">사용자 관리</Link>
        </nav>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<RegisterUser />} />
            <Route path="/manage" element={<ManageUser />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
