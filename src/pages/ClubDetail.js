import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {Box} from '@mui/material'; 
//import Detail from '../components/Detail';
//import SimilarClub from '../components/SimilarClub';
import axios from "axios";
const ClubDetail = () => {
  const [clubDetail, setClubDetail] = useState({});
  const {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:5000/Club/"+id)
        .then((response) => {
          setClubDetail(response.data);
          console.log(response.data);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [id]);

  return (
    <Box>
      Check
    </Box>
  )
}

export default ClubDetail