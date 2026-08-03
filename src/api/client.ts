const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        let errorMessage = `HTTP Error Status: ${response.status}`
        try {
            const errorData = await response.json()
            if (errorData.detail) {
                errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : JSON.stringify(errorData.detail);
            }
        } catch {
            // Fallback if response isn't JSON
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {} as T
    }

    return response.json();
}