import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';


export default function Dashboard
    ({
        title,
        addMember,
        deleteMember,
        selected,
        input4newMember,
        setinput4newMember,
        mainData,
        data4selection
    }: {
        title:string,
        addMember: any,
        deleteMember:any,
        selected:readonly string[],
        input4newMember: string,
        setinput4newMember: (newValue: string) => void,
        mainData: any,
        data4selection: Array<any>
    }) {
    return (<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', minHeight: '300px' }}>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 }
                }}
            >
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                   {title}
                </Typography>
                {selected.length === 1 ? <Stack direction="row" spacing={2}>
                    <Autocomplete
                        options={data4selection}
                        sx={{ width: '200px' }}
                        size='small'
                        getOptionLabel={(option) => option.label}
                        value={data4selection.find((option) => option.value === input4newMember) || null}
                        onChange={(event, newValue) =>
                            setinput4newMember(newValue?.value || '')
                        }
                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                    />
                    <Button variant="contained" color="success" onClick={() => addMember(input4newMember)} >
                        Add
                    </Button>
                </Stack> : <></>}
            </Toolbar>
            <Stack direction="row" spacing={1} flexWrap="wrap" >
                {selected.length == 1 && mainData.length > 0 ?
                    mainData.map((each: any) =>
                        <Chip label={each.name||each.username} sx={{ mb: 1 }} variant="outlined" color="primary" onDelete={() => {deleteMember(each._id) }} />)
                    : ''}
            </Stack>

        </Box>
    </Paper>)
}