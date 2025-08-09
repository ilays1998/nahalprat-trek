// all.js
import config from '../config';

export default { foo: 1, bar: 2 };

const API_BASE_URL = config.API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

export class Booking {
  static async list(sortBy = '-trek_date') {
    try {
      return await apiCall(`/bookings?sort=${sortBy}`);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  }

  static async filter(filters = {}, sortBy = '-trek_date') {
    try {
      const params = new URLSearchParams({ sort: sortBy, ...filters });
      return await apiCall(`/bookings?${params}`);
    } catch (error) {
      console.error('Error filtering bookings:', error);
      return [];
    }
  }

  static async create(bookingData) {
    try {
      return await apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      return await apiCall(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await apiCall(`/bookings/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
}

export class TrekDate {
  static async list(sortBy = '-start_date') {
    try {
      return await apiCall(`/trekdates?sort=${sortBy}`);
    } catch (error) {
      console.error('Error fetching trek dates:', error);
      return [];
    }
  }

  static async filter(filters = {}, sortBy = '-start_date') {
    try {
      const params = new URLSearchParams({ sort: sortBy, ...filters });
      return await apiCall(`/trekdates?${params}`);
    } catch (error) {
      console.error('Error filtering trek dates:', error);
      return [];
    }
  }

  static async create(trekDateData) {
    try {
      return await apiCall('/trekdates', {
        method: 'POST',
        body: JSON.stringify(trekDateData),
      });
    } catch (error) {
      console.error('Error creating trek date:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      return await apiCall(`/trekdates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error('Error updating trek date:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await apiCall(`/trekdates/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting trek date:', error);
      throw error;
    }
  }
}

export class User {
  static async me() {
    try {
      return await apiCall('/auth/me');
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
} 