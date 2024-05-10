import {Vendor} from "@prisma/client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingButton} from "@mui/lab";

interface DialogVendorProps {
    open: boolean;
    onClose: (isToReload: boolean) => void;
    vendor: Vendor | null;
}

export default function DialogVendor({open, onClose, vendor}: DialogVendorProps) {
    const [name, setName] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [contact, setContact] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!vendor)
            return;
        setName(vendor.name)
        setPhone(vendor.phone ? vendor.phone : null)
        setEmail(vendor.email ? vendor.email : null)
        setContact(vendor.contact ? vendor.contact : null)
        setWebsite(vendor.website ? vendor.website : null)
    }, [vendor]);

    async function handleSubmit(e: any) {
        e.preventDefault()
        try {
            if (vendor) {
                await axios.put('/api/vendor', {
                    id: vendor.id,
                    name,
                    phone,
                    email,
                    contact,
                    website
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post('/api/vendor', {
                    name,
                    phone,
                    email,
                    contact,
                    website
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            handleClose(true)
        } catch (err: any) {
            console.log(err);
        }
    }

    function handleClose(isToReload: boolean) {
        onClose(isToReload)
        setContact(null)
        setEmail(null)
        setName(null)
        setPhone(null)
        setWebsite(null)
    }

    return <Dialog
        open={open}
        onClose={() => handleClose(false)}
        component={'form'}
        onSubmit={handleSubmit}
        fullWidth
        maxWidth={'sm'}
    >
        <DialogTitle>
            {vendor ? `Edit vendor` : 'Add a new vendor'}
        </DialogTitle>
        <DialogContent>
            <Grid container item xs={12} sx={{mt: 0}} spacing={1}>
                <Grid item xs={12}>
                    <TextField size={'small'} fullWidth label={'Name'} required value={name as string}
                                 onChange={(e: any) => setName(e.target.value)}/>
                </Grid>
                <Grid item xs={5}>
                    <TextField size={'small'} fullWidth label={'Phone'} value={phone as string}
                                 onChange={(e: any) => setPhone(e.target.value)}/>
                </Grid>
                <Grid item xs={7}>
                    <TextField size={'small'} type={'email'} fullWidth label={'Email'} value={email as string}
                                 onChange={(e: any) => setEmail(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField size={'small'} fullWidth label={'Contact'} value={contact as string}
                                 onChange={(e: any) => setContact(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField size={'small'} type={'url'} fullWidth label={'Website'} value={website as string}
                                 onChange={(e: any) => setWebsite(e.target.value)}/>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleClose(false)}>Cancel</Button>
            <LoadingButton loading={isLoading} type={'submit'} variant="contained">Save</LoadingButton>
        </DialogActions>
    </Dialog>
}