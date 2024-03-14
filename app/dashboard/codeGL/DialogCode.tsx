"use client";
import {GLCode} from "@prisma/client";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

interface DialogCodeProps {
    open: boolean;
    onClose: (isToReload: boolean) => void;
    code: GLCode | null;
}

export default function DialogCode({open, onClose, code}: DialogCodeProps) {
    const [glCode, setGLCode] = useState<string>('');
    const [name, setName] = useState<string>('');


    useEffect(() => {
        if (code) {
            setGLCode(code.code);
            setName(code.name);
        }
    }, [code]);

    function handleClose(isToReload: boolean) {
        onClose(isToReload);
        setGLCode('');
        setName('');
    }

    async function handleSubmit(event: any) {
        event.preventDefault();

        try {
            if (code) {
                await axios.put(`/api/codeGL`, {
                    id: code.id,
                    code: glCode,
                    name
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post(`/api/codeGL`, {
                    code: glCode,
                    name
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

    return <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>
            {code ? ` G/L Code ${code.code}` : 'Add a new  G/L Code'}
            <button onClick={() => handleClose(false)}>Close</button>
        </DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder={'Code'} required value={glCode} onChange={(event) => setGLCode(event.target.value)}/>
                <input type="text" placeholder={'Name'} required value={name} onChange={(event) => setName(event.target.value)}/>
                <button type={'submit'}>Save</button>
            </form>
        </DialogContent>
    </Dialog>

}