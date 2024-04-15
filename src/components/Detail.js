import React from 'react'
import {Stack, Button, Typography} from '@mui/material';
import HumanIcon from "../assets/images/human_icon.png";
import CategoryIcon from '../assets/images/category_icon.png';  
import CardImage from '../assets/images/cardholder.jpg'; 
import PropTypes from 'prop-types';

const Detail = ({clubDetail}) => {
    Detail.propTypes = {
        clubDetail: PropTypes.shape({
            clubName: PropTypes.string.isRequired, 
            category: PropTypes.string.isRequired, 
            description: PropTypes.string, 
            memberCount: PropTypes.number, 
        }).isRequired,
    }

    const{clubName, category, description, memberCount} = clubDetail;
    
    const extraDetail = [
        {
          icon: HumanIcon,
          name: memberCount,
        },
        {
          icon: CategoryIcon,
          name: category,
        },
      ];

    return (
    <Stack gap="60px" sx={{ flexDirection: { lg: 'row' }, p: '20px', alignItems: 'center' }}>
        <img src={CardImage} loading="lazy" className="detail-image" aria-labelledby='Gator Image' />
        <Stack sx={{ gap: { lg: '35px', xs: '20px' } }}> 
            <Typography sx={{ fontSize: { lg: '64px', xs: '30px' } }} fontWeight={700} textTransform="capitalize">
                {clubName}
            </Typography>
            <Typography  sx={{ fontSize: { lg: '24px', xs: '18px' } }} color="#4F4C4C">
                {description}
            </Typography>
            {extraDetail?.map((item) => (
                <Stack key={item.name} direction="row" gap="24px" alignItems="center">
                    <Button sx={{ background: '#FFF2DB', borderRadius: '50%', width: '100px', height: '100px' }}>
                        <img src={item.icon} style={{ width: '50px', height: '50px' }} aria-labelledby='Gator Image' />
                    </Button>
                    <Typography textTransform="capitalize" sx={{ fontSize: { lg: '30px', xs: '20px' } }}>
                        {item.name}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    </Stack>

  )
}

export default Detail