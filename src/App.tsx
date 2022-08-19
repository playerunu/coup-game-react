import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Level } from 'containers/Level';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Level />} />
      </Routes>
    </Router>
  );
};

export default App;
