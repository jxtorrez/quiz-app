import { useEffect, useState } from "react";
import type { Level } from "../types/Level";
import type { Subject } from "../types/Subject";

interface Props {
  subjects: Subject[];
}

export default function LevelManager({ subjects }: Props) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [levelName, setLevelName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("levels");
    if (saved) {
      setLevels(JSON.parse(saved));
    }
  }, []);

  const saveLevels = (newLevels: Level[]) => {
    setLevels(newLevels);
    localStorage.setItem("levels", JSON.stringify(newLevels));
  };

  const handleAdd = () => {
    if (!levelName.trim() || !subjectId) return;
    const newLevel: Level = {
      id: `${subjectId}-${Date.now()}`,
      name: levelName.trim(),
      subjectId,
    };
    saveLevels([...levels, newLevel]);
    setLevelName("");
  };

  const handleDelete = (id: string) => {
    const updated = levels.filter((l) => l.id !== id);
    saveLevels(updated);
  };

  const filteredLevels = levels.filter((l) => l.subjectId === subjectId);

  return (
    <div className="bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Niveles</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nombre del nivel"
          value={levelName}
          onChange={(e) => setLevelName(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Agregar Nivel
        </button>
      </div>

      <ul className="space-y-2">
        {filteredLevels.map((level) => (
          <li
            key={level.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>{level.name}</span>
            <button
              onClick={() => handleDelete(level.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
        {filteredLevels.length === 0 && (
          <p className="text-gray-500">No hay niveles para esta materia.</p>
        )}
      </ul>
    </div>
  );
}
