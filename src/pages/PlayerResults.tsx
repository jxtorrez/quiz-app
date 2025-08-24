import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Result = {
  subjectId: string;
  levelId: string;
  topicId: string;
  score: number;
  total: number;
  date: string;
};

export default function PlayerResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("results");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Historial de Resultados</h1>

      {results.length === 0 ? (
        <p className="text-gray-700">No hay resultados aún.</p>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded shadow p-4 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Fecha</th>
                <th className="border-b px-4 py-2">Materia</th>
                <th className="border-b px-4 py-2">Nivel</th>
                <th className="border-b px-4 py-2">Tema</th>
                <th className="border-b px-4 py-2">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ subjectId, levelId, topicId, score, total, date }, idx) => (
                <tr key={idx} className="odd:bg-gray-50">
                  <td className="border-b px-4 py-2">{new Date(date).toLocaleString()}</td>
                  <td className="border-b px-4 py-2">{subjectId}</td>
                  <td className="border-b px-4 py-2">{levelId}</td>
                  <td className="border-b px-4 py-2">{topicId}</td>
                  <td className="border-b px-4 py-2">
                    {score} / {total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => navigate("/play/select")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Volver a seleccionar tema
      </button>
    </div>
  );
}
