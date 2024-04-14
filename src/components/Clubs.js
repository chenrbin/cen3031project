import React, {useEffect, useState} from 'react'
import {Box, Stack, Typography, Pagination} from '@mui/material/';
import ClubCard from './ClubCard';

const Clubs = ({setClub, club}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [clubsPerPage] = useState(6);
  //Pagination 

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClub = club.slice(indexOfFirstClub, indexOfLastClub);

  const paginate = (event, value) => {
    setCurrentPage(value);

    window.scrollTo({ top: 1800, behavior: 'smooth' });
  };


  return (
    <Box id="clubs" sx={{ mt: { lg: '109px' } }} mt="50px" p="20px" >
      <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="46px">Showing Results</Typography>
      <Stack direction="row" sx={{ gap: { lg: '107px', xs: '50px' } }} flexWrap="wrap" justifyContent="center">
      {currentClub.map((clubs, idx) => (
          <ClubCard key={idx} club={clubs} />
        ))}
        </Stack>
      <Stack sx={{ mt: { lg: '114px', xs: '70px' } }} alignItems="center">
        {club.length > 6 && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(club.length / clubsPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Stack>     
    </Box>
  )
}

export default Clubs