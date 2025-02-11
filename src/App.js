import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserManagement from './components/UserManagement';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user-management" element={<UserManagement />} />
    </Routes>
  </Router>
);

export default App;