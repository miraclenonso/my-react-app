import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './UploadQuizForm.css';
import { supabase } from '../supabaseClient';

function FlashcardPreview() {
  const { state } = useLocation();
  const { subject } = useParams(); // ✅ safer to get subject from URL
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // ✅ use formData (what was passed from UploadScreen)
  const flashcardData = state?.formData || {};

  // Map subject to table name
  const getTableName = () => {
    if (!subject) return '';
    return `flashcards_utme_${subject.toLowerCase()}`;
  };

  const handleEdit = () => {
    navigate(`/flashcardsuploadscreen/${subject}`, { state: { formData: flashcardData } });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage('⏳ Uploading flashcard...');

    try {
      const tableName = getTableName();
      if (!tableName) throw new Error('Invalid subject');

      const submissionData = {
        question: flashcardData.question || '',
        answer: flashcardData.answer || '',
        explanation: flashcardData.explanation || '',
        topic: flashcardData.topic || '',
        type: flashcardData.type || ''
      };

      const { error } = await supabase.from(tableName).insert([submissionData]);

      if (error) throw error;

      setStatusMessage('✅ Flashcard submitted successfully!');

      navigate(`/flashcardsuploadscreen/${subject}`, {
        state: {
          submissionStatus: 'success',
          message: 'Flashcard submitted successfully!',
          resetForm: true
        }
      });
    } catch (error) {
      console.error('Insert error:', error);
      setStatusMessage(`❌ Failed to submit flashcard: ${error.message || error}`);
      setIsSubmitting(false);
    }
  };

  if (!state?.formData) {
    return (
      <div className="quiz-container">
        <h2 className="form-title">No Flashcard Data Found</h2>
        <p>Please go back and fill out the form first.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/flashcardsuploadscreen/${subject}`)}
        >
          Back to Form
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="form-title">Flashcard Preview</h2>
      {statusMessage && (
        <p
          className={`status-message ${
            statusMessage.includes('✅')
              ? 'success'
              : statusMessage.includes('❌')
              ? 'error'
              : 'info'
          }`}
        >
          {statusMessage}
        </p>
      )}

      <div className="preview-section">
        <div className="preview-content">
          <p className="preview-question">{flashcardData.question}</p>

          <div className="preview-answer">
            <strong>Answer:</strong> {flashcardData.answer}
          </div>

          {flashcardData.explanation && (
            <div className="preview-explanation">
              <h4>Explanation:</h4>
              <p>{flashcardData.explanation}</p>
            </div>
          )}

          {flashcardData.topic && (
            <div className="preview-topic">
              <strong>Topic:</strong> {flashcardData.topic}
            </div>
          )}

          {flashcardData.type && (
            <div className="preview-topic">
              <strong>Type:</strong> {flashcardData.type}
            </div>
          )}
        </div>

        <div className="preview-actions">
          <button
            type="button"
            className="btn btn-warning"
            onClick={handleEdit}
            disabled={isSubmitting}
          >
            Edit Flashcard
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Flashcard'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardPreview;
