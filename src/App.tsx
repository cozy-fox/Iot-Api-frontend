
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

//components
import Header from './components/header.component';
import authService from "./services/auth.service";
import Alert from "./components/alert.component";

//pages
import Devices from './pages/deviceManage.page';
import DevicesGroup from './pages/deviceGroupManage.page';
import Users from "./pages/usersManage.page";
import SignUp from "./pages/signup.page";
import Login from "./pages/login.page";
import LandingPage from "./pages/landing.page";
import UsersGroup from "./pages/userGroupManage.page";
import Profile from "./pages/profile.page";

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
            {children}
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
          <Route path="/devices" element={<PrivateRoute adminPermission={false} title={"Devices Management"}><Devices /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute adminPermission={false} title={"Profile"}><Profile /></PrivateRoute>} />
          <Route path="/device_group" element={<PrivateRoute adminPermission={false} title={"Devices Group Management"}><DevicesGroup /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute adminPermission={true} title={"Users Management"}><Users   /></PrivateRoute>} />
          <Route path="/user_group" element={<PrivateRoute adminPermission={true} title={"User Group Management"}><UsersGroup   /></PrivateRoute>} />
        </Routes>
        <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose}/>
      </div>
    </div>
  );
};

export default App;