import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
// import Dashboard from './components/Dashboard';
import Dashboard from './pages/Home';
import Manager from './pages/Manager';
// import CustomerDetails from './components/CustomerDetails';
import TopBar from './components/TopBar';

function App() {
  const user = "Usuario";  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <>
            <TopBar user={user} />
            <Dashboard />
          </>
        } />
        <Route path="/customer-details" element={
          <>
            <TopBar user={user} />
            <Manager />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
