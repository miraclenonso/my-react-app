import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UploadQuizForm.css';
import { supabase } from '../supabaseClient';

function QuestionPreview() {
  const { state } = useLocation();
  const subject = state?.subject || '';
  const tableName = subject.toLowerCase() === 'english' 
    ? 'utme_english_language_questions' 
    : `utme_${subject.toLowerCase()}_questions`;

  useEffect(() => console.log('Table name:', tableName), []);

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const questionData = state?.questionData || {};

  const handleEdit = () => {
    navigate('/upload', { state: { questionData } });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage('⏳ Uploading question...');

    try {
      let submissionData;
      
      if (subject.toLowerCase() === 'english') {
        submissionData = {
          question: questionData.question || '',
          question_image: questionData.question_image || '',
          option_a: questionData.option_a || '',
          option_b: questionData.option_b || '',
          option_c: questionData.option_c || '',
          option_d: questionData.option_d || '',
          correct_option: questionData.correct_option || '',
          explanation: questionData.explanation || '',
          topic: questionData.topic || '',
          section: questionData.section || '',
          subject: 'English Language',
          ...(questionData.topic === 'Comprehension' && {
            passage: questionData.passage || '',
            group_id: questionData.group_id || '',
            order_number: questionData.order_number ? parseInt(questionData.order_number) : null
          })
        };
      } else {
        submissionData = {
          question: questionData.question || '',
          question_image: questionData.question_image || '',
          option_a: questionData.option_a || '',
          option_b: questionData.option_b || '',
          option_c: questionData.option_c || '',
          option_d: questionData.option_d || '',
          correct_option: questionData.correct_option || '',
          explanation: questionData.explanation || '',
          topic: questionData.topic || ''
        };
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert([submissionData])
        .select();

      if (error) throw error;

      setStatusMessage('✅ Question submitted successfully!');

      navigate('/upload', { 
        state: { 
          submissionStatus: 'success',
          message: 'Question submitted successfully!',
          resetForm: true
        } 
      });
      
    } catch (error) {
      console.error('Insert error:', error);
      setStatusMessage(`❌ Failed to submit question: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const renderExplanation = () => {
    const explanationHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Explanation</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f9fbfc;
          color: #333;
          padding: 24px;
          line-height: 1.7;
          font-size: 16px;
        }

        h1, h2, h3 {
          color: #E97051;
          font-weight: 600;
        }

        h1 { font-size: 28px; }
        h2 { font-size: 24px; margin-top: 28px; }
        h3 { font-size: 20px; margin-top: 20px; }

        p {
          margin: 16px 0;
          font-size: 16px;
        }

        .math-block {
          background: #eef3fa;
          border-left: 4px solid #E97051;
          padding: 12px 16px;
          margin: 20px 0;
          font-size: 18px;
          overflow-x: auto;
        }

        .note {
          background: #fff8e1;
          border-left: 4px solid #ffc107;
          padding: 10px 14px;
          margin: 20px 0;
          color: #795548;
          font-style: italic;
        }

        pre {
          background: #f4f4f4;
          padding: 10px;
          overflow-x: auto;
          font-size: 15px;
          border-left: 4px solid #2196F3;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .table-container {
          overflow-x: auto;
          width: 100%;
          margin-top: 16px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f0f0f0;
        }

        img {
          max-width: 100%;
          height: auto;
          margin: 16px 0;
        }

        strong {
          color: #000;
        }
      </style>
    </head>
    <body>
      ${questionData.explanation || "<p>No explanation provided.</p>"}
    </body>
    </html>
    `;

    return (
      <div className="preview-explanation">
        <h4>Explanation:</h4>
        <iframe
          srcDoc={explanationHTML}
          title="Explanation Preview"
          style={{
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '200px',
            backgroundColor: '#fff'
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  };

  if (!state?.questionData) {
    return (
      <div className="quiz-container">
        <h2 className="form-title">No Question Data Found</h2>
        <p>Please go back and fill out the form first.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/upload')}
        >
          Back to Form
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="form-title">Question Preview</h2>
      {statusMessage && (
        <p className={`status-message ${
          statusMessage.includes('✅') ? 'success' : 
          statusMessage.includes('❌') ? 'error' : 'info'
        }`}>
          {statusMessage}
        </p>
      )}
      
      <div className="preview-section">
        <div className="preview-content">
          {questionData.question_image && (
            <img 
              src={questionData.question_image} 
              alt="Question illustration" 
              className="preview-image" 
            />
          )}
          
          {subject.toLowerCase() === 'english' && questionData.section && (
            <div className="preview-topic">
              <strong>Section:</strong> {questionData.section}
            </div>
          )}
          
          <p className="preview-question">{questionData.question}</p>
          
          {subject.toLowerCase() === 'english' && questionData.topic === 'Comprehension' && questionData.passage && (
            <div className="preview-passage">
              <h4>Passage:</h4>
              <p>{questionData.passage}</p>
            </div>
          )}
          
          <div className="preview-options">
            {['A', 'B', 'C', 'D'].map(opt => (
              <div 
                key={opt} 
                className={`preview-option ${
                  questionData.correct_option === opt ? 'correct' : ''
                }`}
              >
                <span className="option-label">{opt}:</span> 
                {questionData[`option_${opt.toLowerCase()}`]}
                {questionData.correct_option === opt && (
                  <span className="correct-badge">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
          
          {questionData.explanation && renderExplanation()}
          
          {questionData.topic && (
            <div className="preview-topic">
              <strong>Topic:</strong> {questionData.topic}
            </div>
          )}
          
          {subject.toLowerCase() === 'english' && questionData.topic === 'Comprehension' && (
            <>
              {questionData.group_id && (
                <div className="preview-topic">
                  <strong>Group ID:</strong> {questionData.group_id}
                </div>
              )}
              {questionData.order_number && (
                <div className="preview-topic">
                  <strong>Order Number:</strong> {questionData.order_number}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="preview-actions">
          <button 
            type="button" 
            className="btn btn-warning"
            onClick={handleEdit}
            disabled={isSubmitting}
          >
            Edit Question
          </button>
          <button 
            type="button" 
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionPreview;
