import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Groups from './Groups';
import NavBar from './components/NavBar';
import RequireAuth from './components/RequireAuth';

// This inner component allows dynamic hiding of NavBar
function AppRoutes() {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/signup';

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route */}
        <Route
          path="/groups"
          element={
            <RequireAuth>
              <Groups />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
