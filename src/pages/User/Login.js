import React, { useState } from 'react';
import { Button, TextField, Stack, Typography } from '@mui/material';
import { handleLogin, handleRegister } from '../../API';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const buttonStyle = {
    marginTop: '45px',
    textDecoration: 'none',
    width: '200px',
    textAlign: 'center',
    background: '#FF2625',
    padding: '12px',
    fontSize: '22px',
    textTransform: 'none',
    color: 'white',
    borderRadius: '4px',
    '&:hover': {
      color: '#FF2625',
      background: '#fff', // Change hover color to a darker shade of red
    },
  };

  const handleLoginClick = () => {
    handleLogin(username, password, navigate); // Pass navigate function to handleLogin
  };

  const handleRegisterClick = () => {
    handleRegister(username, password, navigate); // Pass navigate function to handleRegister
  };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '30px' }, textAlign: 'center', mb: '49px' }}>
        User Login
      </Typography>
      <form style={{ width: '100%', maxWidth: '400px' }}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ width: '100%' }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: '100%' }}
          />
          <Stack direction="row" spacing={5} justifyContent="center">
            <Button variant="contained" onClick={handleLoginClick} sx={{ ...buttonStyle, width: '100%' }}>
              Login
            </Button>
            <Button variant="contained" onClick={handleRegisterClick} sx={{ ...buttonStyle, width: '100%' }}>
              Register
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default UserLogin;
