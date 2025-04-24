// src/components/RequireAuth.js
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireAuth;
