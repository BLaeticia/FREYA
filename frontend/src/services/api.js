import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('freya_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('freya_token');
      localStorage.removeItem('freya_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  loginUser: (data) => API.post('/auth/login', data),
  registerPatient: (data) => API.post('/auth/register/patient', data),
  registerDoctor: (data) => API.post('/auth/register/doctor', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
};

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
export const doctorsAPI = {
  search: (params) => API.get('/doctors', { params }),
  getById: (id) => API.get(`/doctors/${id}`),
  getAvailability: (id, date) => API.get(`/doctors/${id}/availability`, { params: { date } }),
  getSpecialites: () => API.get('/doctors/meta/specialites'),
  updateProfile: (data) => API.put('/doctors/profile/update', data),
  setAvailability: (slots) => API.post('/doctors/availability', { slots }),
  getDashboardStats: () => API.get('/doctors/dashboard/stats'),
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
export const appointmentsAPI = {
  book: (data) => API.post('/appointments', data),
  getMyAppointments: (params) => API.get('/appointments/my', { params }),
  getById: (id) => API.get(`/appointments/${id}`),
  updateStatus: (id, status, notes) => API.patch(`/appointments/${id}/status`, { status, notes }),
};

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const messagesAPI = {
  getConversations: () => API.get('/messages/conversations'),
  createConversation: (doctor_id) => API.post('/messages/conversations', { doctor_id }),
  getMessages: (convId) => API.get(`/messages/conversations/${convId}/messages`),
  sendMessage: (convId, content) => API.post(`/messages/conversations/${convId}/messages`, { content }),
};

// ─── MEDICAL RECORDS ──────────────────────────────────────────────────────────
export const recordsAPI = {
  getRecords: (patient_id) => API.get('/records', { params: patient_id ? { patient_id } : {} }),
  addRecord: (data) => API.post('/records', data),
  getProfile: () => API.get('/records/profile'),
  updateProfile: (data) => API.put('/records/profile', data),
};

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  addReview: (data) => API.post('/reviews', data),
  getDoctorReviews: (doctorId) => API.get(`/reviews/doctor/${doctorId}`),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => API.get('/notifications'),
  markAllRead: () => API.patch('/notifications/read-all'),
  markRead: (id) => API.patch(`/notifications/${id}/read`),
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getPendingDoctors: () => API.get('/admin/doctors/pending'),
  approveDoctor: (id, approved, reason) => API.patch(`/admin/doctors/${id}/approve`, { approved, reason }),
  getAllDoctors: (params) => API.get('/admin/doctors', { params }),
  toggleUser: (id) => API.patch(`/admin/users/${id}/toggle`),
  getClinics: () => API.get('/admin/clinics'),
  addClinic: (data) => API.post('/admin/clinics', data),
};

export default API;
