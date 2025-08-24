import { useState, useEffect } from "react";
import type { Subject } from "../types/Subject";

interface Props {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
}

export default function SubjectManager({ subjects, setSubjects }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    // Si no hay subjects, cargar los iniciales
    if (subjects.length === 0) {
      const saved = localStorage.getItem("subjects");
      if (saved) {
        setSubjects(JSON.parse(saved));
      }
    }
  }, []);

  const handleAdd = () => {
    if (!name.trim()) return;
    const newSubject: Subject = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
    setName("");
  };

  const handleDelete = (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Materias</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre de la materia"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-2">
        {subjects.map((subject) => (
          <li
            key={subject.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>{subject.name}</span>
            <button
              onClick={() => handleDelete(subject.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
