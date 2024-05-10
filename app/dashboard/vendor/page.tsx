"use client";
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
import DialogVendor from "@/app/dashboard/vendor/DialogVendor";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import {Add, Delete, Visibility} from "@mui/icons-material";
import {Button} from "@mui/material";

export default function Vendor() {
    const [data, setData] = useState([]);
    const [vendorToEdit, setVendorToEdit] = useState(null);
    const [open, setOpen] = useState(false);
    const [isToReload, setIsToReload] = useState(true);

    useEffect(() => {
        if (!isToReload)
            return;
        (async () => {
            try {
                const response = await axios.get('/api/vendor', {
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

    async function handleDelete(id: number) {
        try {
            await axios.patch('/api/vendor', {id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsToReload(true)
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <Box sx={{p: 3, overflow: 'auto', width: '100%'}}>
            <TableContainer component={Paper} elevation={3} sx={{width: '100%'}}>
                <Box sx={{p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant={'h6'}>Vendors</Typography>
                    <Button variant={'outlined'} startIcon={<Add/>} onClick={() => setOpen(true)}>Add a new vendor</Button>
                </Box>
                <Table sx={{width: '100%'}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Website</TableCell>
                            <TableCell>Contact</TableCell>
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
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.phone ? row.phone : '-'}</TableCell>
                                <TableCell>{row.email ?
                                    <a href={
                                        row.email !== 'N/A' ? `mailto:${row.email}` : undefined
                                    } >{row.email}</a>
                                    : '-'}</TableCell>
                                <TableCell>{row.website ?
                                   <a href={
                                        row.website !== 'N/A' ? row.website : undefined
                                   }>{row.website}</a>
                                    : '-'}</TableCell>
                                <TableCell>{row.contact ? row.contact : '-'}</TableCell>
                                <TableCell align="right">{
                                    dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
                                }</TableCell>
                                <TableCell
                                    align="right">{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell align="right">
                                    <IconButton size={'small'} onClick={() => {
                                        setVendorToEdit(row);
                                        setOpen(true);
                                    }}>
                                        <Visibility fontSize={'small'}/>
                                    </IconButton>
                                    <IconButton size={'small'} onClick={async () => handleDelete(row.id)}>
                                        <Delete fontSize={'small'}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogVendor vendor={vendorToEdit} open={open} onClose={(isToReload: boolean) => {
                setOpen(false);
                setIsToReload(isToReload);
                setVendorToEdit(null);
            }}/>
        </Box>
    )
}