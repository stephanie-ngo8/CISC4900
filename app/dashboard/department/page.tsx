"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import DialogCode from "@/app/dashboard/codeGL/DialogCode";
import DialogDepartment from "@/app/dashboard/department/DialogDepartment";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import {Add, Delete, Visibility} from "@mui/icons-material";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";

export default function Department() {
    const [data, setData] = useState([]);
    const [deptToEdit, setDeptToEdit] = useState(null);
    const [open, setOpen] = useState(false);
    const [isToReload, setIsToReload] = useState(true);

    useEffect(() => {
        if (!isToReload)
            return;
        (async () => {
            try {
                const response = await axios.get('/api/department', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setData(response.data)
                setIsToReload(false)
            } catch (err: any) {
                setIsToReload(false)
                console.log(err);
            }
        })();
    }, [isToReload]);

    async function deleteDepartment(id: string) {
        try {
            await axios.patch(`/api/department`, {id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsToReload(true);
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <Box sx={{p: 3, overflow: 'auto', width: '100%'}}>
            <TableContainer component={Paper} elevation={3} sx={{width: '100%'}}>
                <Box sx={{p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant={'h6'}>
                        Departments
                    </Typography>
                    <Button variant={'outlined'} startIcon={<Add/>} onClick={() => setOpen(true)}>Add a new department</Button>
                </Box>
                <Table sx={{width: '100%'}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Updated At</TableCell>
                            <TableCell align="right">Created At</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row: any) => (
                            <TableRow
                                key={row.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.code}
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell align="right">{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell align="right">
                                    <IconButton size={'small'} onClick={() => {
                                        setDeptToEdit(row);
                                        setOpen(true);
                                    }}>
                                        <Visibility fontSize={'small'}/>
                                    </IconButton>
                                    <IconButton size={'small'} onClick={async () => deleteDepartment(row.id)}>
                                        <Delete fontSize={'small'}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogDepartment department={deptToEdit} open={open} onClose={(isToReload: boolean) => {
                setOpen(false);
                setIsToReload(isToReload);
                setDeptToEdit(null);
            }}/>
        </Box>
    );
}