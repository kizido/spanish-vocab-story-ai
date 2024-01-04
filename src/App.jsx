import { Routes, Route, Navigate } from "react-router-dom";
import VocabAmountForm from "./pages/VocabAmountForm";
import Flashcards from "./pages/Flashcards";


function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/introduction" replace />}/>
      <Route path="/introduction" element={<VocabAmountForm/>}/>
      <Route path="/flashcards" element={<Flashcards/>}/>
    </Routes>
  );
}

export default App;
