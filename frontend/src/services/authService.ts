import axios from 'axios';
import { USE_MOCK } from './config';

const API_BASE_URL = 'http://localhost:8081/api/v1';

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    message: string;
}

// Mock user data for testing
const mockUser: AuthResponse = {
    userId: 1,
    username: 'demo_user',
    email: 'demo@tradewise.com',
    firstName: 'Demo',
    lastName: 'User',
    message: 'Success',
};

export const authService = {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                ...mockUser,
                username: data.username,
                email: data.email,
                firstName: data.firstName || 'New',
                lastName: data.lastName || 'User',
                message: 'Registration successful!',
            };
        }
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                ...mockUser,
                username: data.username,
                message: 'Login successful!',
            };
        }
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        return response.data;
    },

    getUser: async (userId: number): Promise<AuthResponse> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return { ...mockUser, userId };
        }
        const response = await axios.get(`${API_BASE_URL}/auth/users/${userId}`);
        return response.data;
    },
};
