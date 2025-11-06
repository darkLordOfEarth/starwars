import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

export default function StarWarsFilms() {
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);


  

  // Загружаем список фильмов
  useEffect(() => {
    axios
      .get("https://sw-api.starnavi.io/films/")
      .then((res) => {
        setFilms(res.data.results || []);
      })
      .catch((err) => console.error("Ошибка при загрузке фильмов:", err));
  }, []);

  const handleSelectFilm = (e) => {
    const id = e.target.value;
    if (!id) return;

    axios
      .get(`https://sw-api.starnavi.io/films/${id}/`)
      .then((res) => {
        const film = res.data;
        setSelectedFilm(film);

        // Узлы
        const filmNodes = [
          {
            id: "film",
            type: "input",
            data: { label: film.title },
            position: { x: 250, y: 0 },
          },
          {
            id: "director",
            data: { label: `🎬 Режиссёр: ${film.director}` },
            position: { x: 50, y: 150 },
          },
          {
            id: "producer",
            data: { label: `💰 Продюсер: ${film.producer}` },
            position: { x: 250, y: 150 },
          },
          {
            id: "release",
            data: { label: `📅 Дата выхода: ${film.release_date}` },
            position: { x: 450, y: 150 },
          },
          {
            id: "characters",
            type: "output",
            data: { label: `👥 Персонажи: ${film.characters.length}` },
            position: { x: 250, y: 300 },
          },
        ];

        const filmEdges = [
          { id: "e1", source: "film", target: "director", label: "режиссёр" },
          { id: "e2", source: "film", target: "producer", label: "продюсер" },
          { id: "e3", source: "film", target: "release", label: "дата выхода" },
          { id: "e4", source: "film", target: "characters", label: "в ролях" },
        ];

        setNodes(filmNodes);
        setEdges(filmEdges);
      })
      .catch((err) => console.error("Ошибка при загрузке фильма:", err));
  };


  
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      

      <select
        onChange={handleSelectFilm}
        className="p-2 border rounded"
        style={{
            display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <option value="">Выберите фильм</option>
        {films.map((film, index) => (
          <option key={index + 1} value={index + 1}>
            {film.title}
          </option>
        ))}
      </select>

      {selectedFilm && (
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
              width: "350px",
            }}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
              {selectedFilm.title}
            </h2>
            <p>📅 {selectedFilm.release_date}</p>
            <p>🎬 Режиссёр: {selectedFilm.director}</p>
            <p>💰 Продюсер: {selectedFilm.producer}</p>
            <p>🧾 Эпизод: {selectedFilm.episode_id}</p>
            <p style={{ marginTop: "10px" }}>
              {selectedFilm.opening_crawl.slice(0, 150)}...
            </p>
          </div>

          <div
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #444",
              borderRadius: "10px",
              marginBottom: "50px",
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
