import React from 'react';
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
];

function SubjectSelection() {
  const navigate = useNavigate();

  const handleSubjectSelect = (subjectId) => {
    navigate(`/upload/${subjectId}`);
  };

  return (
    <div className="subject-selection-container">
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