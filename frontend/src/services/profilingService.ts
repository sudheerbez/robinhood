import axios from 'axios';

const API_BASE_URL = 'http://100.48.63.47:8082/api/v1/profiling';

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

export const profilingService = {
    quickAssessment: async (data: QuickRiskAssessment): Promise<QuickAssessmentResponse> => {
        const response = await axios.post(`${API_BASE_URL}/quick-assessment`, data);
        return response.data;
    },

    getRecommendations: async (riskScore: number): Promise<StrategyRecommendation[]> => {
        const response = await axios.get(`${API_BASE_URL}/recommendations?riskScore=${riskScore}`);
        return response.data;
    },

    getRiskToleranceOptions: async () => {
        const response = await axios.get(`${API_BASE_URL}/enums/risk-tolerance`);
        return response.data;
    },

    getInvestmentGoals: async () => {
        const response = await axios.get(`${API_BASE_URL}/enums/investment-goals`);
        return response.data;
    },
};
