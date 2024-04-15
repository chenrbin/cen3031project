import React, {useState} from 'react'
import {Box, Stack, Typography, Pagination} from '@mui/material/';
import ClubCard from './ClubCard';
import PropTypes from 'prop-types';

const Clubs = ({setClub, club, title}) => {
  Clubs.propTypes = {
    setClub: PropTypes.func.isRequired,
    club: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [clubsPerPage] = useState(6);
  //Pagination 

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentPageClubs = club.slice(indexOfFirstClub, indexOfLastClub);

  const paginate = (event, value) => {
    setCurrentPage(value);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <Box id="clubs" sx={{ mt: { lg: '109px' } }} mt="50px" p="20px" >
      <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="46px">{title}</Typography>
      <Stack direction="row" sx={{ gap: { lg: '107px', xs: '50px' } }} flexWrap="wrap" justifyContent="center">
      {currentPageClubs.map((club) => (
          <ClubCard key={club._id} club={club} />
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