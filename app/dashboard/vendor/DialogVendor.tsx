import {Vendor} from "@prisma/client";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

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

    useEffect(() => {
        if (!vendor)
            return;
        setName(vendor.name)
        setPhone(vendor.phone)
        setEmail(vendor.email)
        setContact(vendor.contact)
        setWebsite(vendor.website)
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

    return <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>
            {vendor ? `Edit vendor` : 'Add a new vendor'}
            <button onClick={() => handleClose(false)}>Close</button>
        </DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder={'Name'} required value={name as string} onChange={(e: any) => setName(e.target.value)}/>
                <input type="text" placeholder={'Phone'} value={phone as string} onChange={(e: any) => setPhone(e.target.value)}/>
                <input type="text" placeholder={'Email'} value={email as string} onChange={(e: any) => setEmail(e.target.value)}/>
                <input type="text" placeholder={'Contact'} value={contact as string} onChange={(e: any) => setContact(e.target.value)}/>
                <input type="text" placeholder={'Website'} value={website as string} onChange={(e: any) => setWebsite(e.target.value)}/>
                <button type={'submit'}>Save</button>
            </form>
        </DialogContent>
    </Dialog>
}