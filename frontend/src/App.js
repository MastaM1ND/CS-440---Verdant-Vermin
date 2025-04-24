import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Groups from './Groups';
import NavBar from './components/NavBar';
import CreateGroup from './CreateGroup';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/create_group" element={<CreateGroup />} />
      </Routes>
    </Router>
  );
}

export default App;
