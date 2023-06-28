import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import Alert from "../components/alert.component";

type Props = {};


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const SignUp: React.FC<Props> = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ message: '', successful: true, open: false });

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      setAlert({...alert, open: false } );
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username: any = data.get('username');
        const email: any = data.get('email');
        const password: any = data.get('password');

        if (typeof (username) !== 'string' || username.length < 3) {
            setAlert({ message: 'Username must be over 3 letters', successful: false, open: true });
        } else if (typeof (email) !== 'string' || email.length === 0) {
            setAlert({ message: 'Invalid Email', successful: false, open: true });
        } else if (typeof (password) !== 'string' || password.length < 8) {
            setAlert({ message: 'Password should be over 8 letters', successful: false, open: true });
        } else {
            AuthService.register(username, email, password).then(
                response => {
                    setAlert({ message: response.data.message, successful: true, open: true });
                    navigate('/login', { replace: true });
                },
                error => {
                    setAlert({
                        message: (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                            error.message ||
                            error.toString(), successful: false, open: true
                    });
                }
            );
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
            <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose}/>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="Username"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="UserName"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                     
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}

export default SignUp;