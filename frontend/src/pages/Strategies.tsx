import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    AppBar,
    Toolbar,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp,
    Security,
    Speed,
    Logout,
} from '@mui/icons-material';

const strategies = [
    {
        id: 1,
        name: 'Conservative Income',
        description: 'Low risk portfolio focused on stable dividend-paying stocks and bonds',
        risk: 'Low',
        expectedReturn: '4-6%',
        minInvestment: 1000,
        allocation: { stocks: 30, bonds: 60, alternatives: 10 },
        icon: <Security sx={{ fontSize: 40, color: '#00C805' }} />,
    },
    {
        id: 2,
        name: 'Balanced Growth',
        description: 'Moderate risk portfolio with balanced allocation across asset classes',
        risk: 'Medium',
        expectedReturn: '6-9%',
        minInvestment: 5000,
        allocation: { stocks: 60, bonds: 30, alternatives: 10 },
        icon: <TrendingUp sx={{ fontSize: 40, color: '#FFB800' }} />,
    },
    {
        id: 3,
        name: 'Aggressive Growth',
        description: 'High risk portfolio focused on growth stocks and emerging markets',
        risk: 'High',
        expectedReturn: '10-15%',
        minInvestment: 10000,
        allocation: { stocks: 85, bonds: 10, alternatives: 5 },
        icon: <Speed sx={{ fontSize: 40, color: '#FF6B00' }} />,
    },
    {
        id: 4,
        name: 'Tech Innovation',
        description: 'Focused on technology and innovation sector for maximum growth potential',
        risk: 'Very High',
        expectedReturn: '12-20%',
        minInvestment: 25000,
        allocation: { stocks: 95, bonds: 0, alternatives: 5 },
        icon: <Speed sx={{ fontSize: 40, color: '#FF0000' }} />,
    },
];

export default function Strategies() {
    const navigate = useNavigate();
    const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return '#00C805';
            case 'Medium': return '#FFB800';
            case 'High': return '#FF6B00';
            case 'Very High': return '#FF0000';
            default: return '#00C805';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" sx={{ bgcolor: '#1C1C1E' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        TradeWise
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/profile')}>
                        Profile
                    </Button>
                    <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                    Investment Strategies
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Choose a strategy that matches your risk profile and investment goals
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {strategies.map((strategy) => (
                        <Card
                            key={strategy.id}
                            sx={{
                                bgcolor: selectedStrategy === strategy.id ? '#2C2C2E' : '#1C1C1E',
                                border: selectedStrategy === strategy.id ? '2px solid #00C805' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                flex: '1 1 280px',
                                minWidth: 280,
                                maxWidth: 400,
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0, 200, 5, 0.2)',
                                },
                            }}
                            onClick={() => setSelectedStrategy(strategy.id)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    {strategy.icon}
                                    <Chip
                                        label={strategy.risk}
                                        size="small"
                                        sx={{
                                            bgcolor: getRiskColor(strategy.risk),
                                            color: '#000',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {strategy.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                    {strategy.description}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Expected Return</Typography>
                                    <Typography variant="h6" sx={{ color: '#00C805', fontWeight: 600 }}>
                                        {strategy.expectedReturn}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Min. Investment</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        ${strategy.minInvestment.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                        Asset Allocation
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                        <Chip label={`Stocks ${strategy.allocation.stocks}%`} size="small" sx={{ bgcolor: '#00C805', color: '#000' }} />
                                        <Chip label={`Bonds ${strategy.allocation.bonds}%`} size="small" sx={{ bgcolor: '#3B82F6', color: '#fff' }} />
                                        <Chip label={`Alt ${strategy.allocation.alternatives}%`} size="small" sx={{ bgcolor: '#8B5CF6', color: '#fff' }} />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={strategy.allocation.stocks}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: '#3B82F6',
                                            '& .MuiLinearProgress-bar': { bgcolor: '#00C805' },
                                        }}
                                    />
                                </Box>

                                <Button
                                    fullWidth
                                    variant={selectedStrategy === strategy.id ? 'contained' : 'outlined'}
                                    sx={{
                                        mt: 2,
                                        ...(selectedStrategy === strategy.id && {
                                            background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                                        }),
                                    }}
                                >
                                    {selectedStrategy === strategy.id ? 'Selected' : 'Select Strategy'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
