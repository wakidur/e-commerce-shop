import React from 'react';

import './App.scss';
import logo from './assests/images/brand/bootstrap-social-logo.png';
import Aux from './components/hoc/Aux';
import Header from './components/layouts/header/Header';
import Home from './pages/Home';

function App() {
  return (
    <Aux>
      <Header />
      <main role="main">
        <Home />
      </main>
    </Aux>
  );
}

export default App;
