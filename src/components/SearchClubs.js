import { Box, Button, Stack, TextField, Typography } from "@mui/material";
const SearchClubs = () => {
  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography
        fontWeight={700}
        sx={{ fontSize: { lg: "44px", xs: "30px" } }}
        mt="20px"
        mb="49px"
        textAlign="center"
      >
        Awesome Clubs You <br /> Should Join
      </Typography>
      <Box position="relative" mb="72px">
        <TextField
          height="76px"
          sx={{
            input: { fontWeight: "700", border: "none", borderRadius: "4px" },
            width: { lg: "1000px", xs: "350px" },
            backgroundColor: "#fff",
            borderRadius: "40px",
          }}
          onChange={(e) => {}}
          placeholder="Search Clubs"
          type="text"
        />
        <Button
          className="search-btn"
          sx={{
            bgcolor: "#FF2625",
            color: "#fff",
            textTransform: "none",
            width: { lg: "173px", xs: "80px" },
            height: "56px",
            position: "absolute",
            right: "0px",
            fontSize: { lg: "20px", xs: "14px" },
          }}
        >
          Search
        </Button>
      </Box>
    </Stack>
  );
};

export default SearchClubs;
