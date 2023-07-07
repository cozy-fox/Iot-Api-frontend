import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function Dashboard(props: any) {

    return (<Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent>
            <Box component="form" sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="UserId"
                            name="userId"
                            required
                            fullWidth
                            id="userId"
                            label="UserId"
                            autoFocus
                            value={props.name}
                            onChange={(event) => props.setName(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="Password"
                            label="Password"
                            name="Password"
                            autoComplete="Password"
                            value={props.password}
                            onChange={(event) => props.setPassword(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            name="service"
                            label="Service"
                            type="service"
                            id="service"
                            autoComplete="service"
                            value={props.service}
                            onChange={(event) => props.setService(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {props.type==="Create"?'':props.accountSelected?'This account is selected.':
                        <Button
                            fullWidth
                            onClick={()=>props.setAccountSelected(true)}
                            variant="contained"
                        >
                            Set this Account
                        </Button>}
                        
                    </Grid>

                </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.handleClick()} autoFocus>
                {props.type}
            </Button>
            <Button color={'error'} onClick={props.handleClose}>Cancel</Button>
        </DialogActions>
    </Dialog>)
}