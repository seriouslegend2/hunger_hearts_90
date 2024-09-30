import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9500',  // Your backend base URL
  withCredentials: true              // Include cookies (for JWT tokens)
});

export const loginUser = (email, password) => {
  return api.post('/auth/userLogin', { email, password });
};

export const signupUser = (formData) => {
  return api.post('/auth/userSignup', formData);
};

export const logoutUser = () => {
  return api.get('/auth/u_logout');
};
