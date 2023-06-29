import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from "../components/alert.component";
import userService from '../services/auth.service';
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

type Props = {};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const SignUp: React.FC<Props> = () => {
    const [alert, setAlert] = useState({ message: '', successful: true, open: false });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userGroups, setUserGroups] = useState([]);
    const [deviceGroups, setDeviceGroups] = useState([]);

    useEffect(() => {
        userService.getProfile().then((response) => {
            setUsername(response.data.username);
            setEmail(response.data.email);
            setUserGroups(response.data.userGroup);
            setDeviceGroups(response.data.deviceGroup);
        }).catch(error => {
            const resMessage = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            setAlert({ message: resMessage, successful: false, open: true });
        });
    }, []);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setAlert({ ...alert, open: false });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username: any = data.get('username');
        const email: any = data.get('email');
        const password: any = data.get('password');
        const checkPassword: any = data.get('checkPassword');

        if (typeof (username) !== 'string' || username.length < 3) {
            setAlert({ message: 'Username must be over 3 letters', successful: false, open: true });
        } else if (password.length > 0 && password.length < 8) {
            setAlert({ message: 'Password should be over 8 letters', successful: false, open: true });
        } else if (typeof (email) !== 'string' || email.length === 0 || !email.includes('@')) {
            setAlert({ message: 'Invalid Email', successful: false, open: true });
        } else if (checkPassword !== password) {
            setAlert({ message: 'Password Unmatch', successful: false, open: true });
        } else {
            userService.modifyProfile(username, email, password).then(
                response => {
                    setAlert({ message: response.data.message, successful: true, open: true });
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
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose} />
                    <CssBaseline />
                    <Grid item md={12} lg={4} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "400px" }}>
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
                                            value={username}
                                            onChange={(event) => setUsername(event.target.value)}
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
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
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
                                    Change Profile
                                </Button>

                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item md={12} lg={8}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "200px", mb: '10px' }}>
                            <Grid sm={12}>
                                <h3>User Groups</h3>
                            </Grid>
                            <Grid sm={12}>
                                {userGroups.map((each: any) => <Chip label={each} sx={{ mb: 1, mr:2 }} variant="outlined" color="primary" />)}
                            </Grid>
                        </Paper>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "200px", mb: '10px' }}>
                            <Grid sm={12}>
                                <h3>Device Groups</h3>
                            </Grid>
                            <Grid sm={12}>
                                {deviceGroups.map((each: any) => <Chip label={each} sx={{ mb: 1, mr:2 }} variant="outlined" color="primary" />)}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>


    );
}

export default SignUp;