const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint: string, options: any = {}) {
    const token = localStorage.getItem('auth-storage'); // simplified for demo
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${JSON.parse(token).state.token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) throw new Error('API Request Failed');
    return response.json();
}