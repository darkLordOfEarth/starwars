// swApi.js
import axios from "axios";

const PROXY_URL = "/api/proxy";

export const getData = async (endpointOrUrl) => {
  try {
    // Если это полный URL, передаем его напрямую в proxy
    const url = endpointOrUrl.startsWith("http")
      ? `${PROXY_URL}?url=${encodeURIComponent(endpointOrUrl)}`
      : `${PROXY_URL}?url=${encodeURIComponent(`https://sw-api.starnavi.io/${endpointOrUrl}`)}`;

    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
    throw err;
  }
};
