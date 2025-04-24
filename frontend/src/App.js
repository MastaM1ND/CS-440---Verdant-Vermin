import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Groups from './Groups';
import NavBar from './components/NavBar';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      {/* NavBar shows on all pages */}
      <NavBar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/groups"
          element={
            <RequireAuth>
              <Groups />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
