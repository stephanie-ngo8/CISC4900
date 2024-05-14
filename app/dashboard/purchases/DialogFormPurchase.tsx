import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel, Grid,
    InputAdornment, ListItem, ListItemText,
    Radio,
    RadioGroup, TableCell, TextField
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Add, Close, Delete, Drafts} from "@mui/icons-material";
import axios from "axios";
import SelectWithUrl from "@/app/components/SelectWithUrl";
import {useEffect, useState} from "react";
import {
    LoadingButton,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
    timelineItemClasses
} from "@mui/lab";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

interface DialogFormPurchaseProps {
    open: boolean;
    onClose: (isToReload: boolean) => void;
    id?: any | null;
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
    const [status, setStatus] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (id && open) {
            (async () => {
                try {
                    const response = await axios.get('/api/purchase?id=' + id, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setTablePrice(response.data.items.map((item: any) => {
                        return {
                            itemNumber: item.itemNumber,
                            description: item.description,
                            glCode: item.gLCodeId.toString(),
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: item.quantity * item.unitPrice
                        }
                    }));
                    setTableDepartment(response.data.allocation.map((item: any) => {
                        return {
                            department: item.departmentId.toString(),
                            allocation: item.pourcentage,
                            amount: item.amount
                        }
                    }));
                    setDeliveryContactName(response.data.deliveryContacts.name);
                    setDeliveryContactPhone(response.data.deliveryContacts.phone);
                    setDeliveryContactAddress(response.data.deliveryContacts.address);
                    setDeliveryContactComment(response.data.deliveryContacts.comment);
                    setVendor(response.data.vendor.id.toString());
                    setIsTaxed(response.data.taxes > 0);
                    setTaxes(response.data.taxes);
                    setShippingCost(response.data.shippingCost);
                    setRequestByName(response.data.user.email);
                    setRequestByDate(response.data.createdAt);
                    setRequestByEmail(response.data.user.email);
                    setStatus(response.data.status);
                    setData(response.data);

                    console.log(response.data);
                } catch (err: any) {
                    console.log(err);
                }
            })();
        } else if (open) {
            setRequestByName(
                localStorage.getItem('name') as string
            );
            setRequestByDate(
                new Date().toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })
            );
            setRequestByEmail(
                localStorage.getItem('email') as string
            );
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
        setRequestByName('');
        setRequestByDate('');
        setRequestByEmail('');
        setStatus('');
    }

    async function drafts() {
        try {
            console.log('drafts', id);
            setIsLoading(true)
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
                    requestByEmail,
                    status: 'Draft'
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
                    requestByEmail,
                    status: 'Draft'
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            handleClose(true);
            setIsLoading(false)
        } catch (err: any) {
            console.log(err);
            setIsLoading(false)
        }
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        try {
            setIsLoading(true);
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
                    requestByEmail,
                    status: 'Waiting for approval'
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
                    requestByEmail,
                    status: 'Waiting for approval'
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            handleClose(true);
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
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

    async function handleStatus(status: string) {
        try {
            setIsLoading(true)
            await axios.put('/api/purchase/status', {
                id,
                status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            handleClose(true);
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            console.log(err);
        }
    }

    function getApprovedOrReject() {
        let sentence = '';
        let title = '';
        let isDisable = false;

        if (data?.rejectedAt) {
            title = 'Rejected';
            sentence = `Rejected on ${dayjs(data?.rejectedAt).format("MM-DD-YYYY")} by ${data?.rejectedBy.firstName} ${data?.rejectedBy.lastName}`;
            isDisable = true
        } else if (data?.approvedAt) {
            title = 'Approved';
            sentence = `Approved on ${dayjs(data?.approvedAt).format("MM-DD-YYYY")} by ${data?.approvedBy.firstName} ${data?.approvedBy.lastName}`;
            isDisable = true
        } else {
            title = 'Approved or Reject';
            sentence = 'Not yet approved by the manager';
        }

        return <><ListItem sx={{
            p: 0
        }}>
            <ListItemText
                primary={title}
                secondary={sentence}
            />

        </ListItem>
            {!isDisable && <Button sx={{mr: 1}} onClick={
                () => handleStatus('Rejected')
            } variant={'contained'} color={'error'}>Reject</Button>}
            {!isDisable && <Button onClick={
                () => handleStatus('Approved')
            } variant={'contained'} color={'success'}>Approve</Button>}
        </>
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
        <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {id ? `Edit the purchase ${id}` : 'Create a purchase'}
            <IconButton onClick={() => handleClose(false)}>
                <Close/>
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid container spacing={1} item xs={localStorage.getItem('role') !== 'PROGRAMS' ? 9 : 12} sx={{
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 200px)'
                }}>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Request By</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size={'small'} variant={'outlined'} label={'Name'} required disabled
                                   value={requestByName}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size={'small'} type={'date'} variant={'outlined'}
                                   label={'Date de creation'}
                                   required disabled
                                   value={requestByDate}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size={'small'} variant={'outlined'} label={'Email'} required disabled
                                   value={requestByEmail}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Delivery Contact</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size={'small'} variant={'outlined'} label={'Name'} required
                                   value={deliveryContactName} onChange={
                            (event) => setDeliveryContactName(event.target.value)
                        }/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size={'small'} variant={'outlined'} label={'Phone'} required
                                   value={deliveryContactPhone} onChange={
                            (event) => setDeliveryContactPhone(event.target.value)
                        }/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size={'small'} variant={'outlined'} label={'Address'} required
                                   value={deliveryContactAddress} onChange={
                            (event) => setDeliveryContactAddress(event.target.value)
                        }/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth size={'small'} variant={'outlined'} label={'Comment'} rows={3} multiline
                                   value={deliveryContactComment} onChange={
                            (event) => setDeliveryContactComment(event.target.value)
                        }/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Vendor</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <SelectWithUrl url={'/api/vendor'} value={vendor} onChange={
                            // @ts-ignore
                            (event: any) => {
                                setVendor(event.target.value)
                            }
                        }/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Item Pricing</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper} variant={'outlined'}>
                            <Box sx={{p: 0.5}}>
                                <Button startIcon={
                                    <Add/>
                                } onClick={handleAddRowTablePricing}>Add Item</Button>
                            </Box>
                            <Table size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Number</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>G/L Code</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Unit Price</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tablePrice.map((row, index) => {
                                        return <TableRow key={index}>
                                            <TableCell>
                                                <TextField size={'small'} type="text" required value={row.itemNumber}
                                                           onChange={
                                                               (event) => handleChangeTablePricing(event, index, 'itemNumber')
                                                           }/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField size={'small'} type="text" required value={row.description}
                                                           onChange={
                                                               (event) => handleChangeTablePricing(event, index, 'description')
                                                           }/>
                                            </TableCell>
                                            <TableCell>
                                                <SelectWithUrl url={'/api/codeGL'} value={row.glCode} onChange={
                                                    (event) => handleChangeTablePricing(event, index, 'glCode')
                                                }/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField size={'small'} type="text" required value={row.quantity}
                                                           onChange={
                                                               (event) => handleChangeTablePricing(event, index, 'quantity')
                                                           }/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField InputProps={{
                                                    endAdornment:
                                                        <InputAdornment position="end">
                                                            $
                                                        </InputAdornment>
                                                }} size={'small'} type="text" required value={row.unitPrice}
                                                           onChange={
                                                               (event) => handleChangeTablePricing(event, index, 'unitPrice')
                                                           }/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField size={'small'} type="text" disabled
                                                           value={calculateTotal(row)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Button startIcon={
                                                    <Delete/>
                                                } onClick={() => handleDeleteRowTablePricing(index)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={6}>
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
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth size={'small'} type="number" required={
                            isTaxed
                        } placeholder={'Taxes'} InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    $
                                </InputAdornment>
                        }} value={taxes} onChange={
                            (event) => setTaxes(event.target.value)
                        }/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Shipping Cost</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth size={'small'} type="number" InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    $
                                </InputAdornment>
                        }} required placeholder={'Shipping Cost'} value={shippingCost}
                                   onChange={
                                       (event) => setShippingCost(event.target.value)
                                   }/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Grand Total: $ {calculateGrandTotal()} </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Department / Allocation</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{
                        mb: 2
                    }}>
                        <TableContainer component={Paper} variant={'outlined'}>
                            <Box sx={{p: 0.5}}>
                                <Button startIcon={
                                    <Add/>
                                } onClick={handleAddRowTableDepartment}>Add Dept</Button>
                            </Box>
                            <Table size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Department</TableCell>
                                        <TableCell>% of Allocation</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableDepartment.map((row, index) => {
                                        return <TableRow key={index}>
                                            <TableCell>
                                                <SelectWithUrl url={'/api/department'} value={row.department} onChange={
                                                    (event) => handleChangeTableDepartment(event, index, 'department')
                                                }/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField size={'small'} fullWidth type="text" required
                                                           value={row.allocation} onChange={
                                                    (event) => handleChangeTableDepartment(event, index, 'allocation')
                                                }/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField size={'small'} fullWidth type="text" required
                                                           value={row.amount} onChange={
                                                    (event) => handleChangeTableDepartment(event, index, 'amount')
                                                }/>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() => handleDeleteRowTableDepartment(index)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                {localStorage.getItem('role') !== 'PROGRAMS' && <Grid container item xs={3} alignContent={'start'}>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>Status</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Timeline sx={{
                            [`& .${timelineItemClasses.root}:before`]: {
                                flex: 0,
                                padding: 0,
                                margin: 0,
                            },
                        }}>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot/>
                                    <TimelineConnector/>
                                </TimelineSeparator>
                                <TimelineContent>
                                    <ListItem sx={{
                                                  p: 0
                                              }}>
                                        <ListItemText
                                            primary={'Submit'}
                                            secondary={data?.submittedAt ? `On ${dayjs(data?.submittedAt).format("MM-DD-YYYY")} by ${requestByName}` : 'Not yet submitted'}
                                        />
                                    </ListItem>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot/>
                                    <TimelineConnector/>
                                </TimelineSeparator>
                                <TimelineContent>
                                    {getApprovedOrReject()}
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot/>
                                    <TimelineConnector/>
                                </TimelineSeparator>
                                <TimelineContent>
                                    <ListItem button sx={{
                                        p: 0
                                    }} onClick={
                                        () => handleStatus('Purchased')
                                    }>
                                        <ListItemText
                                            primary={'Purchased Order'}
                                            secondary={data?.purchacePlaceAt ? `
        On ${dayjs(data?.purchacePlaceAt).format("MM-DD-YYYY")} by ${data?.purchacePlaceBy.firstName} ${data?.purchacePlaceBy.lastName}`
                                                : 'Not yet purchased'}
                                        />
                                    </ListItem>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot/>
                                </TimelineSeparator>
                                <TimelineContent>
                                    <ListItem button sx={{
                                        p: 0
                                    }} onClick={
                                        () => handleStatus('Received')
                                    }>
                                        <ListItemText
                                            primary={'Received'}
                                            secondary={data?.receivedAt ? `
        On ${dayjs(data?.receivedAt).format("MM-DD-YYYY")} by ${data?.receivedBy.firstName} ${data?.receivedBy.lastName}`
                                                : 'Not yet received by the department'}
                                        />
                                    </ListItem>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </Grid>
                </Grid>}
            </Grid>
        </DialogContent>
        <DialogActions>
            {(status === 'Draft' || status === "Waiting for approval") &&
                <Button variant={'outlined'} color={'error'} startIcon={<Delete/>} disabled={id === null}
                        onClick={() => deleteForm(id as string)}>Delete</Button>}
            {(id === null || status === '' || status === "Draft") &&
                <Button variant={'contained'} onClick={drafts} startIcon={<Drafts/>}>Draft</Button>}
            {(id === null || status === '' || status === "Draft") &&
                <LoadingButton loading={isLoading} variant={'contained'} startIcon={<Add/>}
                               type={'submit'}>Submit</LoadingButton>}
        </DialogActions>
    </Dialog>
}