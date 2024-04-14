import React, { useState } from "react";
import { Button, TextField, Stack, Typography } from "@mui/material";
import { handleLogin, handleRegister } from "../../API";
import { useNavigate } from "react-router-dom";

const UserLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const buttonStyle = {
    marginTop: "45px",
    textDecoration: "none",
    width: "200px",
    textAlign: "center",
    background: "#FF2625",
    padding: "12px",
    fontSize: "22px",
    textTransform: "none",
    color: "white",
    borderRadius: "4px",
    "&:hover": {
      color: "#FF2625",
      background: "#fff",
    },
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF2625",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#FF2625",
    },
  };

  const handleLoginClick = async () => {
    try {
      const response = await handleLogin(username, password, navigate);
      if (response === 200) {
        onLogin(true);
        navigate("/");
      } else {
        setErrorMessage("Incorrect username or password.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Incorrect username or password.");
    }
  };

  const handleRegisterClick = async () => {
    try {
      const response = await handleRegister(username, password, navigate);
      if (response === 200) {
        onLogin(true);
        navigate("/");
      } else {
        setErrorMessage(
          "Username must be alphanumeric and password must be at least 6 characters."
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(
        "Username must be alphanumeric and password must be at least 6 characters."
      );
    }
  };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography
        fontWeight={700}
        sx={{
          fontSize: { lg: "44px", xs: "30px" },
          textAlign: "center",
          mb: "49px",
        }}
      >
        User Login
      </Typography>
      <form style={{ width: "100%", maxWidth: "400px" }}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ width: "100%", ...inputStyle }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: "100%", ...inputStyle }}
          />
          <Stack direction="row" spacing={5} justifyContent="center">
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{ ...buttonStyle, width: "100%" }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={handleRegisterClick}
              sx={{ ...buttonStyle, width: "100%" }}
            >
              Register
            </Button>
          </Stack>
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: "center" }}
            >
              {errorMessage}
            </Typography>
          )}
        </Stack>
      </form>
    </Stack>
  );
};

export default UserLogin;
