import React, {useState} from 'react'
import {Box, Stack, Typography, Pagination} from '@mui/material/';
import ClubCard from './ClubCard';
import PropTypes from 'prop-types';

/**
 * The Clubs component displays search results with pagination functionality.
 *
 * @param {Function} props.setClub - Set club function returns from Home.
 * @param {Array} props.club - Json of all the club results.
 * @param {string} props.title - The title to be displayed above the list of clubs.
 * @returns {JSX.Element} The rendered Clubs component.
 */

const Clubs = ({setClub, club, title}) => {
  Clubs.propTypes = {
    setClub: PropTypes.func.isRequired,
    club: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
  };
  // State for the current page number in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Number of clubs to display per page
  const [clubsPerPage] = useState(6);
  
  //Pagination: Calculate the indices for the current page's clubs
  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentPageClubs = club.slice(indexOfFirstClub, indexOfLastClub); //// Get the clubs for the current page

  const paginate = (event, value) => {
    setCurrentPage(value);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <Box id="clubs" sx={{ mt: { lg: '109px' } }} mt="50px" p="20px" >
      <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="46px">{title}</Typography>
      <Stack direction="row" sx={{ gap: { lg: '107px', xs: '50px' } }} flexWrap="wrap" justifyContent="center">
      {currentPageClubs.map((club) => (
          <ClubCard key={club._id} club={club} /> //utilize ClubCard component to display club results, pass in id for Detail.js
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