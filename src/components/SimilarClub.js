import React, { useEffect, useState } from "react";
import Clubs from "./Clubs";
import axios from "axios";

const SimilarClub = ({clubDetail}) => {
  const[similarClub, setSimilarClub] = useState([]);
  const{clubName, category} = clubDetail;  
    
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:5000/Club/")
        .then((response) => {
           
            if (response.data.length > 0) {
                const searchedClub = response.data.filter(
                  (item) =>
                    item.clubName.toLowerCase().includes(clubName.toLowerCase()) ||
                    item.category.toLowerCase().includes(category.toLowerCase())
                );
                setSimilarClub(searchedClub);
            }
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  });
  
  return (
    <Clubs setClub={setSimilarClub} club={similarClub} title="Recommended Clubs" />
  )
}

export default SimilarClub