import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthService from "../services/auth.service";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../components/alert.component";
import Paper from "@mui/material/Paper";
import { Copyright } from "../components/copyright.component";

type Props = {};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const SignUp: React.FC<Props> = () => {
    const navigate = useNavigate();
    const params = useParams();
    const userId=params.userId;
    const token=params.token;
    const [alert, setAlert] = useState({ message: '', successful: true, open: false });

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setAlert({ ...alert, open: false });
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password: any = data.get('password');
        const checkPassword: any = data.get('checkPassword');

        if (!userId || userId.length == 0) {
            setAlert({ message: 'Invalid User Id', successful: false, open: true });
        } else if (!token || token.length==0) {
            setAlert({ message: 'Invalid Token', successful: false, open: true });
        } else if (typeof (password) !== 'string' || password.length < 8) {
            setAlert({ message: 'Password should be over 8 letters', successful: false, open: true });
        } else if (typeof (checkPassword) !== 'string' || checkPassword != password) {
            setAlert({ message: 'Password Unmatch', successful: false, open: true });
        } else {
            AuthService.resetPassword(userId, token, password).then(
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
        <ThemeProvider theme={defaultTheme} >
            <div className="signup-background">
                <Container component="main" maxWidth="sm">
                    <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose} />
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Paper sx={{ mt: '120px', padding: '40px' }}>

                            <div className='logo'>
                                <img src='./../../logo.png' style={{ width: '50%', marginBottom: '20px', cursor: 'pointer' }} onClick={() => { navigate('/') }}>
                                </img>
                            </div>

                            <Typography component="h1" variant="h5" align='center'>
                                Reset your password.
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
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
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="checkPassword"
                                            label="Check Password"
                                            type="password"
                                            id="checkPassword"
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
                                    Rest Password
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link onClick={() => { navigate('/login') }} style={{ cursor: 'pointer' }}>
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Copyright sx={{ mt: 5 }} />
                        </Paper>
                    </Box>
                </Container></div>
        </ThemeProvider>
    );
}

export default SignUp;