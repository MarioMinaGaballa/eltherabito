const BASE_URL = 'https://mentalhealth01.runasp.net/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('eltherabito-token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const bookingService = {
  async getDoctors() {
    const res = await fetch(`${BASE_URL}/Doctors`, {
      method: 'GET',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctor slots');
    }

    return res.json();
  },

  async getDoctorProfile() {
    const res = await fetch(`${BASE_URL}/Doctor/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctor profile');
    }

    return res.json();
  },

  async getDoctorSchedules() {
    const res = await fetch(`${BASE_URL}/Doctor/me/schedules`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch doctor schedules');
    }

    return res.json();
  },

  async updateDoctorProfile(formData) {
    const payload = new FormData();
    payload.append('Specialty', formData.specialty);
    payload.append('YearsOfExp', formData.yearsOfExp);
    payload.append('SessionPrice', formData.sessionPrice);
    if (formData.imageFile) {
      payload.append('ProfilePicture', formData.imageFile);
    }

    const res = await fetch(`${BASE_URL}/Doctor/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to update doctor profile');
    }

    return res.json();
  },

  async deleteScheduleSlot(slotId) {
    const res = await fetch(`${BASE_URL}/DoctorSchedule/${slotId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to delete schedule slot');
    }

    return res.json();
  },

  async changeDayStatus(dayOfWeek, isActive) {
    const payload = {
      dayOfWeek,
      isActive,
    };

    const res = await fetch(`${BASE_URL}/DoctorSchedule/schedule/day-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to change day status');
    }

    return res.json();
  },

  async addScheduleSlot(dayOfWeek, startTime, endTime) {
    const payload = {
      dayOfWeek,
      startTime,
      endTime,
    };

    const res = await fetch(`${BASE_URL}/DoctorSchedule/AddSlot`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(assessmentData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to predict assessment');
    }

    return res.json();
  },

  async getAppointments() {
    const res = await fetch(`${BASE_URL}/appointments/BooKing`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to fetch appointments');
    }

    return res.json();
  },
};

export default bookingService;
