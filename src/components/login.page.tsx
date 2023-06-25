import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Alert from "./alert.component";

type Props = {
  setAlert: (alert: { message: string; successful: boolean; open: boolean }) => void;
};


const defaultTheme = createTheme();

const SignInSide =() => {
  const [alert, setAlert] = useState({ message: '', successful: true, open: false });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setAlert({...alert, open: false } );
  };



  const [redirect, setRedirect] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (redirect) {
    return <Navigate to={redirect} />
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const username = data.get('username') as string;
    const password = data.get('password') as string;

    if (typeof (username) !== 'string' || username.length < 3) {
      
      setAlert({message:'Username must be over 3 letters', successful:false, open:true});
    } else if (typeof (password) !== 'string' || password.length < 8) {
      setAlert({message:'Password should be over 8 letters', successful:false, open:true});
    } else {
      AuthService.login(username, password).then(
        () => {
          setAlert({message:"Login Successfully", successful:true, open:true});
          setRedirect("/devices");
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
            setAlert({message:resMessage, successful:false, open:true});
          setLoading(false);

        }
      );
    }

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose}/>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Yiggo Iot Sensor Management
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;