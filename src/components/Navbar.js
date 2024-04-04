import React from 'react'
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';

const Navbar = () => {
  return (
    <Stack direction="row" justifyContent="space-around" sx={{ gap: { sm: '123px', xs: '40px' }, mt: { sm: '32px', xs: '20px' }, justifyContent: 'none' }} px="65px">
    <Stack
      direction="row"
      gap="40px"
      fontFamily="Alegreya"
      fontSize="24px"
      alignItems="flex-end"
    >
      <Link to="/" style={{ textDecoration: 'none', color: '#3A1212' }}>Home</Link>
      <a href="#clubs" style={{ textDecoration: 'none', color: '#3A1212' }}>Clubs</a>

    </Stack>
  </Stack>
  )
}

export default Navbar