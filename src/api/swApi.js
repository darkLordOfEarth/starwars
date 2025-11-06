import axios from "axios";

const API_URL = "/api";

export const getData = async (endpoint) => {
  try {
    const res = await axios.get(`${API_URL}/${endpoint}`);
    return res.data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    throw error;
  }
};
