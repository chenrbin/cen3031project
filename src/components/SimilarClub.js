import React, { useEffect, useState } from "react";
import Clubs from "./Clubs";
import axios from "axios";

/**
 * The Similar club component displays recommended clubs
 *
 * @param {Object} props.clubDetail - JSON of the searched/targeted club.
 * @returns {JSX.Element} The rendered ClubCard components with related clubs.
 */

const SimilarClub = ({clubDetail}) => {
  const[similarClub, setSimilarClub] = useState([]); // array of all the related clubs
  const{clubName, category} = clubDetail;  //deconstruct the name and category field from JSON
    
  /**
   * Handles the recommendation functionality.
   * It fetches the list of clubs from the backend API, filters the clubs based on the targeted club,
   * and returns the clubs with similar description or category
   */
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:5000/Club/")
        .then((response) => {
            if (response.data.length > 0) {
                const searchedClub = response.data.filter(
                  (item) =>
                    (item.clubName.toLowerCase().includes(clubName.toLowerCase()) ||
                    item.category.toLowerCase().includes(category.toLowerCase())) &&
                    item._id !== clubDetail._id
                );
                setSimilarClub(searchedClub);
            }
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [clubDetail]);
  
  return (
    <Clubs setClub={setSimilarClub} club={similarClub} title="Recommended Clubs" />
  )
}

export default SimilarClub