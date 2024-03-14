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
import DialogDepartment from "@/app/dashboard/department/DialogDepartment";
import DialogVendor from "@/app/dashboard/vendor/DialogVendor";

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
        <Box sx={{width: '100%'}}>
            <button onClick={() => setOpen(true)}>Add a new vendor</button>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
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
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.website}</TableCell>
                                <TableCell>{row.contact}</TableCell>
                                <TableCell align="right">{row.updatedAt}</TableCell>
                                <TableCell align="right">{row.createdAt}</TableCell>
                                <TableCell align="right">
                                    <button onClick={() => {
                                        setVendorToEdit(row);
                                        setOpen(true);
                                    }}>Update</button>
                                    <button onClick={async () => handleDelete(row.id)}>Delete</button>
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