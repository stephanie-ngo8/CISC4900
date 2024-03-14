"use client";
import {useEffect, useState} from "react";
import DialogFormPurchase from "@/app/dashboard/purchases/DialogFormPurchase";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import DialogUser from "@/app/dashboard/users/DialogUser";
import Box from "@mui/material/Box";
import axios from "axios";

export default function Purchases() {
    const [open, setOpen] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [isToReload, setIsToReload] = useState(true);

    useEffect(() => {
        if (!isToReload)
            return;
        (async () => {
            try {
                const response = await axios.get('/api/purchase', {
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

    return (
            <Box sx={{width: '100%'}}>
                <button onClick={() => setOpen(true)}>Add a new purchase</button>
                <TableContainer component={Paper} variant={'outlined'}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
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
                                    <TableCell align="right">{row.email}</TableCell>
                                    <TableCell align="right">{row.updatedAt}</TableCell>
                                    <TableCell align="right">{row.createdAt}</TableCell>
                                    <TableCell align="right" sx={{fontStyle: 'italic'}}>nothing</TableCell>
                                    <TableCell align="right">
                                        <button onClick={() => {
                                            // setUserToEdit(row);
                                            setOpen(true);
                                        }}>View</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <DialogFormPurchase open={open} onClose={(isToReload: boolean) => {
                    setIsToReload(isToReload)
                    setOpen(false)
                }}/>
            </Box>
    )
}