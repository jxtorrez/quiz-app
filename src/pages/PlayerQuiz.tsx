import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Question } from "../types/Question";

export default function PlayerQuiz() {
    const navigate = useNavigate();
    const location = useLocation();
    const { subjectId, levelId, topicId } = location.state || {};

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);

    // Cargar preguntas
    useEffect(() => {
        if (!subjectId || !levelId || !topicId) {
            navigate("/");
            return;
        }

        const stored = localStorage.getItem("questions");
        if (stored) {
            const allQuestions: Question[] = JSON.parse(stored);
            const filtered = allQuestions.filter(
                (q) =>
                    q.subjectId === subjectId &&
                    q.levelId === levelId &&
                    q.topicId === topicId
            );
            setQuestions(shuffleArray(filtered));
        }
    }, [subjectId, levelId, topicId, navigate]);

    // Temporizador
    useEffect(() => {
        if (selectedOption) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, selectedOption]);

    // Barajar opciones al cargar pregunta
    useEffect(() => {
        if (questions.length > 0 && currentIndex < questions.length) {
            setSelectedOption(null);
            setTimeLeft(15);
            setShuffledOptions(shuffleArray(questions[currentIndex].options));
        }
    }, [currentIndex, questions]);

    // Guardar resultado cuando termina el juego
    useEffect(() => {
        if (!showResult) return;

        const result = {
            subjectId,
            levelId,
            topicId,
            score,
            total: questions.length,
            date: new Date().toISOString(),
        };

        const stored = localStorage.getItem("results");
        const allResults = stored ? JSON.parse(stored) : [];

        allResults.push(result);
        localStorage.setItem("results", JSON.stringify(allResults));
    }, [showResult, score, questions.length, subjectId, levelId, topicId]);

    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function handleSelect(option: string) {
        if (selectedOption) return;
        setSelectedOption(option);

        const correct = questions[currentIndex].correctAnswer.trim().toLowerCase();
        const chosen = option.trim().toLowerCase();

        if (correct === chosen) {
            setScore((prev) => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setShowResult(true);
            }
        }, 1500);
    }

    function handleTimeout() {
        setSelectedOption("TIEMPO AGOTADO");

        setTimeout(() => {
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setShowResult(true);
            }
        }, 2000);
    }

    if (questions.length === 0)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">No hay preguntas para este tema.</p>
            </div>
        );

    if (showResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-6">
                <h2 className="text-4xl font-bold mb-4 text-green-700">🎉 ¡Juego Terminado!</h2>
                <p className="text-xl mb-6">
                    Obtuviste <strong>{score}</strong> de <strong>{questions.length}</strong> respuestas correctas.{" "}
                    {score >= questions.length / 2 ? "🤩 ¡Buen trabajo!" : "😅 ¡Puedes mejorar!"}
                </p>
                <button
                    onClick={() => navigate("/play/select")}
                    className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Volver a seleccionar tema
                </button>
                <button
                    onClick={() => navigate("/play/results")}
                    className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Ver resultados
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 to-purple-400 p-6">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 transition-all duration-500 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        Pregunta {currentIndex + 1} de {questions.length}
                    </h3>
                    <span className="text-sm font-bold text-red-600 animate-pulse">
                        ⏱ {timeLeft}s
                    </span>
                </div>

                <div className="mb-6 text-xl font-bold text-purple-800">
                    {currentQuestion.text}
                </div>

                <div className="grid gap-4">
                    {shuffledOptions.map((option) => {
                        let baseClasses =
                            "cursor-pointer border-4 rounded-xl py-4 px-6 text-lg font-semibold text-center shadow-md transition-all duration-300 transform";

                        if (!selectedOption) {
                            baseClasses += " bg-white hover:bg-yellow-100 hover:scale-105";
                        } else if (option === currentQuestion.correctAnswer) {
                            baseClasses += " bg-green-500 text-white border-green-600 scale-105";
                        } else if (option === selectedOption) {
                            baseClasses += " bg-red-500 text-white border-red-600 scale-105";
                        } else {
                            baseClasses += " bg-gray-200 text-gray-500 opacity-60";
                        }

                        return (
                            <button
                                key={option}
                                className={baseClasses}
                                onClick={() => handleSelect(option)}
                                disabled={!!selectedOption}
                                aria-pressed={selectedOption === option}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
