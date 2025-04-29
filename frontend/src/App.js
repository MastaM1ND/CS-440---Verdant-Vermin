import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Groups from './Groups';
import NavBar from './components/NavBar';
import CreateGroup from './CreateGroup';
import Account from './Account';
import RequireAuth from './components/RequireAuth';
import GroupPage from './GroupPage';

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
        <Route 
          path="/create_group" 
          element={
            <RequireAuth>
              <CreateGroup />
            </RequireAuth>
          } 
        />

        <Route 
          path="/account" 
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          } 
        />

        <Route
          path="/group/:id" // Dynamic route for group pages
          element={
            <RequireAuth>
              <GroupPage />
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

<Route
  path="/group/:id"
  element={
    <RequireAuth>
      <GroupPage />
    </RequireAuth>
  }
/>

export default App;
