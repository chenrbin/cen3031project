import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * The Footer component displays sticky footer
 */

const Footer = () => {
  return (
    <Box mt="80px" bgcolor="#FFF3F4">
      <Typography
        variant="h5"
        sx={{ fontSize: { lg: "20px", xs: "20px" } }}
        mt="51px"
        textAlign="center"
        pb="30px"
        pt="30px"
      >
        Have fun finding new clubs ❤️
      </Typography>
    </Box>
  );
};

export default Footer;
