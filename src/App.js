import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Box } from "@mui/material";
import ClubDetail from "./pages/ClubDetail";
import UserLogin from "./pages/User/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllClubs from "./pages/AllClubs";
import UserList from "./components/UserList";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //check for login state of user

  return (
    <Box width="400px" sx={{ width: { xl: "1488px" } }} m="auto">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        {/* Route for the home page component */}
        <Route path="/" element={<Home />} />
        
        {/* Route for the club detail page component */}
        {/* The :id parameter allows for dynamic routing based on the club ID */}
        <Route path="/Club/:id" element={<ClubDetail />} />
        <Route path="/User/List" element={<UserList />} />

        {/* Route for the user login component */}
        {/* The onLogin prop is used to update the login state */}
        <Route path="/User/Login" element={<UserLogin onLogin={setIsLoggedIn}/>} />

        {/* Route for the all clubs page component */}
        <Route path="/Club/AllClubs" element={<AllClubs />} />
      </Routes>
      <Footer />
    </Box>
  );
};

export default App;
