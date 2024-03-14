import {Department} from "@prisma/client";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

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

    return <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>
            {department ? `Edit department ${department.code}` : 'Add a new department'}
            <button onClick={() => handleClose(false)}>Close</button>
        </DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder={'Code'} required value={code} onChange={(event) => setCode(event.target.value)}/>
                <input type="text" placeholder={'Name'} required value={name} onChange={(event) => setName(event.target.value)}/>
                <button type={'submit'}>Save</button>
            </form>
        </DialogContent>
    </Dialog>

}