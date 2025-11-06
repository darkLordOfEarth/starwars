// api/swApi.js
import axios from "axios";

const fetchData = async (url) => {
  try {
    const res = await axios.get(`/api/proxy?url=${encodeURIComponent(url)}`);
    return res.data;
  } catch (err) {
    console.error("SW API error:", err);
    return null;
  }
};

export const getPeople = (url) => fetchData(url);
export const getFilm = (id) =>
  fetchData(`https://sw-api.starnavi.io/films/${id}/`);
export const getStarship = (id) =>
  fetchData(`https://sw-api.starnavi.io/starships/${id}/`);
