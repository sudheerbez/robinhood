import axios from 'axios';

const API_BASE_URL = 'http://100.48.63.47:8081/api/v1';

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

export const authService = {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        return response.data;
    },

    getUser: async (userId: number): Promise<AuthResponse> => {
        const response = await axios.get(`${API_BASE_URL}/auth/users/${userId}`);
        return response.data;
    },
};
