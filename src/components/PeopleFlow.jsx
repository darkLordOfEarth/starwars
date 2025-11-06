import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import fallbackImage from "../assets/images/logo.png";

export default function PeopleFlow() {
  const START_URL = "https://sw-api.starnavi.io/people/";

  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загрузка персонажей (с пагинацией)
  const loadCharacters = async (url = START_URL) => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setCharacters(res.data.results || []);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      console.error("Ошибка при загрузке персонажей:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleSelectCharacter = async (e) => {
    const url = e.target.value;
    if (!url) return;

    try {
      const res = await axios.get(url);
      const character = res.data;
      setSelectedCharacter(character);

      // Загружаем фильмы
      const films = await Promise.all(
        (character.films || []).map((fid) =>
          axios.get(`https://sw-api.starnavi.io/films/${fid}/`).then(r => r.data)
        )
      );

      // Загружаем корабли
      const starships = await Promise.all(
        (character.starships || []).map((sid) =>
          axios.get(`https://sw-api.starnavi.io/starships/${sid}/`).then(r => r.data)
        )
      );

      const baseNode = [
        { id: "hero", type: "input", data: { label: `🧑 ${character.name}` }, position: { x: 400, y: 0 } }
      ];

      const filmNodes = films.map((f, i) => ({
        id: `film-${f.episode_id || i}`,
        data: { label: `🎬 ${f.title}` },
        position: { x: 100 + i * 250, y: 200 }
      }));

      const shipNodes = starships.map((s, i) => ({
        id: `ship-${s.id || i}`,
        data: { label: `🚀 ${s.name}` },
        position: { x: 100 + (i % 5) * 250, y: 400 + Math.floor(i / 5) * 120 }
      }));

      const filmEdges = films.map((f) => ({
        id: `edge-hero-film-${f.episode_id}`,
        source: "hero",
        target: `film-${f.episode_id}`,
        label: "участвует в фильме"
      }));

      const shipEdges = [];
      films.forEach((f) => {
        starships.forEach((s, j) => {
          shipEdges.push({
            id: `edge-film-${f.episode_id}-ship-${s.id || j}`,
            source: `film-${f.episode_id}`,
            target: `ship-${s.id || j}`,
            label: "подорожував на кораблі"
          });
        });
      });

      setNodes([...baseNode, ...filmNodes, ...shipNodes]);
      setEdges([...filmEdges, ...shipEdges]);
    } catch (err) {
      console.error("Ошибка при загрузке персонажа:", err);
    }
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h2>🌌 Персонажі Star Wars</h2>

      {/* Пагинация */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => prevPage && loadCharacters(prevPage)} disabled={!prevPage || loading}>
          ⬅ Попередня
        </button>
        <button
          onClick={() => nextPage && loadCharacters(nextPage)}
          disabled={!nextPage || loading}
          style={{ marginLeft: "10px" }}
        >
          Наступна ➡
        </button>
      </div>

      {/* Список персонажей */}
      <select
        onChange={handleSelectCharacter}
        size="10"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto 20px auto",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">Выберите персонажа</option>
        {characters.map((char) => (
          <option key={char.url} value={char.url}>
            {char.name}
          </option>
        ))}
      </select>

      {/* Детали персонажа */}
      {selectedCharacter && (
        <>
          <div style={{ background: "#111", color: "#fff", display: "inline-block", padding: "20px", borderRadius: "12px", boxShadow: "0 0 15px rgba(255,255,255,0.2)", marginBottom: "40px" }}>
            <h2>{selectedCharacter.name}</h2>
            <img src={fallbackImage} alt={selectedCharacter.name} style={{ width: "180px", borderRadius: "10px", marginBottom: "10px" }} />
            <p>Стать: {selectedCharacter.gender || "невідомо"}</p>
            <p>Зріст: {selectedCharacter.height || "?"} см</p>
            <p>Вага: {selectedCharacter.mass || "?"} кг</p>
          </div>

          <div style={{ width: "100%", height: "600px", border: "1px solid #444", borderRadius: "10px" }}>
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
