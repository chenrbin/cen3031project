import React, { useEffect, useState } from "react";
import Clubs from "./Clubs";
import axios from "axios";
import { Box, Stack, Typography, Pagination } from "@mui/material/";

const UserList = () => {
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:5000/user/refresh", { withCredentials: true })
        .then((response) => console.log("Response" + response))
        .catch((err) => console.log(err));
      await axios
        .get("http://localhost:5000/User/list", { withCredentials: true })
        .then((response) => {
          setClubs(response.data);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);
  return <Clubs setClub={setClubs} club={clubs} title="Showing My Clubs" />;
};
export default UserList;
