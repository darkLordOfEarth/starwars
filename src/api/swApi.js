import axios from 'axios';

const API_URL = '/api/proxy';

export const getData = async (endpointOrUrl) => {
  try {
    // Если это полный URL (начинается с http), передаем напрямую в proxy
    const url = endpointOrUrl.startsWith('http')
      ? `${API_URL}?url=${encodeURIComponent(endpointOrUrl)}`
      : `${API_URL}?url=${encodeURIComponent(`https://sw-api.starnavi.io/${endpointOrUrl}`)}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
};
