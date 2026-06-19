import { BASE_URL, getAuthHeaders } from './apiConfig';

const aiService = {
  async getAIRecommendation(query) {
    const res = await fetch(`${BASE_URL}/AIRecommendation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Backend error: Failed to get AI recommendation');
    }

    return res.json();
  },
};

export default aiService;
