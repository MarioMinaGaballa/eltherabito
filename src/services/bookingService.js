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

  async deleteScheduleSlot(slotId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/DoctorSchedule/${slotId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to delete schedule slot');
    }

    return res.json();
  },

  async changeDayStatus(dayOfWeek, isActive) {
    const token = localStorage.getItem('token');
    const payload = {
      dayOfWeek,
      isActive,
    };

    const res = await fetch(`${BASE_URL}/DoctorSchedule/schedule/day-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to change day status');
    }

    return res.json();
  },

  async addScheduleSlot(dayOfWeek, startTime, endTime) {
    const token = localStorage.getItem('token');
    const payload = {
      dayOfWeek,
      startTime,
      endTime,
    };

    const res = await fetch(`${BASE_URL}/DoctorSchedule/AddSlot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to add schedule slot');
    }

    return res.json();
  },

  async bookAppointment(bookingData) {
    const res = await fetch(`${BASE_URL}/appointments/BookAppoinment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to book appointment');
    }

    return res.json();
  },

  async predictAssessment(assessmentData) {
    const res = await fetch(`${BASE_URL}/Assessment/Predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to predict assessment');
    }

    return res.json();
  },

  async getAppointments() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/appointments/BooKing`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch appointments');
    }

    return res.json();
  },
};

export default bookingService;
