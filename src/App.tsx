import AuthService from "./services/auth.service";

import TableDashboard from "./components/sensor.dashboard";
import SignUp from "./components/signup.page";
import Login from "./components/login.page";
import LandingPage from "./components/landing.page";
import React, { useEffect, useReducer, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
type Props = {};

const App: React.FC<Props> = () => {
  const [alert, setAlert]=useState({message:'', successful:true,open:false});

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setAlert({...alert,open:false});
  };
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const user = AuthService.getCurrentUser();
  //   if (user) {
  //     navigate('/table', { replace: true });
  //   } else{
  //     navigate('/', { replace: true });
  //   }

  // }, [navigate]);

  return (
    <div>
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login setAlert={setAlert}/>} />
          <Route path="/register" element={<SignUp  setAlert={setAlert}/>}/>
          <Route path="/table" element={<TableDashboard />} />
        </Routes>
        <Snackbar open={alert.open} anchorOrigin={{  vertical: "top", horizontal:"right" }}
                autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alert.successful?'success':'error'} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
      </div>
    </div>
  );
};

export default App;