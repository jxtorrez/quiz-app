import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Subject } from "../types/Subject";
import type { Level } from "../types/Level";
import type { Topic } from "../types/Topic";

export default function PlayerSelect() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [subjectId, setSubjectId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [topicId, setTopicId] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("playerName");
    if (!name) {
      navigate("/");
      return;
    }
    setPlayerName(name);

    const s = localStorage.getItem("subjects");
    const l = localStorage.getItem("levels");
    const t = localStorage.getItem("topics");

    if (s) setSubjects(JSON.parse(s));
    if (l) setLevels(JSON.parse(l));
    if (t) setTopics(JSON.parse(t));
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects]);

  useEffect(() => {
    const filteredLevels = levels.filter((lvl) => lvl.subjectId === subjectId);
    if (filteredLevels.length > 0) {
      setLevelId(filteredLevels[0].id);
    } else {
      setLevelId("");
    }
  }, [subjectId, levels]);

  useEffect(() => {
    const filteredTopics = topics.filter(
      (t) => t.subjectId === subjectId && t.levelId === levelId
    );
    if (filteredTopics.length > 0) {
      setTopicId(filteredTopics[0].id);
    } else {
      setTopicId("");
    }
  }, [levelId, subjectId, topics]);

  const handleStartQuiz = () => {
    if (subjectId && levelId && topicId) {
      navigate("/play/quiz", {
        state: { subjectId, levelId, topicId },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          ¡Hola, {playerName}! 🎮
        </h1>
        <p className="mb-6">Selecciona una materia, nivel y tema para comenzar.</p>

        <div className="space-y-4">
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
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
            className="w-full border px-3 py-2 rounded"
            disabled={!subjectId}
          >
            {levels
              .filter((l) => l.subjectId === subjectId)
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>

          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={!levelId}
          >
            {topics
              .filter((t) => t.subjectId === subjectId && t.levelId === levelId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>

          <button
            onClick={handleStartQuiz}
            disabled={!topicId}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Comenzar Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
