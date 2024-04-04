import React from 'react'
import { Box } from '@mui/material';

import HeroBanner from '../components/HeroBanner';
import SearchClubs from '../components/SearchClubs';
import Clubs from '../components/Clubs';


const Home = () => {
  return (
    <Box>
      <HeroBanner />
      <SearchClubs />
      <Clubs />
    </Box>
  )
}

export default Home