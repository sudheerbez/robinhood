import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    AppBar,
    Toolbar,
    Chip,
} from '@mui/material';
import {
    TrendingUp,
    AccountBalance,
    ShowChart,
    Logout,
    Person,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const portfolioData = [
    { month: 'Jan', value: 10000 },
    { month: 'Feb', value: 10500 },
    { month: 'Mar', value: 10200 },
    { month: 'Apr', value: 11200 },
    { month: 'May', value: 11800 },
    { month: 'Jun', value: 12500 },
    { month: 'Jul', value: 12100 },
    { month: 'Aug', value: 13200 },
    { month: 'Sep', value: 13800 },
    { month: 'Oct', value: 14500 },
    { month: 'Nov', value: 15200 },
    { month: 'Dec', value: 16420 },
];

const activeStrategies = [
    { name: 'Balanced Growth', allocation: 60, return: '+12.4%', color: '#00C805' },
    { name: 'Tech Innovation', allocation: 25, return: '+18.2%', color: '#3B82F6' },
    { name: 'Conservative Income', allocation: 15, return: '+5.8%', color: '#8B5CF6' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" sx={{ bgcolor: '#1C1C1E' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        TradeWise
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/strategies')}>
                        Strategies
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/profile')} startIcon={<Person />}>
                        Profile
                    </Button>
                    <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Here's your portfolio overview
                </Typography>

                {/* Stats Cards */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                    <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 250px', minWidth: 250 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AccountBalance sx={{ color: '#00C805', mr: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Portfolio Value
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                $16,420.00
                            </Typography>
                            <Chip
                                label="+64.2% all time"
                                size="small"
                                sx={{ mt: 1, bgcolor: 'rgba(0, 200, 5, 0.2)', color: '#00C805' }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 250px', minWidth: 250 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ color: '#00C805', mr: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary">
                                    Today's Change
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#00C805' }}>
                                +$342.50
                            </Typography>
                            <Chip
                                label="+2.13%"
                                size="small"
                                sx={{ mt: 1, bgcolor: 'rgba(0, 200, 5, 0.2)', color: '#00C805' }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 250px', minWidth: 250 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ShowChart sx={{ color: '#3B82F6', mr: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary">
                                    Active Strategies
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                3
                            </Typography>
                            <Chip
                                label="All performing"
                                size="small"
                                sx={{ mt: 1, bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
                            />
                        </CardContent>
                    </Card>
                </Box>

                {/* Chart and Strategies */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {/* Portfolio Chart */}
                    <Card sx={{ bgcolor: '#1C1C1E', flex: '2 1 500px', minWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Portfolio Performance
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={portfolioData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="month" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1C1C1E',
                                                border: '1px solid #333',
                                                borderRadius: 8,
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#00C805"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Active Strategies */}
                    <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 300px', minWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Active Strategies
                            </Typography>
                            {activeStrategies.map((strategy, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        mb: 1,
                                        bgcolor: '#2C2C2E',
                                        borderRadius: 2,
                                        borderLeft: `4px solid ${strategy.color}`,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {strategy.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {strategy.allocation}% allocation
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600, color: strategy.color }}
                                    >
                                        {strategy.return}
                                    </Typography>
                                </Box>
                            ))}
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/strategies')}
                            >
                                View All Strategies
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}
