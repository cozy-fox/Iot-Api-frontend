import SignUp from "./components/signup.page";
import Login from "./components/login.page";
import LandingPage from "./components/landing.page";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from './components/header.component';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Devices from './components/deviceTable.component';
import authService from "./services/auth.service";
import Users from "./components/usersTable.component";
import Alert from "./components/alert.component";


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type Props = {};

const defaultTheme = createTheme();

const App: React.FC<Props> = () => {
  const PrivateRoute = ({ children,adminPermission,title }: { children: React.ReactNode,adminPermission:boolean, title:string }) => {
    
    const user=authService.getCurrentUser();
    const navigate = useNavigate();
    var showAble=true;
    useEffect(() => {
      if (!user) {
        showAble=false;
        navigate('/login');
      } 
      if(adminPermission && user.roles!="admin"){
        showAble=false;
        setAlert({message:"Aceess Permission denied",successful:false,open:true});
        navigate('/login');
      }
    }, [user, navigate]);

    return showAble ? (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <Header title={title}/>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    {children}
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    ) : null;
  };
  const [alert, setAlert] = useState({ message: '', successful: true, open: false });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setAlert({...alert, open: false } );
  };
  return (
    <div>
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<SignUp  />} />
          <Route path="/devices" element={<PrivateRoute adminPermission={false} title={"Devices"}><Devices /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute adminPermission={true} title={"Users"}><Users   /></PrivateRoute>} />
        </Routes>
        <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose}/>
      </div>
    </div>
  );
};

export default App;