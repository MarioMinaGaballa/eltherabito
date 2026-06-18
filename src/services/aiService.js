const BASE_URL = 'https://mentalhealth01.runasp.net';

const aiService = {
  async getAIRecommendation(query) {
    const res = await fetch(`${BASE_URL}/AIRecommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
