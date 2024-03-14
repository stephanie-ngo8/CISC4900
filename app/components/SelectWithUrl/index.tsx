import {useEffect, useState} from "react";
import axios from "axios";

interface SelectWithUrlProps {
    url: string;
    value?: any;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectWithUrl({url, value, onChange}: SelectWithUrlProps): JSX.Element {
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


    return <select value={value} onChange={
        (event) => {
            if (onChange) {
                onChange(event);
            }
        }
    }>
        {data.map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}
    </select>
}