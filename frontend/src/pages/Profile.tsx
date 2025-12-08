import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    AppBar,
    Toolbar,
    Button,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress,
    Divider,
} from '@mui/material';
import {
    Person,
    TrendingUp,
    Assessment,
    Edit,
    Logout,
} from '@mui/icons-material';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            const profileData = localStorage.getItem(`profile_${parsedUser.userId}`);
            if (profileData) {
                setProfile(JSON.parse(profileData));
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getRiskColor = (score: number) => {
        if (score < 30) return '#00C805';
        if (score < 60) return '#FFB800';
        if (score < 80) return '#FF6B00';
        return '#FF0000';
    };

    const getRiskLabel = (tolerance: string) => {
        const labels: Record<string, string> = {
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            very_aggressive: 'Very Aggressive',
            CONSERVATIVE: 'Conservative',
            MODERATE: 'Moderate',
            AGGRESSIVE: 'Aggressive',
            VERY_AGGRESSIVE: 'Very Aggressive',
        };
        return labels[tolerance] || tolerance;
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
                    <Button color="inherit" onClick={() => navigate('/strategies')}>
                        Strategies
                    </Button>
                    <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                    My Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage your account and investment preferences
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {/* Personal Information */}
                    <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 300px', minWidth: 300 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        bgcolor: '#00C805',
                                        fontSize: 40,
                                        mb: 2,
                                    }}
                                >
                                    {user?.firstName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Username
                                    </Typography>
                                    <Typography variant="body2">{user?.username}</Typography>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<Edit />}
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/onboarding')}
                            >
                                Update Profile
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Investment Profile */}
                    {profile ? (
                        <Card sx={{ bgcolor: '#1C1C1E', flex: '2 1 500px', minWidth: 300 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Assessment sx={{ mr: 1, color: '#00C805' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Investment Profile
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Risk Score
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography
                                                variant="h3"
                                                sx={{ fontWeight: 700, color: getRiskColor(profile.riskScore) }}
                                            >
                                                {profile.riskScore}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                                                / 100
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={profile.riskScore}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                width: 200,
                                                bgcolor: '#2C2C2E',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getRiskColor(profile.riskScore),
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Risk Tolerance
                                        </Typography>
                                        <Chip
                                            label={getRiskLabel(profile.riskTolerance)}
                                            sx={{
                                                bgcolor: getRiskColor(profile.riskScore),
                                                color: '#000',
                                                fontWeight: 600,
                                                fontSize: 16,
                                                height: 40,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Age</Typography>
                                        <Typography variant="h6">{profile.assessment?.age}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Investment Amount</Typography>
                                        <Typography variant="h6">${profile.assessment?.investmentAmount?.toLocaleString()}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Time Horizon</Typography>
                                        <Typography variant="h6">{profile.assessment?.timeHorizonYears} years</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Goal</Typography>
                                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                            {profile.assessment?.investmentGoal?.replace('_', ' ').toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Recommended Strategy
                                    </Typography>
                                    <Card sx={{ bgcolor: '#2C2C2E', p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TrendingUp sx={{ fontSize: 40, color: '#00C805', mr: 2 }} />
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {profile.recommendedStrategy}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Matched to your risk profile
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<Edit />}
                                    sx={{
                                        mt: 3,
                                        background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                                        fontWeight: 600,
                                    }}
                                    onClick={() => navigate('/onboarding')}
                                >
                                    Retake Assessment
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card sx={{ bgcolor: '#1C1C1E', flex: '2 1 500px', minWidth: 300 }}>
                            <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                <Assessment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    No Investment Profile
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Complete your risk assessment to get personalized recommendations
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/onboarding')}
                                    sx={{
                                        background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                                        fontWeight: 600,
                                    }}
                                >
                                    Start Assessment
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
