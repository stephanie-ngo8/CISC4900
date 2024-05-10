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
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import {Add, Visibility} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export default function Purchases() {
    const [open, setOpen] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [isToReload, setIsToReload] = useState(true);
    const [idToEdit, setIdToEdit] = useState<number | null>(null);

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
            <Box sx={{p: 3, overflow: 'auto', width: '100%'}}>
                <TableContainer component={Paper} elevation={3} sx={{width: '100%'}}>
                    <Box sx={{p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant={'h6'}>
                            Purchases
                        </Typography>
                        <Button variant={'outlined'} startIcon={<Add/>} onClick={() => setOpen(true)}>Add a new purchase</Button>
                    </Box>
                    <Table sx={{width: '100%'}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Identifiant</TableCell>
                                <TableCell align="right">User</TableCell>
                                <TableCell align="right">Contact</TableCell>
                                <TableCell align="right">Vendor</TableCell>
                                <TableCell align="right">Items</TableCell>
                                <TableCell align="right">Allocation</TableCell>
                                <TableCell align="right">Updated At</TableCell>
                                <TableCell align="right">Created At</TableCell>
                                <TableCell align="right">Status</TableCell>
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
                                    <TableCell align="right">{row.user.email}</TableCell>
                                    <TableCell align="right">{row.deliveryContacts.name}</TableCell>
                                    <TableCell align="right">{row.vendor.name}</TableCell>
                                    <TableCell align="right">{row.items.length}</TableCell>
                                    <TableCell align="right">{row.allocation.length}</TableCell>
                                    <TableCell align="right">{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                    <TableCell align="right">{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                    <TableCell align="right" sx={{fontStyle: 'italic'}}>
                                        {row.status}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size={'small'} onClick={() => {
                                            setIdToEdit(row.id);
                                            setOpen(true);
                                        }}>
                                            <Visibility fontSize={'small'}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <DialogFormPurchase open={open} id={idToEdit} onClose={(isToReload: boolean) => {
                    setIsToReload(isToReload)
                    setOpen(false)
                    setIdToEdit(null)
                }}/>
            </Box>
    )
}