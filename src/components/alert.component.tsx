import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


type Props = {message:string, successful:boolean, open:boolean,handleClose:(event?: React.SyntheticEvent | Event, reason?: string) => void;};


const App: React.FC<Props> = (alertProp) => {
  
  
  return (
        <Snackbar open={alertProp.open} anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000} onClose={alertProp.handleClose}>
          <Alert onClose={alertProp.handleClose} severity={alertProp.successful ? 'success' : 'error'} sx={{ width: '100%' }}>
            {alertProp.message}
          </Alert>
        </Snackbar>
  );
};

export default App;