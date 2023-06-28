import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PowerIcon from '@mui/icons-material/Power';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import authService from "./../services/auth.service";
import { useNavigate } from "react-router-dom";

export const MainListItems = () => {
  const navigate = useNavigate();
  return (<React.Fragment>
    <ListItemButton onClick={() => { navigate('/devices') }}>
      <ListItemIcon>
        <PowerIcon />
      </ListItemIcon>
      <ListItemText primary="Devices" />
    </ListItemButton>
    {authService.getCurrentUser().roles === 'admin' ?
      <ListItemButton  onClick={() => { navigate('/device_group') }}>
      <ListItemIcon>
        <SettingsInputComponentIcon />
      </ListItemIcon>
      <ListItemText primary="Device Group" />
    </ListItemButton>
      : <></>}
    {authService.getCurrentUser().roles === 'admin' ?
      <ListItemButton onClick={() => { navigate('/users') }}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
      : <></>}
      {authService.getCurrentUser().roles === 'admin' ?
      <ListItemButton onClick={() => { navigate('/user_group') }}>
        <ListItemIcon>
        <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="User Group" />
      </ListItemButton>
      : <></>}
  </React.Fragment>)
};

export const SecondaryListItems = ()=>{
  const navigate = useNavigate();
  return(<React.Fragment>
    <ListSubheader component="div" inset>
      Additional Info
    </ListSubheader>
    <ListItemButton onClick={() => { navigate('/profile') }}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
  </React.Fragment>)
}