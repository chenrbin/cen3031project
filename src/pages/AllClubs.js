import React, { useEffect, useState } from "react";
import axios from "axios";
import Clubs from "../components/Clubs";
import {Box, Stack, Typography, Pagination} from '@mui/material/';

const AllClubs = () => {
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:5000/Club/")
        .then((response) => {
          setClubs(response.data);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);
  return (
    <div>

      <Clubs setClub={setClubs} club={clubs}/>{" "}

    </div>
  );
};

export default AllClubs;
