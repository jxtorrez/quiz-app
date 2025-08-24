import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerStart() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) return;
    localStorage.setItem("playerName", name.trim());
    navigate("/play/select");
  };

  const pressEnter = (evento: any) => {
    if (evento.keyCode===13) {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">¡Bienvenido!</h1>
        <p className="mb-4 text-center">Ingresa tu nombre para comenzar el juego:</p>

        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyUp={(e) => pressEnter(e)}
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <button
          onClick={handleStart}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
