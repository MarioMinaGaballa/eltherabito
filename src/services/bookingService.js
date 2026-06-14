const BASE_URL = 'https://localhost:7171/api';

const bookingService = {
  async getDoctors() {
    const res = await fetch(`${BASE_URL}/Doctors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctors');
    }

    return res.json();
  },

  async getDoctorSlots(doctorId, date) {
    const res = await fetch(`${BASE_URL}/Doctors/${doctorId}/slots?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctor slots');
    }

    return res.json();
  },

  async getDoctorProfile() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/Doctor/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctor profile');
    }

    return res.json();
  },

  async getDoctorSchedules() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/Doctor/me/schedules`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctor schedules');
    }

    return res.json();
  },

  async updateDoctorProfile(formData) {
    const token = localStorage.getItem('token');
    const payload = new FormData();
    payload.append('Specialty', formData.specialty);
    payload.append('YearsOfExp', formData.yearsOfExp);
    payload.append('SessionPrice', formData.sessionPrice);
    if (formData.profilePicture) {
      payload.append('ProfilePicture', formData.profilePicture);
    }

    const res = await fetch(`${BASE_URL}/Doctor/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to update doctor profile');
    }

    return res.json();
  },
};

export default bookingService;
