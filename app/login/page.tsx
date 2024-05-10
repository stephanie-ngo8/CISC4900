"use client";
import {useState} from "react";
import axios from "axios";
import {Grid, TextField, Button} from "@mui/material";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);

    async function handleSubmit(event: any) {
        event.preventDefault();

        try {
            const response = await axios.post('/api/login', {email, password});

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name', response.data.user.firstName + ' ' + response.data.user.lastName);
                localStorage.setItem('email', response.data.user.email);
                window.location.href = '/dashboard';
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true)
        }
    }

    return (
        <Grid container item xs={12} sx={{height: '100%'}} p={0}>
            <Grid container item xs={8} sx={{bgcolor: 'whitesmoke', height: '100%'}} alignContent={'center'} justifyContent={'center'}>
                <img src={'./CAMBA_FullColor.png'} alt={'login'} style={{width: 'auto', height: '40%'}}/>
            </Grid>
            <Grid container item xs={4} sx={{height: '100%'}} component={'form'} alignContent={
                'center'
            } onSubmit={handleSubmit} justifyContent={'center'} spacing={2} p={2} textAlign={'center'}>
                <Grid item xs={12}>
                    <h1>Welcome to Purchase</h1>
                    <p>Please sign-in to your account and start the adventure</p>
                </Grid>
                <Grid item xs={12}>
                    <TextField required value={email} onChange={(event) => setEmail(event.target.value)} type="email"
                    variant={'outlined'} label={
                        'Email'} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField required value={password} onChange={(event) => setPassword(event.target.value)} type="password"
                               variant={'outlined'} label={
                        'Password'} fullWidth/>
                </Grid>
                <Grid item xs={6}>
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        Log In
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {isError && <p>Invalid credentials</p>}
                </Grid>
            </Grid>
        </Grid>
    );
}