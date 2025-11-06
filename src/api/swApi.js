import axios from 'axios';

export const getData = async (url) => {
  try {
    const response = await axios.get(`/api/proxy?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
};
