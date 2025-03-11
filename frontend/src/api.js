const API_URL = 'http://localhost:5000/api';

// Function to fetch tasks from the backend
export const fetchTasks = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return await response.json();
};

// Function to add a new task
export const addTask = async (title) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('Failed to add task');
  }

  return await response.json();
};

// Function to update an existing task
export const updateTask = async (id, title) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return await response.json();
};

// Function to delete a task
export const deleteTask = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return await response.json();
};

// Function to login a user
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.token;
};

// Function to register a new user
export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
};
