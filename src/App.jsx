import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AddItem from './pages/AddItem';
import ViewItems from './pages/ViewItems';

const App = () => {
  return (
  <Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/add" element={<AddItem />} />
    <Route path="/view" element={<ViewItems />} />
  </Routes>
</Router>

  );
};

export default App;
