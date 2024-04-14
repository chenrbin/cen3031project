import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';

import HeroBanner from '../components/HeroBanner';
import SearchClubs from '../components/SearchClubs';
import Clubs from '../components/Clubs';


const Home = () => {
  const [club, setClub] = useState([]);
  return (
    <Box>
      <HeroBanner />
      <SearchClubs setClub={setClub} />
      <Clubs setClub={setClub} club ={club} title="Showing Results"/>
    </Box>
  )
}

export default Home