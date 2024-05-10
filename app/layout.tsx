"use client"
import type {Metadata} from "next";
import {Inter} from "next/font/google";
//import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ThemeProvider, createTheme} from '@mui/material/styles';

const inter = Inter({subsets: ["latin"]});

const theme = createTheme({
    palette: {
        primary: {
            main: '#8C57FF', // Remplacez cette couleur par la couleur primaire souhaitée
        },
        // Vous pouvez également personnaliser d'autres couleurs ici, comme error, warning, success, etc.
    },
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider theme={theme}>
            <html lang="en">
            <body style={{margin: 0, height: '100vh'}} className={inter.className}>{children}</body>
            </html>
        </ThemeProvider>
    );
}
