// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     (import.meta.env.DEV ? 'http://localhost:10000' : '/api');

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

  getUserById: async (id: string | number) => {
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

  updateUser: async (id: string | number, userData: any) => {
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

  deleteUser: async (id: string | number) => {
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

  getLogsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailyLogs?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user logs');
    }
  },

  getLogById: async (id: string | number) => {
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

  updateLog: async (id: string | number, logData: any) => {
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

  deleteLog: async (id: string | number) => {
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

  getAlertsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user alerts');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user alerts');
    }
  },

  getAlertById: async (id: string | number) => {
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

  updateAlert: async (id: string | number, alertData: any) => {
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

  deleteAlert: async (id: string | number) => {
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

// Inhalers management
export const inhalersService = {
  getAllInhalers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inhalers`);
      await handleFetchError(response, 'Failed to fetch inhalers');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch inhalers');
    }
  },

  getInhalersByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inhalers?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user inhalers');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user inhalers');
    }
  },

  getInhalerById: async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inhalers/${id}`);
      await handleFetchError(response, 'Failed to fetch inhaler');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch inhaler');
    }
  },

  createInhaler: async (inhalerData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inhalers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inhalerData),
      });
      await handleFetchError(response, 'Failed to create inhaler');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create inhaler');
    }
  },

  updateInhaler: async (id: string | number, inhalerData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inhalers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inhalerData),
      });
      await handleFetchError(response, 'Failed to update inhaler');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update inhaler');
    }
  },

  deleteInhaler: async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inhalers/${id}`, {
        method: 'DELETE',
      });
      await handleFetchError(response, 'Failed to delete inhaler');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete inhaler');
    }
  },
};

// Medication logs management
export const medicationLogsService = {
  getAllLogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicationLogs`);
      await handleFetchError(response, 'Failed to fetch medication logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch medication logs');
    }
  },

  getLogsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicationLogs?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user medication logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user medication logs');
    }
  },

  createLog: async (logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicationLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to create medication log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create medication log');
    }
  },
};

// Refill requests management
export const refillRequestsService = {
  getAllRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/refillRequests`);
      await handleFetchError(response, 'Failed to fetch refill requests');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch refill requests');
    }
  },

  getRequestsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/refillRequests?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user refill requests');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user refill requests');
    }
  },

  createRequest: async (requestData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/refillRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      await handleFetchError(response, 'Failed to create refill request');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create refill request');
    }
  },

  updateRequest: async (id: string | number, requestData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/refillRequests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      await handleFetchError(response, 'Failed to update refill request');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update refill request');
    }
  },
};

// Messages management
export const messagesService = {
  getAllMessages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`);
      await handleFetchError(response, 'Failed to fetch messages');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch messages');
    }
  },

  getMessagesByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user messages');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user messages');
    }
  },

  createMessage: async (messageData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      await handleFetchError(response, 'Failed to create message');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create message');
    }
  },

  updateMessage: async (id: string | number, messageData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      await handleFetchError(response, 'Failed to update message');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update message');
    }
  },
};

// Quick logs management
export const quickLogsService = {
  getAllLogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quickLogs`);
      await handleFetchError(response, 'Failed to fetch quick logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch quick logs');
    }
  },

  getLogsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quickLogs?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user quick logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user quick logs');
    }
  },

  createLog: async (logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quickLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to create quick log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create quick log');
    }
  },

  updateLog: async (id: string | number, logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quickLogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to update quick log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update quick log');
    }
  },
};

// ACT Results management
export const actResultsService = {
  getAllResults: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/actResults`);
      await handleFetchError(response, 'Failed to fetch ACT results');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch ACT results');
    }
  },

  getResultsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/actResults?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user ACT results');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user ACT results');
    }
  },

  createResult: async (resultData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/actResults`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
      await handleFetchError(response, 'Failed to create ACT result');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create ACT result');
    }
  },
};

// Daily symptoms log management
export const dailySymptomsService = {
  getAllLogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailySymptomsLog`);
      await handleFetchError(response, 'Failed to fetch daily symptoms logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch daily symptoms logs');
    }
  },

  getLogsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailySymptomsLog?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user daily symptoms logs');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user daily symptoms logs');
    }
  },

  getLogByDate: async (userId: string | number, date: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailySymptomsLog?userId=${userId}&date=${date}`);
      await handleFetchError(response, 'Failed to fetch daily symptoms log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch daily symptoms log');
    }
  },

  createLog: async (logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailySymptomsLog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to create daily symptoms log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create daily symptoms log');
    }
  },

  updateLog: async (id: string | number, logData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dailySymptomsLog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      await handleFetchError(response, 'Failed to update daily symptoms log');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update daily symptoms log');
    }
  },
};

// Exercise sessions management
export const exerciseSessionsService = {
  getAllSessions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/exerciseSessions`);
      await handleFetchError(response, 'Failed to fetch exercise sessions');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch exercise sessions');
    }
  },

  getSessionsByUserId: async (userId: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exerciseSessions?userId=${userId}`);
      await handleFetchError(response, 'Failed to fetch user exercise sessions');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user exercise sessions');
    }
  },

  createSession: async (sessionData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exerciseSessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      await handleFetchError(response, 'Failed to create exercise session');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create exercise session');
    }
  },
};
