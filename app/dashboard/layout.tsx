"use client";
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import axios from "axios";
import {Avatar, Button, Grid, IconButton} from "@mui/material";
import React from "react";
import Paper from "@mui/material/Paper";
import {useRouter} from "next/navigation";
import LogoutIcon from '@mui/icons-material/Logout';

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [page, setPage] = useState<string>('dashboard');
    const router: any = useRouter();

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        console.log(localToken);
        if (!localToken)
            window.location.href = '/login';
        if (localToken)
            setToken(localToken);

        (async () => {
            try {
                const response = await axios.get('/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localToken}`
                    }
                });

                setUser(response.data);
            } catch (err: any) {
                console.error(err);
                // window.location.href = '/login';
            }
        })();
    }, []);

    if (!token || !user)
        return <></>;

    return <Box sx={{display: 'flex', height: '100%', bgcolor: 'whitesmoke'}}>
        <Grid container item xs={12} height={
            '100%'
        }>
            <Grid item xs={12}>
                <Paper sx={{
                    borderRadius: 0,
                }}>
                    <Grid container item xs={12} justifyContent={'space-between'} alignItems={'center'} p={1}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <img src="./CAMBA_FullColor.png" style={{
                                width: 50,
                                height: 'auto',
                                marginRight: 16
                            }}/>
                            <Typography variant="h6" noWrap component="div">
                                Purchase Requisition Workflow
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Typography variant="body1" noWrap component="div" sx={{mr: 2}}>
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Avatar alt={`${user?.firstName} ${user?.lastName}`} src="/static/images/avatar/1.jpg"/>
                            <IconButton onClick={
                                () => {
                                    router.push('/login')
                                }
                            }>
                                <LogoutIcon/>
                            </IconButton>
                        </Box>
                    </Grid>
                    <Divider/>
                    <Grid container item xs={12} alignItems={'center'} p={1}>
                        <Button size={'large'}  variant={page === 'dashboard' ? "contained" : 'text'} sx={{
                            color: page === 'dashboard' ? 'white' : 'black',
                            textTransform: 'none',
                            borderRadius: 10
                        }}
                                onClick={() => {
                                    setPage('dashboard')
                                    router.push('/dashboard')
                                }}>
                            Dashboard
                        </Button>

                        <Button size={'large'}  variant={page === 'purchase' ? "contained" : 'text'} sx={{
                            color: page === 'purchase' ? 'white' : 'black',
                            textTransform: 'none',
                            borderRadius: 10
                        }}
                                onClick={() => {
                                    setPage('purchase')
                                    router.push('/dashboard/purchases')
                                }}>
                            Purchase
                        </Button>
                        <Button size={'large'}  variant={page === 'users' ? "contained" : 'text'} sx={{
                            color: page === 'users' ? 'white' : 'black',
                            textTransform: 'none',
                            borderRadius: 10
                        }}
                                onClick={() => {
                                    setPage('users')
                                    router.push('/dashboard/users')
                                }}>
                            Users
                        </Button>
                        <Button size={'large'}  variant={page === 'vendor' ? "contained" : 'text'} sx={{
                            color: page === 'vendor' ? 'white' : 'black',
                            textTransform: 'none',
                            borderRadius: 10
                        }}
                                onClick={() => {
                                    setPage('vendor')
                                    router.push('/dashboard/vendor')
                                }}>
                            Vendor
                        </Button>
                        <Button size={'large'} variant={page === 'department' ? "contained" : 'text'} sx={{
                            color: page === 'department' ? 'white' : 'black',
                            textTransform: 'none',
                            borderRadius: 10
                        }}
                                onClick={() => {
                                    setPage('department')
                                    router.push('/dashboard/department')
                                }}>
                            Department
                        </Button>
                        <Button size={'large'}  variant={page === 'codegl' ? "contained" : 'text'} sx={{
                            color: page === 'codegl' ? 'white' : 'black',
                            textTransform: 'none',
                            borderRadius: 10
                        }}
                                onClick={() => {
                                    setPage('codegl')
                                    router.push('/dashboard/codeGL')
                                }}>
                            GL Code
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
            <Grid container item xs={12} component="main" sx={{height: 'calc(100% - 120px)'}}>
                {children}
            </Grid>
        </Grid>
    </Box>
}