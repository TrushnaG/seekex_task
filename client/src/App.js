import React from 'react';
import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './components/HomePage';

const App = () => {
  return (
    <Container maxWidth="lg">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
      </Routes>
      <ToastContainer />
    </Container>
  );
};

export default App;