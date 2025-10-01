import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectSelection.css';

const subjects = [
  { id: 'english', name: 'English Language', color: '#f72585' },
  { id: 'mathematics', name: 'Mathematics', color: '#4895ef' },
  { id: 'physics', name: 'Physics', color: '#4361ee' },
  { id: 'chemistry', name: 'Chemistry', color: '#3f37c9' },
  { id: 'biology', name: 'Biology', color: '#4cc9f0' },
  { id: 'government', name: 'Government', color: '#7209b7' },
  { id: 'economics', name: 'Economics', color: '#560bad' },
  { id: 'commerce', name: 'Commerce', color: '#480ca8' },
  { id: 'crs', name: 'Crs', color: '#7209b7' },
  { id: 'novel', name: 'Reading Text', color: '#7209b7' },
];

function SubjectSelection() {
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState('practice');

  const handleSubjectSelect = (subjectId) => {
    if (!questionType) {
      alert('Please select a question type first.');
      return;
    }

    if (questionType === 'practice') {
      navigate(`/quizupload/${subjectId}`);
    } else if (questionType === 'flashcard') {
      navigate(`/flashcardsuploadscreen/${subjectId}`);
    }
  };

  return (
    <div className="subject-selection-container">
      <h1 className="selection-title">Select Question Type</h1>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="dropdown-select"
        >
          <option value="">-- Select --</option>
          <option value="practice">Practice Exam Questions</option>
          <option value="flashcard">Flashcard Questions</option>
        </select>
      </div>

      <h1 className="selection-title">Select Subject to Upload Questions</h1>
      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="subject-card"
            style={{ backgroundColor: subject.color }}
            onClick={() => handleSubjectSelect(subject.id)}
          >
            <h2>{subject.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectSelection;
