import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stack } from "@mui/material";
import { handleRefresh, handleLogout } from "../API";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await handleRefresh();
        console.log(response)
        if (response === 200) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      } catch (error) {
        setIsLoggedIn(false);
      }
    }
    checkLoginStatus();
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        gap: { sm: "123px", xs: "40px" },
        mt: { sm: "32px", xs: "20px" },
        px: "65px",
      }}
    >
      <Stack
        direction="row"
        gap="40px"
        fontFamily="Arial"
        fontSize="24px"
        alignItems="flex-end"
      >
        <Link to="/" style={{ textDecoration: "none", color: "#3A1212" }}>
          Home
        </Link>
        <Link
          to="Club/AllClubs"
          style={{ textDecoration: "none", color: "#3A1212" }}
        >
          All Clubs
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/User/List"
              style={{ textDecoration: "none", color: "#3A1212" }}
            >
              My Clubs
            </Link>
            <Link
              to="/User/Login"
              onClick={handleLogout}
              style={{
                textDecoration: "none",
                color: "#3A1212",
                marginLeft: "10px",
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            to="/User/Login"
            style={{ textDecoration: "none", color: "#3A1212" }}
          >
            Login
          </Link>
        )}
      </Stack>
    </Stack>
  );
};

export default Navbar;
