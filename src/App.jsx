import { Routes, Route, Navigate } from "react-router-dom";
import VocabAmountForm from "./pages/VocabAmountForm";
import Flashcards from "./pages/Flashcards";
import Story from "./pages/Story";


function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/introduction" replace />}/>
      <Route path="/introduction" element={<VocabAmountForm/>}/>
      <Route path="/flashcards/:vocabAmount" element={<Flashcards/>}/>
      <Route path="/story/:wordsToLearn" element={<Story />}/>
    </Routes>
  );
}

export default App;
