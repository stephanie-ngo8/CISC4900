"use client";
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import axios from "axios";
import DialogUser from "@/app/dashboard/users/DialogUser";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import {Add, Delete, Visibility} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
export default function Users() {
    const [data, setData] = useState([]);
    const [userToEdit, setUserToEdit] = useState(null);
    const [open, setOpen] = useState(false);
    const [isToReload, setIsToReload] = useState(true);

    useEffect(() => {
        if (!isToReload)
            return;
        (async () => {
            try {
                const response = await axios.get('/api/users', {
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

    async function deleteUser(id: string) {
        try {
            await axios.patch(`/api/users`, {id}, {
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
                        Users
                    </Typography>
                    <Button variant={'outlined'} startIcon={<Add/>} onClick={() => setOpen(true)}>Add a new user</Button>
                </Box>
                <Table sx={{width: '100%'}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Identifiant</TableCell>
                            <TableCell align="right">Firstname</TableCell>
                            <TableCell align="right">Lastname</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Updated At</TableCell>
                            <TableCell align="right">Created At</TableCell>
                            <TableCell align="right">Role</TableCell>
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
                                    {row.id}
                                </TableCell>
                                <TableCell align="right">{row.firstName}</TableCell>
                                <TableCell align="right">{row.lastName}</TableCell>
                                <TableCell align="right">{
                                    <a href={
                                        `mailto:${row.email}`
                                    } >{row.email}</a>
                                }</TableCell>
                                <TableCell align="right">{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell align="right">{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell align="right" sx={{fontStyle: 'italic'}}>
                                    {row.role}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size={'small'} onClick={() => {
                                        setUserToEdit(row);
                                        setOpen(true);
                                    }}>
                                        <Visibility fontSize={'small'}/>
                                    </IconButton>
                                    <IconButton size={'small'} onClick={async () => deleteUser(row.id)}>
                                        <Delete fontSize={'small'}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogUser open={open} onClose={(isToReload: boolean) => {
                setIsToReload(isToReload)
                setOpen(false);
                setUserToEdit(null);
            }} user={userToEdit}/>
        </Box>
    );
}