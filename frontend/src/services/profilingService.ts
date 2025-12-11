import axios from 'axios';
import { USE_MOCK } from './config';

const API_BASE_URL = 'http://localhost:8082/api/v1/profiling';

interface QuickRiskAssessment {
    age: number;
    investmentAmount: number;
    investmentGoal: string;
    timeHorizonYears: number;
    lossTolerance: number;
    investmentKnowledge: number;
}

interface QuickAssessmentResponse {
    riskScore: number;
    riskTolerance: string;
    recommendedStrategy: string;
    assessment: QuickRiskAssessment;
}

interface StrategyRecommendation {
    strategyName: string;
    strategyType: string;
    expectedReturn: number;
    volatility: number;
    stockAllocation: number;
    bondAllocation: number;
    alternativeAllocation: number;
    cashAllocation: number;
    reasoning: string;
    riskMatchScore: number;
}

// Mock risk calculation based on user inputs
function calculateMockRiskScore(data: QuickRiskAssessment): number {
    const ageScore = Math.max(0, 100 - data.age);
    const lossScore = data.lossTolerance * 10;
    const knowledgeScore = data.investmentKnowledge * 10;
    const horizonScore = Math.min(data.timeHorizonYears * 3, 50);

    return Math.round((ageScore + lossScore + knowledgeScore + horizonScore) / 4);
}

function getRiskTolerance(score: number): string {
    if (score < 30) return 'CONSERVATIVE';
    if (score < 50) return 'MODERATE';
    if (score < 70) return 'AGGRESSIVE';
    return 'VERY_AGGRESSIVE';
}

function getRecommendedStrategy(tolerance: string): string {
    const strategies: Record<string, string> = {
        'CONSERVATIVE': 'Balanced Income',
        'MODERATE': 'Balanced Growth',
        'AGGRESSIVE': 'Growth Focus',
        'VERY_AGGRESSIVE': 'Aggressive Growth',
    };
    return strategies[tolerance] || 'Balanced Growth';
}

export const profilingService = {
    quickAssessment: async (data: QuickRiskAssessment): Promise<QuickAssessmentResponse> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 800));
            const riskScore = calculateMockRiskScore(data);
            const riskTolerance = getRiskTolerance(riskScore);
            return {
                riskScore,
                riskTolerance,
                recommendedStrategy: getRecommendedStrategy(riskTolerance),
                assessment: data,
            };
        }
        const response = await axios.post(`${API_BASE_URL}/quick-assessment`, data);
        return response.data;
    },

    getRecommendations: async (riskScore: number): Promise<StrategyRecommendation[]> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [
                {
                    strategyName: 'Balanced Growth',
                    strategyType: 'MODERATE',
                    expectedReturn: 8.5,
                    volatility: 12,
                    stockAllocation: 60,
                    bondAllocation: 30,
                    alternativeAllocation: 5,
                    cashAllocation: 5,
                    reasoning: 'Balanced approach for moderate risk tolerance',
                    riskMatchScore: riskScore,
                },
            ];
        }
        const response = await axios.get(`${API_BASE_URL}/recommendations?riskScore=${riskScore}`);
        return response.data;
    },

    getRiskToleranceOptions: async () => {
        if (USE_MOCK) {
            return ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY_AGGRESSIVE'];
        }
        const response = await axios.get(`${API_BASE_URL}/enums/risk-tolerance`);
        return response.data;
    },

    getInvestmentGoals: async () => {
        if (USE_MOCK) {
            return ['RETIREMENT', 'WEALTH_BUILDING', 'INCOME_GENERATION', 'CAPITAL_PRESERVATION', 'EDUCATION', 'HOME_PURCHASE'];
        }
        const response = await axios.get(`${API_BASE_URL}/enums/investment-goals`);
        return response.data;
    },
};

