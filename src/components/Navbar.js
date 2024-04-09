import React from "react";
import { Link } from "react-router-dom";
import { Stack } from "@mui/material";
import { handleLogout } from '../API';

const Navbar = () => {
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
        <Link to="/Club" style={{ textDecoration: "none", color: "#3A1212" }}>
          Clubs
        </Link>
        <Link
          to="/User/Login"
          style={{ textDecoration: "none", color: "#3A1212" }}
        >
          Login
        </Link>
        <Link
          to="/"
          onClick={handleLogout}
          style={{ textDecoration: "none", color: "#3A1212" }}
        >
          Logout
        </Link>
      </Stack>
    </Stack>
  );
};

export default Navbar;
