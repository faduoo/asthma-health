const API_BASE_URL = 'http://localhost:3001';

// Helper function to handle fetch errors
const handleFetchError = async (response: Response, errorMessage: string) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorDetail = errorMessage;
    try {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorDetail = errorData.message || errorMessage;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    throw new Error(errorDetail);
  }
};

// User management
export const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      await handleFetchError(response, 'Failed to fetch users');
      return response.json();
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.message || 'Failed to connect to database. Make sure JSON server is running on port 3001.');
    }
  },

  getUserById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      await handleFetchError(response, 'Failed to fetch user');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  },

  createUser: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      await handleFetchError(response, 'Failed to create user');
      return response.json();
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.message || 'Failed to create user. Make sure JSON server is running on port 3001.');
    }
  },

  updateUser: async (id: number, userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      await handleFetchError(response, 'Failed to update user');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    }
  },

  deleteUser: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      await handleFetchError(response, 'Failed to delete user');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete user');
    }
  },

  // Authentication
  loginUser: async (phone: string, password: string) => {
    try {
      const users = await userService.getAllUsers();
      const user = users.find((u: any) => u.phone === phone && u.password === password);
      if (!user) throw new Error('Invalid phone number or password');
      return user;
    } catch (error: any) {
      throw error;
    }
  },

  signupUser: async (userData: any) => {
    try {
      return await userService.createUser({
        ...userData,
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw error;
    }
  },
};

// Daily logs management
export const logsService = {
  getAllLogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs`);
      await handleFetchError(response, 'Failed to fetch logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch logs');
    }
  },

  getLogsByUserId: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user logs');
    }
  },

  getLogById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs/${id}`);
      await handleFetchError(response, 'Failed to fetch log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch log');
    }
  },

  createLog: async (logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to create log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create log');
    }
  },

  updateLog: async (id: number, logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to update log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update log');
    }
  },

  deleteLog: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs/${id}`, {
        method: 'DELETE',
      });
      await handleFetchError(response, 'Failed to delete log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete log');
    }
  },
};

// Alerts management
export const alertsService = {
  getAllAlerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      await handleFetchError(response, 'Failed to fetch alerts');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch alerts');
    }
  },

  getAlertsByUserId: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user alerts');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user alerts');
    }
  },

  getAlertById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`);
      await handleFetchError(response, 'Failed to fetch alert');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch alert');
    }
  },

  createAlert: async (alertData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
      await handleFetchError(response, 'Failed to create alert');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create alert');
    }
  },

  updateAlert: async (id: number, alertData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
      await handleFetchError(response, 'Failed to update alert');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update alert');
    }
  },

  deleteAlert: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: 'DELETE',
      });
      await handleFetchError(response, 'Failed to delete alert');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete alert');
    }
  },
};
