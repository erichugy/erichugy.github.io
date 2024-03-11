// Copyright (c) 2023, Eric Huang
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 
import React from 'react';
import Home from './components/home/Home';
import HiddenDocuments from './components/hiddenDocuments/HiddenDocuments';
import Footer from './components/footer/Footer';
import TestingPage from './components/testingPage/TestingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<HiddenDocuments />} />
        <Route path="/test-page" element={<TestingPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
