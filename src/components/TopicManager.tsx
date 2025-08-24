import { useEffect, useState } from "react";
import type { Subject } from "../types/Subject";
import type { Level } from "../types/Level";
import type { Topic } from "../types/Topic";

interface Props {
  subjects: Subject[];
  levels: Level[];
}

export default function TopicManager({ subjects, levels }: Props) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [levelId, setLevelId] = useState("");
  const [topicName, setTopicName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("topics");
    if (saved) {
      setTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const levelsInSubject = levels.filter((l) => l.subjectId === subjectId);
    setLevelId(levelsInSubject[0]?.id || "");
  }, [subjectId, levels]);

  const saveTopics = (newTopics: Topic[]) => {
    setTopics(newTopics);
    localStorage.setItem("topics", JSON.stringify(newTopics));
  };

  const handleAdd = () => {
    if (!topicName.trim() || !subjectId || !levelId) return;
    const newTopic: Topic = {
      id: `${subjectId}-${levelId}-${Date.now()}`,
      name: topicName.trim(),
      subjectId,
      levelId,
    };
    saveTopics([...topics, newTopic]);
    setTopicName("");
  };

  const handleDelete = (id: string) => {
    const updated = topics.filter((t) => t.id !== id);
    saveTopics(updated);
  };

  const filteredTopics = topics.filter(
    (t) => t.subjectId === subjectId && t.levelId === levelId
  );

  const levelsForSubject = levels.filter((l) => l.subjectId === subjectId);

  return (
    <div className="bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold text-purple-600 mb-4">Temas</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={levelId}
          onChange={(e) => setLevelId(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {levelsForSubject.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del tema"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Agregar Tema
        </button>
      </div>

      <ul className="space-y-2">
        {filteredTopics.map((topic) => (
          <li
            key={topic.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>{topic.name}</span>
            <button
              onClick={() => handleDelete(topic.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
        {filteredTopics.length === 0 && (
          <p className="text-gray-500">No hay temas para esta combinación.</p>
        )}
      </ul>
    </div>
  );
}
