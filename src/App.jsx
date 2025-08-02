import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubjectSelection from './components/SubjectSelection';
import UploadQuizForm from './components/UploadQuizForm';
import QuestionPreview from './components/QuestionPreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubjectSelection />} />
        <Route path="/upload/:subject" element={<UploadQuizForm />} />
        <Route path="/preview/:subject" element={<QuestionPreview />} />
        <Route path="*" element={<SubjectSelection />} />
      </Routes>
    </Router>
  );
}

export default App;