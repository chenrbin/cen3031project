import React from 'react'
import {Link} from "react-router-dom";
import {Button, Stack, Typography} from '@mui/material';
import CardImage from '../assets/images/cardholder.jpg'; 

const ClubCard = ({club}) => {
  return (
    <Link className="exercise-card" to={`/club/${club._id}`}>
        <img src={CardImage} loading="lazy" />
        <Stack direction = "row">
            <Button sx={{ ml: '21px', color: '#fff', background: '#FFA9A9', fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize' }}>
                {club.category}
            </Button>
        </Stack>
        <Typography ml="21px" color="#000" fontWeight="bold" sx={{ fontSize: { lg: '24px', xs: '20px' } }} mt="11px" pb="10px" textTransform="capitalize">
                {club.clubName}
        </Typography>
    </Link>
  )
}

export default ClubCard