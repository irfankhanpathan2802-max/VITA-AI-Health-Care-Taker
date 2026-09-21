// Default to the live production Render backend if VITE_API_URL is undefined or misconfigured
let rawUrl = import.meta.env.VITE_API_URL || 'https://vita-ai-health-care-taker.onrender.com/api';

// Sanitize in case "VITE_API_URL=" was accidentally included in the value
if (typeof rawUrl === 'string' && rawUrl.includes('VITE_API_URL=')) {
  rawUrl = rawUrl.replace(/VITE_API_URL=/g, '');
}

export const BASE_URL = (rawUrl || 'https://vita-ai-health-care-taker.onrender.com/api').trim().replace(/\/+$/, '');

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('vitacare_token');

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;
    const response = await fetch(url, config);

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If server returned an HTML error page (like a 404 or 502)
      throw new Error(`Server returned unexpected response (${response.status}): ${text.slice(0, 100)}`);
    }

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        // Clear token on auth failure
        localStorage.removeItem('vitacare_token');
        localStorage.removeItem('vitacare_user');
      }
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};
