import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubjectSelection from './components/SubjectSelection';
import UploadQuizForm from './components/UploadQuizForm';
import QuestionPreview from './components/QuestionPreview';
import FlashcardsUploadScreen from './components/FlashcardsUploadScreen'; 
import FlashcardPreview from './components/FlashcardPreview'; // ✅ added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubjectSelection />} />
        <Route path="/quizupload/:subject" element={<UploadQuizForm />} />
        <Route path="/flashcardsuploadscreen/:subject" element={<FlashcardsUploadScreen />} />
        <Route path="/preview/:subject" element={<QuestionPreview />} />
        <Route path="/flashcardpreview/:subject" element={<FlashcardPreview />} /> {/* ✅ added */}
        <Route path="*" element={<SubjectSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
