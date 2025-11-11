const API_BASE_URL = "http://localhost:4000";

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },

  // Account endpoints
  getAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      credentials: "include",
    });
    return response.json();
  },

  updateAccountLabel: async (data) => {
    const response = await fetch(`${API_BASE_URL}/update-name`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accName: data.label }),
    });
    return response.json();
  },

  // Transaction endpoints
  getTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      credentials: "include",
    });
    return response.json();
  },

  deposit: async (data) => {
    const response = await fetch(`${API_BASE_URL}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  withdraw: async (data) => {
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  transferInternal: async (data) => {
    const response = await fetch(`${API_BASE_URL}/transfer/internal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  transferExternal: async (data) => {
    const response = await fetch(`${API_BASE_URL}/transfer/external`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/summary`, {
      credentials: "include",
    });
    return response.json();
  },
};
