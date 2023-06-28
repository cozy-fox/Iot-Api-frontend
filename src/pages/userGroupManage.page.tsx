import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import userService from '../services/user.service';
import Button from '@mui/material/Button';
import Alert from "../components/alert.component";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Children from '../components/children.component';

type Props = {};
type Order = 'asc' | 'desc';
interface Data {
    id: string;
    name: string;
    members: number;
    devices: number;
}
interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}
interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}
interface EnhancedTableToolbarProps {
    numSelected: ReadonlyArray<string>;
}


const EnhancedTable: React.FC<Props> = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [rows, setRows] = useState<Data[]>([]);
    const [render, setRender] = useState<Number>(0);
    const [open, setDialogOpen] = React.useState(false);
    const [inputValue, setInputValue] = useState('');
    const [alert, setAlert] = useState({ message: '', successful: true, open: false });
    const [indexedData, setIndexedData] = useState<any>({});
    const [data4select, setData4select] = useState<{ devices: { label: string, value: string }[], users: { label: string, value: string }[] }>
        ({ devices: [], users: [] });
    const [input4newUser, setInput4newUser] = useState<string>('');
    const [input4addDeviceGroup, setinput4addDeviceGroup] = useState<string>('');

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setAlert({ ...alert, open: false });
    };

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function createData(
        id: string,
        name: string,
        members: number,
        devices: number
    ): Data {
        return {
            id,
            name,
            members,
            devices
        };
    }

    function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const headCells: readonly HeadCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },
        {
            id: 'members',
            numeric: true,
            disablePadding: false,
            label: 'Users',
        },
        {
            id: 'devices',
            numeric: true,
            disablePadding: false,
            label: 'Device Groups',
        }
    ];

    function EnhancedTableHead(props: EnhancedTableProps) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
            props;
        const createSortHandler =
            (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
                onRequestSort(event, property);
            };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    const updateUserGroups = (field: string, value: string, newMember:string) => {
        userService.updateUserGroups({ selected:selected[0] , field: field, value: value,newMember:newMember }).then(response => {
            setAlert({ message: response.data.message, successful: true, open: true });
            getGroups();
        }).catch(error => {
            const resMessage = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            setAlert({ message: resMessage, successful: false, open: true });
        });
    }

    function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
        const { numSelected } = props;

        const rename = () => {
            userService.renameGroup({ selectedUsers: numSelected, newName: inputValue }).then(response => {
                setAlert({ message: response.data.message, successful: true, open: true });
                getGroups();
                setSelected([]);
                setInputValue('');
            }).catch(error => {
                const resMessage = (error.response && error.response.data &&
                    error.response.data.message) || error.message || error.toString();
                setAlert({ message: resMessage, successful: false, open: true });
            });
        }

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected.length > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected.length > 0 ? `${numSelected.length} selected` : 'User Group Management'}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={inputValue}
                        onChange={(event) => { setInputValue(event.target.value) }} />
                    <Button variant="contained" color="success" onClick={() => createGroup()}  >
                        Create
                    </Button>
                    <Button variant="contained" color="primary" disabled={numSelected.length === 0} onClick={() => rename()}>
                        Rename
                    </Button>
                </Stack>
                <Tooltip title="Delete">
                    <IconButton disabled={numSelected.length === 0} onClick={dialogOpen}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        );
    }

    const dialogOpen = () => {
        setDialogOpen(true);
    };

    const dialogClose = () => {
        setDialogOpen(false);
    };

    const deleteGroup = () => {
        userService.deleteUserGroups(selected).then(response => {
            setAlert({ message: response.data.message, successful: true, open: true });
            dialogClose();
            setSelected([]);
            getGroups();

        }).catch(error => {
            const resMessage = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            setAlert({ message: resMessage, successful: false, open: true });
        });
    }

    const createGroup = () => {
        userService.createUserGroup(inputValue).then((response) => {
            setAlert({ message: response.data.message, successful: true, open: true });
            setInputValue('');
            getGroups();
        }).catch(error => {
            const resMessage = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            setAlert({ message: resMessage, successful: false, open: true });
        });
    }

    const getGroups = () => {
        userService.getUserGroups().then((response) => {
            var devicesList: { [key: string]: any } = {};
            const requestResult = response.data.map((each: any) => {
                console.log(each);
                devicesList[each._id] = each;
                return createData(each._id, each.name, each.members.length, each.reference2devicegroup.length)
            })
            setIndexedData(devicesList);
            if (rows !== requestResult) {
                setRows(requestResult);
                (render === 0) ? setRender(1) : setRender(0);
            }
        })
        userService.get4select().then((response) => {
            setData4select({
                users: response.data.users.map((each: { _id: any; username: any; }) => ({ value: each._id, label: each.username })),
                devices: response.data.devices.map((each: { _id: any; name: any; }) => ({ value: each._id, label: each.name }))
            });
        })
    }

    useEffect(() => {
        getGroups();
    }, []);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, render],
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item md={12} lg={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={handleClose} />
                                <EnhancedTableToolbar numSelected={selected} />
                                <TableContainer>
                                    <Table
                                        sx={{ minWidth: 250 }}
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={rows.length}
                                        />
                                        <TableBody>
                                            {visibleRows.map((row, index) => {
                                                const isItemSelected = isSelected(row.id);
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.id}
                                                        selected={isItemSelected}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                inputProps={{
                                                                    'aria-labelledby': labelId,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.members}</TableCell>
                                                        <TableCell align="right">{row.devices}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: (dense ? 33 : 53) * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 50]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            <Dialog
                                open={open}
                                onClose={dialogClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"Do you really want to delete those groups?"}
                                </DialogTitle>
                                <DialogActions>
                                    <Button onClick={deleteGroup}>Yes</Button>
                                    <Button onClick={dialogClose} autoFocus>
                                        No
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <FormControlLabel
                                control={<Switch checked={dense} onChange={handleChangeDense} />}
                                label="Dense padding"
                            />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item md={12} lg={6}>
                <Children
                        title={"Users"}
                        addMember={(newValue: string) => { updateUserGroups("members", "add", newValue) }}
                        deleteMember={(newValue: string) => { updateUserGroups("members", "delete", newValue) }}
                        selected={selected}
                        input4newMember={input4newUser}
                        setinput4newMember={setInput4newUser}
                        mainData={selected.length == 1 ? indexedData[selected[0]].members : null}
                        data4selection={data4select.users}
                    />
                    <br />
                    <Children
                        title={"Related Device Group"}
                        addMember={(newValue: string) => { updateUserGroups("userGroup", "add", newValue) }}
                        deleteMember={(newValue: string) => { updateUserGroups("userGroup", "delete", newValue) }}
                        selected={selected}
                        input4newMember={input4addDeviceGroup}
                        setinput4newMember={setinput4addDeviceGroup}
                        mainData={selected.length == 1 ? indexedData[selected[0]].reference2devicegroup : null}
                        data4selection={data4select.devices}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}



export default EnhancedTable;