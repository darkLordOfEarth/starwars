import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import fallbackImage from "../assets/images/logo.png";

export default function StarWarsDashboard() {
  const START_URL = "https://sw-api.starnavi.io/people/";
const [characters, setCharacters] = useState([]);
const [nextPage, setNextPage] = useState(null);
const [prevPage, setPrevPage] = useState(null);
const [selectedCharacter, setSelectedCharacter] = useState(null);
const [nodes, setNodes] = useState([]);
const [edges, setEdges] = useState([]);
const [loading, setLoading] = useState(false);

const loadCharacters = async (url = START_URL) => {
  setLoading(true);
  try {
    const res = await axios.get(url);
    setCharacters(res.data.results);
    setNextPage(res.data.next);
    setPrevPage(res.data.previous);
  } catch (err) {
    console.error("Ошибка загрузки персонажей:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadCharacters();
}, []);


  // 📊 При выборе персонажа
  const handleSelectChange = async (e) => {
  const url = e.target.value;
  if (!url) return;

  try {
    const res = await axios.get(url);
    const character = res.data;
    setSelectedCharacter(character);

    // 🔹 Загрузка фильмов
    const filmRequests = await Promise.all(
      (character.films || []).map((filmId) =>
        axios.get(`https://sw-api.starnavi.io/films/${filmId}/`)
      )
    );
    const films = filmRequests.map((r) => r.data);

    // 🔹 Загрузка кораблей
    const shipRequests = await Promise.all(
      (character.starships || []).map((shipId) =>
        axios.get(`https://sw-api.starnavi.io/starships/${shipId}/`)
      )
    );
    const starships = shipRequests.map((r) => r.data);

    // остальной код без изменений...


      // 📍 Базовый узел героя
      const baseNode = [
        {
          id: "hero",
          type: "input",
          data: { label: `🧑 ${character.name}` },
          position: { x: 400, y: 0 },
        },
      ];

      // 📍 Узлы фильмов
      const filmNodes = films.map((film, i) => ({
        id: `film-${film.episode_id || film.id || i}`,
        data: { label: `🎬 ${film.title}` },
        position: { x: 100 + i * 250, y: 200 },
      }));

      // 📍 Узлы кораблей
      const shipNodes = starships.map((ship, i) => ({
        id: `ship-${ship.id || i}`,
        data: { label: `🚀 ${ship.name}` },
        position: { x: 100 + (i % 5) * 250, y: 400 + Math.floor(i / 5) * 120 },
      }));

      // 🕸 Связи: герой → фильм
      const filmEdges = films.map((film) => ({
        id: `edge-hero-film-${film.episode_id || film.id}`,
        source: "hero",
        target: `film-${film.episode_id || film.id}`,
        label: "участвует в фильме",
      }));

      // 🕸 Связи: фильм → корабль (если у героя есть корабли)
      const shipEdges = [];

      if (starships.length > 0) {
        films.forEach((film, i) => {
          const filmId = film.episode_id || film.id || i;
          starships.forEach((ship, j) => {
            shipEdges.push({
              id: `edge-film-${filmId}-ship-${ship.id || j}`,
              source: `film-${filmId}`,
              target: `ship-${ship.id || j}`,
              label: "подорожував на кораблі",
            });
          });
        });
      }

      setNodes([...baseNode, ...filmNodes, ...shipNodes]);
      setEdges([...filmEdges, ...shipEdges]);
    } catch (err) {
      console.error("Ошибка загрузки персонажа:", err);
    }
  };

  // 📍 Пагинация
  const handleNext = () => nextPage && loadCharacters(nextPage);
  const handlePrev = () => prevPage && loadCharacters(prevPage);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h2>🌌 Персонажі Star Wars</h2>

      {/* Пагинация */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handlePrev} disabled={!prevPage || loading}>
          ⬅ Попередня
        </button>
        <button
          onClick={handleNext}
          disabled={!nextPage || loading}
          style={{ marginLeft: "10px" }}
        >
          Наступна ➡
        </button>
      </div>

      {/* Список персонажей */}
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <select
          onChange={handleSelectChange}
          size="10"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Оберіть персонажа</option>
          {characters.map((char) => (
            <option key={char.url} value={char.url}>
              {char.name}
            </option>
          ))}
        </select>
        {loading && <p style={{ color: "#888" }}>Завантаження...</p>}
      </div>

      {/* Деталі персонажа */}
      {selectedCharacter && (
        <>
          <div
            style={{
              background: "#111",
              color: "#fff",
              display: "inline-block",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(255,255,255,0.2)",
              marginBottom: "40px",
            }}
          >
            <h2>{selectedCharacter.name}</h2>
            <img
              src={fallbackImage}
              alt={selectedCharacter.name}
              style={{
                width: "180px",
                height: "auto",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <p>Стать: {selectedCharacter.gender || "невідомо"}</p>
            <p>Зріст: {selectedCharacter.height || "?"} см</p>
            <p>Вага: {selectedCharacter.mass || "?"} кг</p>
          </div>

          {/* Діаграма */}
          <div
            style={{
              width: "100%",
              height: "600px",
              border: "1px solid #444",
              borderRadius: "10px",
            }}
          >
            <ReactFlow nodes={nodes} edges={edges}>
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </>
      )}
    </div>
  );
}
