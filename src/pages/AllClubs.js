import React, { useEffect, useState } from "react";
import axios from "axios";
import Clubs from "../components/Clubs";

/**
 * The AllClubs dynamic page displays all the clubs from the database
 *
 * @returns {JSX.Element} All of the clubs from database
 */

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
  return <Clubs setClub={setClubs} club={clubs} title="Showing All Clubs" />;
};

export default AllClubs;
