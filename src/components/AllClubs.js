import React, { useEffect, useState } from "react";
import axios from "axios";
import ClubList from "./ClubList";

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
  return <ClubList clubs={clubs}/>;
};

export default AllClubs;
