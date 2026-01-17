import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Employee API calls
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (employeeId) => api.get(`/employees/${employeeId}`),
  create: (employeeData) => api.post('/employees', employeeData),
  update: (employeeId, employeeData) => api.put(`/employees/${employeeId}`, employeeData),
  delete: (employeeId) => api.delete(`/employees/${employeeId}`),
};

// Attendance API calls
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  getByEmployee: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  create: (attendanceData) => api.post('/attendance', attendanceData),
  update: (attendanceId, attendanceData) => api.put(`/attendance/${attendanceId}`, attendanceData),
  delete: (attendanceId) => api.delete(`/attendance/${attendanceId}`),
};

export default api;