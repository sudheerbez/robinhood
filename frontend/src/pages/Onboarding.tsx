import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Alert,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { TrendingUp, CheckCircle } from '@mui/icons-material';
import { profilingService } from '../services/profilingService';

const steps = ['Basic Info', 'Financial Goals', 'Risk Assessment', 'Results'];

const investmentGoals = [
    { value: 'RETIREMENT', label: 'Retirement' },
    { value: 'WEALTH_BUILDING', label: 'Wealth Building' },
    { value: 'INCOME_GENERATION', label: 'Income Generation' },
    { value: 'CAPITAL_PRESERVATION', label: 'Capital Preservation' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'HOME_PURCHASE', label: 'Home Purchase' },
];

interface QuickAssessment {
    age: number;
    investmentAmount: number;
    investmentGoal: string;
    timeHorizonYears: number;
    lossTolerance: number;
    investmentKnowledge: number;
}

interface AssessmentResult {
    riskScore: number;
    riskTolerance: string;
    recommendedStrategy: string;
    assessment: QuickAssessment;
}

export default function Onboarding() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [results, setResults] = useState<AssessmentResult | null>(null);

    const [formData, setFormData] = useState<QuickAssessment>({
        age: 30,
        investmentAmount: 10000,
        investmentGoal: 'RETIREMENT',
        timeHorizonYears: 10,
        lossTolerance: 5,
        investmentKnowledge: 5,
    });

    const handleNext = async () => {
        if (activeStep === steps.length - 2) {
            try {
                setError('');
                const response = await profilingService.quickAssessment(formData);
                setResults(response);

                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.userId) {
                    localStorage.setItem(`profile_${user.userId}`, JSON.stringify(response));
                }

                setActiveStep(activeStep + 1);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Assessment failed. Please try again.');
            }
        } else if (activeStep === steps.length - 1) {
            navigate('/dashboard');
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
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

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Tell us about yourself
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <TextField
                                label="Your Age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                                InputProps={{ inputProps: { min: 18, max: 100 } }}
                                sx={{ flex: '1 1 200px' }}
                            />
                            <TextField
                                label="Initial Investment Amount ($)"
                                type="number"
                                value={formData.investmentAmount}
                                onChange={(e) => setFormData({ ...formData, investmentAmount: parseFloat(e.target.value) || 0 })}
                                InputProps={{ inputProps: { min: 0 } }}
                                sx={{ flex: '1 1 200px' }}
                            />
                        </Box>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            What are your financial goals?
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Primary Investment Goal</InputLabel>
                            <Select
                                value={formData.investmentGoal}
                                label="Primary Investment Goal"
                                onChange={(e) => setFormData({ ...formData, investmentGoal: e.target.value })}
                            >
                                {investmentGoals.map((goal) => (
                                    <MenuItem key={goal.value} value={goal.value}>
                                        {goal.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography gutterBottom>Investment Time Horizon: {formData.timeHorizonYears} years</Typography>
                        <Slider
                            value={formData.timeHorizonYears}
                            onChange={(_, value) => setFormData({ ...formData, timeHorizonYears: value as number })}
                            min={1}
                            max={50}
                            marks={[
                                { value: 1, label: '1yr' },
                                { value: 10, label: '10yr' },
                                { value: 25, label: '25yr' },
                                { value: 50, label: '50yr' },
                            ]}
                            sx={{ color: '#00C805' }}
                        />
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Assess your risk tolerance
                        </Typography>
                        <Box sx={{ mb: 4 }}>
                            <Typography gutterBottom>
                                Loss Tolerance: {formData.lossTolerance}/10
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                How comfortable are you with potential losses?
                            </Typography>
                            <Slider
                                value={formData.lossTolerance}
                                onChange={(_, value) => setFormData({ ...formData, lossTolerance: value as number })}
                                min={1}
                                max={10}
                                marks
                                sx={{ color: '#00C805' }}
                            />
                        </Box>
                        <Box>
                            <Typography gutterBottom>
                                Investment Knowledge: {formData.investmentKnowledge}/10
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                How would you rate your investment experience?
                            </Typography>
                            <Slider
                                value={formData.investmentKnowledge}
                                onChange={(_, value) => setFormData({ ...formData, investmentKnowledge: value as number })}
                                min={1}
                                max={10}
                                marks
                                sx={{ color: '#00C805' }}
                            />
                        </Box>
                    </Box>
                );

            case 3:
                return results ? (
                    <Box>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <CheckCircle sx={{ fontSize: 80, color: '#00C805', mb: 2 }} />
                            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                                Your Profile is Complete!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Here's what we recommend based on your assessment
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                            <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 200px' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Your Risk Score
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h2" sx={{ fontWeight: 700, color: getRiskColor(results.riskScore) }}>
                                            {results.riskScore}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                                            / 100
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={getRiskLabel(results.riskTolerance)}
                                        sx={{
                                            bgcolor: getRiskColor(results.riskScore),
                                            color: '#000',
                                            fontWeight: 600,
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card sx={{ bgcolor: '#1C1C1E', flex: '1 1 200px' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Recommended Strategy
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <TrendingUp sx={{ fontSize: 40, color: '#00C805', mr: 2 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                            {results.recommendedStrategy}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Matched to your risk profile
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Card sx={{ bgcolor: '#1C1C1E' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Your Assessment Summary
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Age</Typography>
                                        <Typography variant="body1">{results.assessment.age} years</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Investment Amount</Typography>
                                        <Typography variant="body1">${results.assessment.investmentAmount.toLocaleString()}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Time Horizon</Typography>
                                        <Typography variant="body1">{results.assessment.timeHorizonYears} years</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Goal</Typography>
                                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                            {results.assessment.investmentGoal.replace('_', ' ').toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">
                <Typography variant="h3" align="center" sx={{ mb: 1, fontWeight: 700 }}>
                    Investment Profile
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Let's build your personalized investment strategy
                </Typography>

                <Paper sx={{ p: 4, bgcolor: '#1C1C1E' }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {renderStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                background: 'linear-gradient(45deg, #00C805 30%, #00FF00 90%)',
                                fontWeight: 600,
                            }}
                        >
                            {activeStep === steps.length - 1 ? 'Go to Dashboard' : 'Next'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
