"use client";
import {GLCode} from "@prisma/client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingButton} from "@mui/lab";

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

    return <Dialog
        open={open}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth={'sm'}
        component={'form'}
        onSubmit={handleSubmit}
    >
        <DialogTitle>
            {code ? ` G/L Code ${code.code}` : 'Add a new  G/L Code'}
        </DialogTitle>
        <DialogContent>
            <Grid container item spacing={2} xs={12} sx={{mt: 0}}>
                <Grid item xs={6}>
                    <TextField fullWidth size={'small'} variant={'outlined'} label={'Code'} required value={glCode}
                               onChange={(event) => setGLCode(event.target.value)}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth size={'small'} variant={'outlined'} label={'Name'} required value={name}
                               onChange={(event) => setName(event.target.value)}/>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleClose(false)}>Cancel</Button>
            <LoadingButton type={'submit'} variant={'contained'}>Save</LoadingButton>
        </DialogActions>
    </Dialog>

}