import { useEffect, useState } from "react";
import SubjectManager from "../components/SubjectManager";
import LevelManager from "../components/LevelManager";
import TopicManager from "../components/TopicManager";
import QuestionManager from "../components/QuestionManager";

import type { Subject } from "../types/Subject";
import type { Level } from "../types/Level";
import type { Topic } from "../types/Topic";

export default function AdminPanel() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    const savedLevels = localStorage.getItem("levels");
    const savedTopics = localStorage.getItem("topics");

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedLevels) setLevels(JSON.parse(savedLevels));
    if (savedTopics) setTopics(JSON.parse(savedTopics));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600">Área Administrativa</h1>
      <p className="text-gray-600 mt-2">Gestión completa del contenido del juego.</p>

      <SubjectManager subjects={subjects} setSubjects={setSubjects} />
      {subjects.length > 0 && <LevelManager subjects={subjects} />}
      {subjects.length > 0 && levels.length > 0 && (
        <TopicManager subjects={subjects} levels={levels} />
      )}
      {subjects.length > 0 && levels.length > 0 && topics.length > 0 && (
        <QuestionManager
          subjects={subjects}
          levels={levels}
          topics={topics}
        />
      )}
    </div>
  );
}
