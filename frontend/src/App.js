import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import QueryInterface from './components/QueryInterface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/queryinterface" element={<QueryInterface/>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;