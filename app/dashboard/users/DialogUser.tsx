"use client";
import {PrismaClient, User} from "@prisma/client";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

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

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setPassword(user.password);
        }
    }, [user]);

    function handleClose(isToReload: boolean) {
        onClose(isToReload);
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
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
                    lastName
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
                    lastName
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

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            {user ? `Edit user ${user.id}` : 'Add a new user'}
            <button onClick={() => handleClose(false)}>Close</button>
        </DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder={'First name'} required value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
                <input type="text" placeholder={'Last name'} required value={lastName} onChange={(event) => setLastName(event.target.value)}/>
                <input type="email" placeholder={'Email'} required value={email} onChange={(event) => setEmail(event.target.value)}/>
                <input type="password" placeholder={'Password'} required value={password} onChange={(event) => setPassword(event.target.value)}/>
                <button type={'submit'}>Save</button>
            </form>
        </DialogContent>
    </Dialog>

}