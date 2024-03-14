import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";
import axios from "axios";
import SelectWithUrl from "@/app/components/SelectWithUrl";
import {useEffect, useState} from "react";

interface DialogFormPurchaseProps {
    open: boolean;
    onClose: (isToReload: boolean) => void;
    id?: string | null;
}

export default function DialogFormPurchase({open, onClose, id = null}: DialogFormPurchaseProps) {
    const [tablePrice, setTablePrice] = useState([{
        itemNumber: '',
        description: '',
        glCode: null,
        quantity: '',
        unitPrice: '',
        total: ''
    }]);
    const [tableDepartment, setTableDepartment] = useState([{department: null, allocation: '', amount: ''}]);
    const [deliveryContactName, setDeliveryContactName] = useState('');
    const [deliveryContactPhone, setDeliveryContactPhone] = useState('');
    const [deliveryContactAddress, setDeliveryContactAddress] = useState('');
    const [deliveryContactComment, setDeliveryContactComment] = useState('');

    const [vendor, setVendor] = useState(null);

    const [isTaxed, setIsTaxed] = useState(false);
    const [taxes, setTaxes] = useState('');
    const [shippingCost, setShippingCost] = useState('');

    const [requestByName, setRequestByName] = useState('');
    const [requestByDate, setRequestByDate] = useState('');
    const [requestByEmail, setRequestByEmail] = useState('');

    useEffect(() => {
        if (id && open) {
            (async () => {
                try {
                    const response = await axios.get('/api/purchase?id=' + id, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    console.log(response.data);
                } catch (err: any) {
                    console.log(err);
                }
            })();
        }
    }, [id, open]);

    function handleClose(isToReload: boolean) {
        onClose(isToReload);
        setTablePrice([{
            itemNumber: '',
            description: '',
            glCode: null,
            quantity: '',
            unitPrice: '',
            total: ''
        }]);
        setTableDepartment([{department: null, allocation: '', amount: ''}]);
        setDeliveryContactName('');
        setDeliveryContactPhone('');
        setDeliveryContactAddress('');
        setDeliveryContactComment('');
        setVendor(null);
        setIsTaxed(false);
        setTaxes('');
        setShippingCost('');
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        try {
            if (id) {
                await axios.put('/api/purchase', {
                    id,
                    deliveryContactName,
                    deliveryContactPhone,
                    deliveryContactAddress,
                    deliveryContactComment,
                    vendor,
                    isTaxed,
                    taxes,
                    shippingCost,
                    tablePrice,
                    tableDepartment,
                    requestByName,
                    requestByDate,
                    requestByEmail
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post('/api/purchase', {
                    deliveryContactName,
                    deliveryContactPhone,
                    deliveryContactAddress,
                    deliveryContactComment,
                    vendor,
                    isTaxed,
                    taxes,
                    shippingCost,
                    tablePrice,
                    tableDepartment,
                    requestByName,
                    requestByDate,
                    requestByEmail
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            handleClose(true);
        } catch (err: any) {
            console.log(err);
        }
    }

    async function deleteForm(id: string) {
        try {
            await axios.patch(`/api/purchase`, {id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            handleClose(true);
        } catch (err: any) {
            console.log(err);
        }
    }

    function handleAddRowTablePricing() {
        setTablePrice([...tablePrice, {
            itemNumber: '',
            description: '',
            glCode: null,
            quantity: '',
            unitPrice: '',
            total: ''
        }]);
    }

    function handleChangeTablePricing(event: any, index: number, key: string) {
        const newTablePrice = [...tablePrice];
        // @ts-ignore
        newTablePrice[index][key] = event.target.value;
        setTablePrice(newTablePrice);
    }

    function handleChangeTableDepartment(event: any, index: number, key: string) {
        const newTableDepartment = [...tableDepartment];
        // @ts-ignore
        newTableDepartment[index][key] = event.target.value;
        setTableDepartment(newTableDepartment);
    }

    function handleAddRowTableDepartment() {
        setTableDepartment([...tableDepartment, {department: null, allocation: '', amount: ''}]);
    }

    function handleDeleteRowTablePricing(index: number) {
        const newTablePrice = [...tablePrice];
        newTablePrice.splice(index, 1);
        setTablePrice(newTablePrice);
    }

    function handleDeleteRowTableDepartment(index: number) {
        const newTableDepartment = [...tableDepartment];
        newTableDepartment.splice(index, 1);
        setTableDepartment(newTableDepartment);
    }

    function calculateTotal(row: any) {
        if (parseFloat(row.quantity) && parseFloat(row.unitPrice))
            return parseFloat(row.quantity) * parseFloat(row.unitPrice);
        return 0;
    }

    function calculateGrandTotal() {
        if (parseFloat(shippingCost)) {
            let total = 0;
            tablePrice.forEach((row) => {
                total += calculateTotal(row);
            });


            return total + parseFloat(shippingCost) + (isTaxed && parseFloat(taxes) ? parseFloat(taxes) : 0)
        }

        return 0
    }


    // @ts-ignore
    return <Dialog open={open} onClose={() => handleClose(false)} fullWidth sx={{
        "& .MuiDialog-paper": {
            maxWidth: "calc(100% - 70px)",
            maxHeight: "calc(100% - 70px)",
            height: "100%",
            margin: 0
        }
    }} component={'form'} onSubmit={handleSubmit}>
        <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            New Purchase
            <IconButton onClick={() => handleClose(false)}>
                <Close/>
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <div>Request By</div>
            <input type="text" placeholder="Name" required disabled value={requestByName}/>
            <input type="date" placeholder="Date" required disabled value={requestByDate}/>
            <input type="email" placeholder="Email" required disabled value={requestByEmail}/>
            <div>Delivery Contact</div>
            <input type="text" placeholder="Name" required value={deliveryContactName} onChange={
                (event) => setDeliveryContactName(event.target.value)
            }/>
            <input type="text" placeholder="Phone" required value={deliveryContactPhone} onChange={
                (event) => setDeliveryContactPhone(event.target.value)
            }/>
            <input type="text" placeholder="Address" required value={deliveryContactAddress} onChange={
                (event) => setDeliveryContactAddress(event.target.value)
            }/>
            <textarea placeholder="Comment" required value={deliveryContactComment} onChange={
                (event) => setDeliveryContactComment(event.target.value)
            }/>
            <div>Vendor</div>
            <SelectWithUrl url={'/api/vendor'} value={vendor} onChange={
                // @ts-ignore
                (event) => setVendor(event.target.value)
            }/>
            <div>Item Pricing</div>
            <table>
                <thead>
                <tr>
                    <th>Item Number</th>
                    <th>Description</th>
                    <th>G/L code</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {tablePrice.map((row, index) => {
                    return <tr key={index}>
                        <td>
                            <input type="text" required value={row.itemNumber} onChange={
                                (event) => handleChangeTablePricing(event, index, 'itemNumber')
                            }/>
                        </td>
                        <td>
                            <input type="text" required value={row.description} onChange={
                                (event) => handleChangeTablePricing(event, index, 'description')
                            }/>
                        </td>
                        <td>
                            <SelectWithUrl url={'/api/codeGL'} value={row.glCode} onChange={
                                (event) => handleChangeTablePricing(event, index, 'glCode')
                            }/>
                        </td>
                        <td>
                            <input type="text" required value={row.quantity} onChange={
                                (event) => handleChangeTablePricing(event, index, 'quantity')
                            }/>
                        </td>
                        <td>
                            <input type="text" required value={row.unitPrice} onChange={
                                (event) => handleChangeTablePricing(event, index, 'unitPrice')
                            }/>
                        </td>
                        <td>
                            <input type="text" disabled value={calculateTotal(row)}/>
                        </td>
                        <td>
                            <button onClick={() => handleDeleteRowTablePricing(index)}>Delete</button>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
            <button onClick={handleAddRowTablePricing}>Add Row</button>
            <div>Total</div>
            <FormControl>
                <FormLabel>Taxes</FormLabel>
                <RadioGroup
                    row
                    value={isTaxed}
                    onChange={(event) => setIsTaxed(event.target.value === 'true')}
                >
                    <FormControlLabel value={true} control={<Radio/>} label="Yes"/>
                    <FormControlLabel value={false} control={<Radio/>} label="No"/>
                </RadioGroup>
            </FormControl>
            <input type="number" required placeholder={'taxes'} value={taxes} onChange={
                (event) => setTaxes(event.target.value)
            }/>
            <input type="number" required placeholder={'shipping cost'} value={shippingCost} onChange={
                (event) => setShippingCost(event.target.value)
            }/>
            <div>Grand Total: {calculateGrandTotal()} $</div>
            <div>Department / Allocation</div>
            <table>
                <thead>
                <tr>
                    <th>Department</th>
                    <th>% de Allocation</th>
                    <th>Amount</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {tableDepartment.map((row, index) => {
                    return <tr key={index}>
                        <td>
                            <SelectWithUrl url={'/api/department'} value={row.department} onChange={
                                (event) => handleChangeTableDepartment(event, index, 'department')
                            }/>
                        </td>
                        <td>
                            <input type="text" required value={row.allocation} onChange={
                                (event) => handleChangeTableDepartment(event, index, 'allocation')
                            }/>
                        </td>
                        <td>
                            <input type="text" required value={row.amount} onChange={
                                (event) => handleChangeTableDepartment(event, index, 'amount')
                            }/>
                        </td>
                        <td>
                            <button onClick={() => handleDeleteRowTableDepartment(index)}>Delete</button>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
            <button onClick={handleAddRowTableDepartment}>Add Dept</button>
        </DialogContent>
        <DialogActions>
            <button disabled={id === null} onClick={() => deleteForm(id as string)}>Delete</button>
            <button type={'submit'}>Submit</button>
        </DialogActions>
    </Dialog>
}