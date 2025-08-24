import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import PlayerSelect from "./pages/PlayerSelect";
import PlayerQuiz from "./pages/PlayerQuiz";
import PlayerStart from "./pages/PlayerStart";
import PlayerResults from "./pages/PlayerResults";
import { subjects, levels, topics, questions } from "./data/initialData";

function initializeLocalData() {
  if (!localStorage.getItem("subjects")) {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }

  if (!localStorage.getItem("levels")) {
    localStorage.setItem("levels", JSON.stringify(levels));
  }

  if (!localStorage.getItem("topics")) {
    localStorage.setItem("topics", JSON.stringify(topics));
  }

  if (!localStorage.getItem("questions")) {
    localStorage.setItem("questions", JSON.stringify(questions));
  }
}

initializeLocalData();
function App() {
  return (
    <Routes>

      <Route path="/" element={<PlayerStart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/play/select" element={<PlayerSelect />} />
      <Route path="/play/quiz" element={<PlayerQuiz />} />
      <Route path="/play/results" element={<PlayerResults />} />
      {/* Agregaremos más rutas más adelante */}
    </Routes>
  );
}

export default App;
