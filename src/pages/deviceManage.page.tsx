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
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import userService from '../services/device.service';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MapComponent from '../components/map.component';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface Data {
    deviceId: string;
    name: string;
    status: string;
}

function createData(
    deviceId: string,
    name: string,
    status: string
): Data {
    return {

        deviceId,
        name,
        status
    };
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

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

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'DeviceName',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

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

interface EnhancedTableToolbarProps {
    numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    IOT Devices
                </Typography>
            )}
        </Toolbar>
    );
}

export default function EnhancedTable() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = useState<Data[]>([]);
    const [devices, setDevices] = useState<any>({});
    const [render, setRender] = useState<Number>(0);
    const [expanded, setExpanded] = useState<Array<string>>([]);

    useEffect(() => {
        userService.getDevices4Admin().then((response) => {
            console.log(response.data);
            var devicesList: { [key: string]: any } = {};
            const requestResult = response.data.map((each: any) => {
                devicesList[each._id] = each.data;
                return createData(each._id, each.name, "available")
            });
            setDevices(devicesList);
            if (rows !== requestResult) {
                setRows(requestResult);
                (render == 0) ? setRender(1) : setRender(0);
            }
        });
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
            const newSelected = rows.map((n) => n.deviceId);
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

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? [...expanded,panel] : expanded.filter(element => element !== panel));
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

    // Avoid a layout jump when reaching the last page with empty rows.
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

    const showDetailforArray=(showDetailData:Array<any>)=>{
        return <>{showDetailData.map(each => (
            <Accordion expanded={expanded.includes(each)} onChange={handleChange(each)}>
                <AccordionSummary
                    expandIcon={typeof (each) === 'string' || typeof (each) === 'number' || typeof (each) === 'boolean' ? <></> : <ExpandMoreIcon />}
                    aria-controls={each.toString() + "-content"}
                    id={each.toString() + "-header"}
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {typeof (each) === 'string' || typeof (each) === 'number'  || typeof (each) === 'boolean'? each.toString() : <></>}
                    </Typography>
                </AccordionSummary>
                {Array.isArray(each) ? (
                    <AccordionDetails>{showDetailforArray(each)}</AccordionDetails>
                ) : (
                    typeof (each) === 'object' && (
                        <AccordionDetails>{showDetailforObject(each)}</AccordionDetails>
                    )
                )}
            </Accordion>
        ))}</>
    }

    const showDetailforObject = (showDetailData: any) => {
        return <>{Object.entries(showDetailData).map(([key, value]) => (
            <Accordion expanded={expanded.includes(key)} onChange={handleChange(key)}>
                <AccordionSummary
                    expandIcon={typeof (value) === 'string' || typeof (value) === 'number' || typeof (value) === 'boolean' ? <></> : <ExpandMoreIcon />}
                    aria-controls={key + "-content"}
                    id={key + "-header"}
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {key}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{typeof (value) === 'string' || typeof (value) === 'number'  || typeof (value) === 'boolean'?
                     value.toString() : ''}</Typography>
                </AccordionSummary>
                {Array.isArray(value) ? (
                    <AccordionDetails>{showDetailforArray(value)}</AccordionDetails>
                ) : (
                    typeof value === 'object' && (
                        <AccordionDetails>{showDetailforObject(value)}</AccordionDetails>
                    )
                )}

            </Accordion>
        ))}</>
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item md={12} lg={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <EnhancedTableToolbar numSelected={selected.length} />
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
                                                const isItemSelected = isSelected(row.deviceId);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={(event) => handleClick(event, row.deviceId)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.name}
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
                                                        <TableCell align="right">
                                                        <Chip label={row.status} color={row.status==='available'?'success':row.status==='offline'?'error':'warning'}/>
                                                        </TableCell>
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
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            <FormControlLabel
                                control={<Switch checked={dense} onChange={handleChangeDense} />}
                                label="Dense padding"
                            />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "400px" }}>
                        <h3>{selected.length > 0 ? selected.length > 1 ? selected.length + ' Devices Selected' : devices[selected[0]].name : 'None Selected'}</h3>
                        {selected.length > 0 ? <MapComponent
                            locations={selected.map(each => {
                                return {
                                    latitude: devices[each].latlng[0],
                                    longitude: devices[each].latlng[1]
                                }
                            })}
                        /> : ''}
                        {selected.length == 1 ? showDetailforObject(devices[selected[0]]) : ''}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}