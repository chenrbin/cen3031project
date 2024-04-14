import React from 'react'
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import { Box } from '@mui/material';
import ClubDetail from './pages/ClubDetail';
import UserLogin from './pages/User/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import AllClubs from './components/AllClubs';

const App = () => {
  return (
    <Box width = '400px' sx={{ width: { xl: '1488px' } }} m="auto">
        <Navbar />
        <Routes>
            <Route path = '/' element = {<Home />}/>
            <Route path="/Club/:id" element={<ClubDetail />} />
            <Route path="/User/Login" element={<UserLogin />} />
            
            <Route path="Club/AllClubs" element={<AllClubs />} />
        </Routes>
        <Footer />
    </Box>
  )
}

export default App
