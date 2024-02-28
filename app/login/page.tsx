"use client";
import {useState} from "react";
import axios from "axios";

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
                window.location.href = '/dashboard';
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Username"/>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password"/>
                <button type="submit">Login</button>
            </form>
            {isError && <p>Invalid credentials</p>}
        </div>
    );
}