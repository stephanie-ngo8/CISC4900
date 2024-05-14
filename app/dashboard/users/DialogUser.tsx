"use client";
import {PrismaClient, User} from "@prisma/client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingButton} from "@mui/lab";

interface DialogUserProps {
    open: boolean;
    onClose: (isToReload: boolean) => void;
    user: User | null;
}

const prisma = new PrismaClient();

export default function DialogUser({open, onClose, user}: DialogUserProps) {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('');

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setPassword(user.password);
            setRole(user.role);
        }
    }, [user]);

    function handleClose(isToReload: boolean) {
        onClose(isToReload);
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setRole('')
    }

    async function handleSubmit(event: any) {
        event.preventDefault();

        try {
            if (user) {
                await axios.put(`/api/users`, {
                    id: user.id,
                    email,
                    password,
                    firstName,
                    lastName,
                    role
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post(`/api/users`, {
                    email,
                    password,
                    firstName,
                    lastName,
                    role
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            handleClose(true);
        } catch (error) {
            console.error(error);
        }
    }

    return <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        component={'form'}
        onSubmit={handleSubmit}
    >
        <DialogTitle>
            {user ? `Edit user ${user.email}` : 'Add a new user'}
        </DialogTitle>
        <DialogContent>
            <Grid container item xs={12} spacing={2} sx={{mt: 0}}>
                <Grid item xs={6}>
                    <TextField fullWidth size={'small'} label={'First name'} required value={firstName}
                               onChange={(event) => setFirstName(event.target.value)}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth size={'small'} label={'Last name'} required value={lastName}
                               onChange={(event) => setLastName(event.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size={'small'} label={'Email'} type={'email'} required value={email}
                               onChange={(event) => setEmail(event.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size={'small'} label={'Password'} required value={password}
                               onChange={(event) => setPassword(event.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth size={'small'} required>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={role}
                            label="Role"
                            onChange={(event) => setRole(event.target.value)}
                        >
                            <MenuItem value={'ADMIN'}>Admin</MenuItem>
                            <MenuItem value={'PROGRAMS'}>Programs</MenuItem>
                            <MenuItem value={'APPROVERS'}>Approvers</MenuItem>
                            <MenuItem value={'PURCHASERS'}>Purchasers</MenuItem>
                        </Select>
                    </FormControl>          
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleClose(false)}>Cancel</Button>
            <LoadingButton loading={false} type={'submit'} variant={'contained'}>Save</LoadingButton>
        </DialogActions>
    </Dialog>

}