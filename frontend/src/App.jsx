import { Routes, Route, Navigate } from "react-router-dom";
import VocabAmountForm from "./pages/VocabAmountForm";
import Flashcards from "./pages/Flashcards";
import Story from "./pages/Story";
import SkillLevel from "./pages/SkillLevel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/skillLevel" replace />} />
      <Route path="/skillLevel" element={<SkillLevel />} />
      <Route path="/:skillLevel/vocabAmount" element={<VocabAmountForm />} />
      <Route path="/:skillLevel/flashcards/:vocabAmount" element={<Flashcards />} />
      <Route path="/:skillLevel/story/:wordsToLearn" element={<Story />} />
    </Routes>
  );
}

export default App;
