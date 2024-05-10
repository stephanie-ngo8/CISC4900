import {useEffect, useState} from "react";
import axios from "axios";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

interface SelectWithUrlProps {
    url: string;
    value?: any;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
}

export default function SelectWithUrl({url, value, onChange, label = ''}: SelectWithUrlProps): JSX.Element {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(url + "?autocomplete=true", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setData(response.data);
            } catch (err: any) {
                console.log(err);
            }
        })();
    }, [url]);

    return <FormControl fullWidth size={'small'} required sx={{
        minWidth: 200
    }}>
        <InputLabel>{label}</InputLabel>
        <Select
            value={value}
            label={label}
            onChange={(event: any) => {
                if (onChange) {
                    onChange(event);
                }
            }}
        >
            {data.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
    </FormControl>
}