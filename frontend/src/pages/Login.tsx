import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Tab,
    Tabs,
    Alert,
} from '@mui/material';
import { authService } from '../services/authService';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Login form
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // Register form
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await authService.login(loginData);
            localStorage.setItem('user', JSON.stringify(response));
            setSuccess('Login successful!');
            onLogin();

            // Check if user has completed profiling
            const hasProfile = localStorage.getItem(`profile_${response.userId}`);
            if (!hasProfile) {
                setTimeout(() => navigate('/onboarding'), 1000);
            } else {
                setTimeout(() => navigate('/dashboard'), 1000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await authService.register(registerData);
            localStorage.setItem('user', JSON.stringify(response));
            setSuccess('Registration successful! Let\'s set up your investment profile.');
            onLogin();
            setTimeout(() => navigate('/onboarding'), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        background: 'rgba(28, 28, 30, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            mb: 1,
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        TradeWise
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Automated Investment Strategies
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {tab === 0 ? (
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Username"
                                margin="normal"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                                    fontWeight: 600,
                                }}
                            >
                                Login
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <TextField
                                fullWidth
                                label="Username"
                                margin="normal"
                                value={registerData.username}
                                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                margin="normal"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    value={registerData.firstName}
                                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    value={registerData.lastName}
                                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                required
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                                    fontWeight: 600,
                                }}
                            >
                                Create Account
                            </Button>
                        </form>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
