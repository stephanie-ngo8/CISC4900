import {Department} from "@prisma/client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingButton} from "@mui/lab";

interface DialogDepartmentProps {
    open: boolean;
    onClose: (isToReload: boolean) => void;
    department: Department | null;
}

export default function DialogDepartment({open, onClose, department}: DialogDepartmentProps) {
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (department) {
            setCode(department.code);
            setName(department.name);
        }
    }, [department]);

    function handleClose(isToReload: boolean) {
        onClose(isToReload);
        setCode('');
        setName('');
    }

    async function handleSubmit(event: any) {
        event.preventDefault();

        try {
            if (department) {
                await axios.put(`/api/department`, {
                    id: department.id,
                    code: code,
                    name
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post(`/api/department`, {
                    code: code,
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
            {department ? `Edit department ${department.code}` : 'Add a new department'}
        </DialogTitle>
        <DialogContent>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={6}>
                    <TextField fullWidth size={'small'} variant={'outlined'} type={'text'} placeholder={'Code'} required value={code}
                                 onChange={(event) => setCode(event.target.value)}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth size={'small'} variant={'outlined'} type={'text'} placeholder={'Name'} required value={name}
                                 onChange={(event) => setName(event.target.value)}/>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleClose(false)}>Close</Button>
            <LoadingButton loading={false} type={'submit'} variant={'contained'}>Save</LoadingButton>
        </DialogActions>
    </Dialog>

}