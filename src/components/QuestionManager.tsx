import { useEffect, useState } from "react";
import type { Subject } from "../types/Subject";
import type { Level } from "../types/Level";
import type { Topic } from "../types/Topic";
import type { Question } from "../types/Question";

interface Props {
  subjects: Subject[];
  levels: Level[];
  topics: Topic[];
}

export default function QuestionManager({ subjects, levels, topics }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [levelId, setLevelId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("questions");
    if (saved) setQuestions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const levelsInSubject = levels.filter((l) => l.subjectId === subjectId);
    setLevelId(levelsInSubject[0]?.id || "");
  }, [subjectId, levels]);

  useEffect(() => {
    const topicsInLevel = topics.filter(
      (t) => t.subjectId === subjectId && t.levelId === levelId
    );
    setTopicId(topicsInLevel[0]?.id || "");
  }, [levelId, topics]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const saveQuestions = (q: Question[]) => {
    setQuestions(q);
    localStorage.setItem("questions", JSON.stringify(q));
  };

  const handleAdd = () => {
    if (
      !text.trim() ||
      options.some((opt) => !opt.trim()) ||
      !correctAnswer.trim()
    )
      return;

    const newQuestion: Question = {
      id: `${topicId}-${Date.now()}`,
      subjectId,
      levelId,
      topicId,
      text: text.trim(),
      options,
      correctAnswer,
    };

    saveQuestions([...questions, newQuestion]);
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  const handleDelete = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    saveQuestions(updated);
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.subjectId === subjectId &&
      q.levelId === levelId &&
      q.topicId === topicId
  );

  return (
    <div className="bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Preguntas</h2>

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
          className="border px-3 py-2 rounded"
        >
          {topics
            .filter((t) => t.subjectId === subjectId && t.levelId === levelId)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
      </div>

      <textarea
        placeholder="Escribe la pregunta"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {options.map((opt, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Opción ${index + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
      ))}

      <select
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">Selecciona la respuesta correcta</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <button
        onClick={handleAdd}
        className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
      >
        Agregar Pregunta
      </button>

      <ul className="mt-6 space-y-2">
        {filteredQuestions.map((q) => (
          <li
            key={q.id}
            className="border-b pb-2 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">{q.text}</p>
              <ul className="list-disc ml-5 text-sm text-gray-600">
                {q.options.map((opt, i) => (
                  <li key={i} className={opt === q.correctAnswer ? "font-bold text-green-600" : ""}>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              className="text-red-500 text-sm hover:underline ml-4"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
