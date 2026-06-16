const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('ecocredit_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// handle fetch responses (including token refresh)
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  if (response.status === 401) {
    const refreshResult = await refreshToken();
    if (refreshResult) {
      // retry with new token
      response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: { ...getHeaders(), ...options.headers },
      });
    } else {
      // refresh failed, user is logged out
      localStorage.removeItem('ecocredit_access_token');
      localStorage.removeItem('ecocredit_refresh_token');
      window.dispatchEvent(new Event('auth_expired'));
      throw new Error('Session expired. Please log in again.');
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }

  return data;
}

// token refresh logic
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const token = localStorage.getItem('ecocredit_refresh_token');
  if (!token) return false;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('ecocredit_access_token', data.accessToken);
        localStorage.setItem('ecocredit_refresh_token', data.refreshToken);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const api = {
  auth: {
    login: (credentials: any) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => fetchWithAuth('/auth/me'),
    logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
  },
  actions: {
    list: (params = '') => fetchWithAuth(`/actions${params}`),
    create: (data: any) => fetchWithAuth('/actions', { method: 'POST', body: JSON.stringify(data) }),
    updateBlockchain: (id: string, hash: string) => fetchWithAuth(`/actions/${id}/blockchain`, { method: 'PATCH', body: JSON.stringify({ blockchainHash: hash }) }),
  },
  listings: {
    list: (params = '') => fetchWithAuth(`/listings${params}`),
    create: (data: any) => fetchWithAuth('/listings', { method: 'POST', body: JSON.stringify(data) }),
  },
  transactions: {
    list: (params = '') => fetchWithAuth(`/transactions${params}`),
    purchase: (data: any) => fetchWithAuth('/transactions/purchase', { method: 'POST', body: JSON.stringify(data) }),
  },
  users: {
    dashboard: () => fetchWithAuth('/users/dashboard'),
    updateWallet: (data: any) => fetchWithAuth('/users/wallet', { method: 'PATCH', body: JSON.stringify(data) }),
  },
};
