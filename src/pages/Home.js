import React, { useState } from 'react'
import { Box } from '@mui/material';

import HeroBanner from '../components/HeroBanner';
import SearchClubs from '../components/SearchClubs';
import Clubs from '../components/Clubs';

/**
 * The Home page displays the HeroBanner, search bar and search results
 *
 * @param {Object} club - The club results return from the SearchClubs component
 * @returns {JSX.Element} The Home page
 */

const Home = () => {
  const [club, setClub] = useState([]); //search results from SearchClubs.js that are shared with Clubs component for displaying
  return (
    <Box>
      <HeroBanner />
      <SearchClubs setClub={setClub} />
      <Clubs setClub={setClub} club ={club} title="Showing Results"/>
    </Box>
  )
}

export default Home