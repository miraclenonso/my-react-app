import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UploadQuizForm.css';
import { supabase } from '../supabaseClient';

function UploadQuizForm() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    question_image: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: '',
    explanation: '',
    topic: '',
    section: '',
    group_id: '',
    passage: '',
    order_number: ''
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [topics, setTopics] = useState([]);

  // Helper function to check if a string is empty or just whitespace
  const isBlank = (str) => !str || !str.trim();

  // Convert subject parameter to proper table name format
  const getTableName = () => {
    if (!subject) return '';
    return `utme_${subject.toLowerCase()}_questions`;
  };

  // Map subject IDs to display names
  const getSubjectDisplayName = () => {
    const subjectMap = {
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      mathematics: 'Mathematics',
      english: 'English',
      government: 'Government',
      economics: 'Economics',
      commerce: 'Commerce'
    };
    return subjectMap[subject] || subject;
  };

  // Generate topics based on subject
  const generateTopics = () => {
    const topicMap = {
      physics: [
        'Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Magnetism',
        'Modern Physics', 'Optics', 'Measurement', 'Motion', 'Energy',
        'Work and Power', 'Circular Motion', 'Simple Harmonic Motion',
        'Gravitation', 'Elasticity', 'Fluid Mechanics', 'Heat Transfer',
        'Gas Laws', 'Wave Motion', 'Sound Waves', 'Electrostatics',
        'Current Electricity', 'Electromagnetic Induction', 'AC Circuits',
        'Quantum Physics', 'Nuclear Physics', 'Semiconductors', 'Capacitors',
        'Resistors', 'Transformers', 'Diodes', 'Transistors', 'Logic Gates',
        'Projectiles', 'Friction', 'Density', 'Pressure', 'Viscosity',
        'Surface Tension', 'Thermal Expansion', 'Simple Machines', 'Lenses',
        'Mirrors', 'Dispersion of Light', 'Polarization', 'Radioactivity'
      ],
      chemistry: [
        'Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Stoichiometry',
        'States of Matter', 'Thermochemistry', 'Chemical Kinetics', 'Equilibrium',
        'Electrochemistry', 'Organic Chemistry', 'Inorganic Chemistry',
        'Nuclear Chemistry', 'Environmental Chemistry', 'Acids and Bases',
        'Redox Reactions', 'Coordination Compounds', 'Metallurgy',
        'Chemical Analysis', 'Gas Laws', 'Solutions', 'Colloids',
        'Thermodynamics', 'Chemical Energetics', 'Reaction Mechanisms',
        'Hydrocarbons', 'Alcohols and Phenols', 'Aldehydes and Ketones',
        'Carboxylic Acids', 'Amines', 'Polymers', 'Biomolecules',
        'Chemistry in Industry', 'Chemistry in Agriculture', 'Chemistry in Medicine',
        'Water Treatment', 'Air Pollution', 'Petroleum', 'Metals and Non-metals',
        'Salt Analysis', 'Qualitative Analysis', 'Quantitative Analysis',
        'Mole Concept', 'Chemical Equations', 'Isomerism', 'Periodic Trends'
      ],
      biology: [
        'Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Biochemistry',
        'Microbiology', 'Zoology', 'Botany', 'Human Physiology', 'Plant Physiology',
        'Reproduction', 'Growth', 'Development', 'Inheritance', 'Variation',
        'Ecosystem', 'Biomes', 'Conservation', 'Taxonomy', 'Classification',
        'Photosynthesis', 'Respiration', 'Nutrition', 'Transport', 'Excretion',
        'Coordination', 'Support and Movement', 'Homeostasis', 'Immunity',
        'Diseases', 'Biotechnology', 'DNA Technology', 'Enzymes', 'Hormones',
        'Nervous System', 'Endocrine System', 'Circulatory System', 'Digestive System',
        'Respiratory System', 'Excretory System', 'Skeletal System', 'Muscular System',
        'Reproductive System', 'Sense Organs', 'Behavioral Ecology'
      ],
      mathematics: [
        'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics',
        'Probability', 'Number Theory', 'Coordinate Geometry', 'Vectors',
        'Matrices', 'Permutations', 'Combinations', 'Series', 'Sequences',
        'Functions', 'Quadratic Equations', 'Inequalities', 'Logarithms',
        'Surds', 'Indices', 'Differentiation', 'Integration', 'Differential Equations',
        'Circle Geometry', 'Triangle Geometry', 'Solid Geometry', 'Transformations',
        'Bearings', 'Sets', 'Logic', 'Binary Operations', 'Linear Programming',
        'Mechanics', 'Approximation', 'Variation', 'Polynomials', 'Arithmetic Progression',
        'Geometric Progression', 'Financial Mathematics', 'Modular Arithmetic',
        'Graph Theory', 'Topology', 'Complex Numbers', 'Conic Sections', '3D Geometry'
      ],
      english: [
        'Comprehension', 'Summary', 'Lexis and Structure', 'Oral English',
        'Grammar', 'Vocabulary', 'Synonyms', 'Antonyms', 'Idioms',
        'Phrasal Verbs', 'Figures of Speech', 'Essay Writing', 'Letter Writing',
        'Report Writing', 'Speech Writing', 'Debate', 'Reading Skills',
        'Listening Skills', 'Speaking Skills', 'Writing Skills', 'Punctuation',
        'Concord', 'Tenses', 'Parts of Speech', 'Sentence Structure',
        'Paragraph Development', 'Narrative Writing', 'Descriptive Writing',
        'Argumentative Writing', 'Expository Writing', 'Creative Writing',
        'Literary Devices', 'Poetry', 'Prose', 'Drama', 'Literature Analysis',
        'Word Formation', 'Stress Patterns', 'Intonation', 'Vowel Sounds',
        'Consonant Sounds', 'Syllable Division', 'Homophones', 'Homonyms',
        'Register', 'Cloze Passage'
      ],
      government: [
        'Political Concepts', 'Constitution', 'Democracy', 'Political Parties',
        'Elections', 'Public Administration', 'Local Government', 'Federalism',
        'Separation of Powers', 'Legislature', 'Executive', 'Judiciary',
        'Fundamental Human Rights', 'Citizenship', 'Sovereignty', 'Nationalism',
        'Colonialism', 'Imperialism', 'Political Ideologies', 'International Organizations',
        'United Nations', 'Commonwealth', 'ECOWAS', 'African Union',
        'Political Development', 'Military Rule', 'Public Opinion', 'Pressure Groups',
        'Civil Service', 'Public Corporations', 'Political Culture', 'Political Socialization',
        'Political Participation', 'Voting Behavior', 'Electoral Systems', 'Constitutional Development',
        'Political Economy', 'Public Policy', 'Foreign Policy', 'Diplomacy',
        'Arms Control', 'Political Thought', 'Comparative Politics', 'Political Systems',
        'Government Reforms'
      ],
      economics: [
        'Microeconomics', 'Macroeconomics', 'Demand and Supply', 'Elasticity',
        'Production', 'Cost', 'Market Structures', 'National Income',
        'Inflation', 'Unemployment', 'Money', 'Banking', 'Public Finance',
        'Taxation', 'Budget', 'International Trade', 'Balance of Payments',
        'Exchange Rates', 'Economic Growth', 'Development', 'Planning',
        'Economic Systems', 'Population', 'Labor Markets', 'Poverty',
        'Agriculture', 'Industry', 'Services', 'Monetary Policy', 'Fiscal Policy',
        'Economic Reforms', 'Globalization', 'WTO', 'IMF', 'World Bank',
        'Economic Integration', 'Business Cycles', 'Consumer Behavior',
        'Theory of the Firm', 'Factor Pricing', 'Welfare Economics', 'Development Economics',
        'Environmental Economics', 'Health Economics', 'Transport Economics'
      ],
      commerce: [
        'Trade', 'Marketing', 'Advertising', 'Insurance', 'Banking',
        'Transport', 'Communication', 'Warehousing', 'Stock Exchange',
        'Business Management', 'Office Practice', 'Bookkeeping', 'Accounting',
        'Business Law', 'Contract', 'Agency', 'Sale of Goods', 'Partnership',
        'Company Law', 'Negotiable Instruments', 'Business Finance', 'Business Environment',
        'Entrepreneurship', 'Small Business', 'Consumer Protection', 'Business Ethics',
        'E-Commerce', 'International Business', 'Business Communication', 'Business Mathematics',
        'Business Statistics', 'Business Policy', 'Human Resource Management', 'Production Management',
        'Materials Management', 'Quality Control', 'Business Organizations', 'Cooperative Societies',
        'Public Enterprises', 'Private Enterprises', 'Multinational Corporations', 'Franchising',
        'Business Start-up', 'Business Plan', 'Risk Management'
      ]
    };

    return topicMap[subject] || [];
  };

  useEffect(() => {
    if (!subject) {
      navigate('/');
      return;
    }
    setSubjectName(getSubjectDisplayName());
    setTopics(generateTopics());
  }, [subject, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (isBlank(formData.question)) newErrors.question = 'Question is required';
    if (!formData.correct_option) newErrors.correct_option = 'Correct option is required';
    if (isBlank(formData.option_a)) newErrors.option_a = 'Option A is required';
    if (isBlank(formData.option_b)) newErrors.option_b = 'Option B is required';
    if (isBlank(formData.option_c)) newErrors.option_c = 'Option C is required';
    if (isBlank(formData.option_d)) newErrors.option_d = 'Option D is required';
    if (isBlank(formData.explanation)) newErrors.explanation = 'Explanation is required';
    if (isBlank(formData.topic)) newErrors.topic = 'Topic is required';
    if (subject === 'english' && !formData.section) newErrors.section = 'Section is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionChange = (e) => {
    setFormData((prev) => ({ ...prev, correct_option: e.target.value }));
    if (errors.correct_option) {
      setErrors(prev => ({ ...prev, correct_option: '' }));
    }
  };

  const handleSectionChange = (e) => {
    setFormData((prev) => ({ ...prev, section: e.target.value }));
    if (errors.section) {
      setErrors(prev => ({ ...prev, section: '' }));
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate(`/preview/${subject}`, { 
        state: { 
          questionData: formData,
          subject: subject 
        } 
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setStatusMessage('⏳ Uploading question...');

    const tableName = getTableName();
    if (!tableName) {
      setStatusMessage('❌ Invalid subject selected.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Trim all string fields before submission
      const trimmedData = {
        ...formData,
        question: formData.question.trim(),
        option_a: formData.option_a.trim(),
        option_b: formData.option_b.trim(),
        option_c: formData.option_c.trim(),
        option_d: formData.option_d.trim(),
        explanation: formData.explanation.trim(),
        topic: formData.topic.trim(),
        group_id: formData.group_id.trim(),
        passage: formData.passage.trim()
      };

      // For English, include additional fields
      if (subject === 'english') {
        trimmedData.section = formData.section;
        trimmedData.order_number = formData.order_number ? parseInt(formData.order_number) : null;
      }

      const { error } = await supabase
        .from(tableName)
        .insert([trimmedData]);

      if (error) throw error;

      setStatusMessage('✅ Question submitted successfully!');
      
      if (typeof window !== 'undefined' && window.Notification) {
        new Notification('Question Uploaded', {
          body: `Your ${subjectName} question has been successfully uploaded!`,
          icon: '/notification-icon.png'
        });
      }
      
      // Reset form
      setFormData({
        question: '',
        question_image: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: '',
        explanation: '',
        topic: '',
        section: '',
        group_id: '',
        passage: '',
        order_number: ''
      });

    } catch (error) {
      console.error('Insert error:', error);
      setStatusMessage(`❌ Failed to submit ${subjectName} question.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!subject) {
    return (
      <div className="quiz-container">
        <h2 className="form-title">No Subject Selected</h2>
        <p>Please select a subject first.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Back to Subject Selection
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="form-title">Upload {subjectName} Quiz Question</h2>
      <form className="quiz-form">
        <label>Question: <span className="required">*</span></label>
        <textarea 
          name="question" 
          value={formData.question} 
          onChange={handleChange} 
          className={errors.question ? 'error-field' : ''}
          required 
        />
        {errors.question && <span className="error-message">{errors.question}</span>}

        <label>Question Image (URL):</label>
        <input 
          type="text" 
          name="question_image" 
          value={formData.question_image} 
          onChange={handleChange} 
        />

        <label>Option A: <span className="required">*</span></label>
        <input 
          type="text" 
          name="option_a" 
          value={formData.option_a} 
          onChange={handleChange} 
          className={errors.option_a ? 'error-field' : ''}
        />
        {errors.option_a && <span className="error-message">{errors.option_a}</span>}

        <label>Option B: <span className="required">*</span></label>
        <input 
          type="text" 
          name="option_b" 
          value={formData.option_b} 
          onChange={handleChange} 
          className={errors.option_b ? 'error-field' : ''}
        />
        {errors.option_b && <span className="error-message">{errors.option_b}</span>}

        <label>Option C: <span className="required">*</span></label>
        <input 
          type="text" 
          name="option_c" 
          value={formData.option_c} 
          onChange={handleChange}
          className={errors.option_c ? 'error-field' : ''}
        />
        {errors.option_c && <span className="error-message">{errors.option_c}</span>}

        <label>Option D: <span className="required">*</span></label>
        <input 
          type="text" 
          name="option_d" 
          value={formData.option_d} 
          onChange={handleChange} 
          className={errors.option_d ? 'error-field' : ''}
        />
        {errors.option_d && <span className="error-message">{errors.option_d}</span>}

        <label>Correct Option: <span className="required">*</span></label>
        <div className="radio-group">
          {['A', 'B', 'C', 'D'].map((opt) => (
            <label key={opt} className="radio-inline">
              <input
                type="radio"
                name="correct_option"
                value={opt}
                checked={formData.correct_option === opt}
                onChange={handleOptionChange}
              />
              {opt}
            </label>
          ))}
        </div>
        {errors.correct_option && <span className="error-message">{errors.correct_option}</span>}

        <label>Explanation: <span className="required">*</span></label>
        <textarea 
          name="explanation" 
          value={formData.explanation} 
          onChange={handleChange} 
          className={errors.explanation ? 'error-field' : ''}
        />
        {errors.explanation && <span className="error-message">{errors.explanation}</span>}

        <label>Topic: <span className="required">*</span></label>
        <select 
          name="topic" 
          value={formData.topic} 
          onChange={handleChange}
          className={errors.topic ? 'error-field' : ''}
        >
          <option value="">Select a topic</option>
          {topics.map((topic, index) => (
            <option key={index} value={topic}>{topic}</option>
          ))}
        </select>
        {errors.topic && <span className="error-message">{errors.topic}</span>}

        {/* English Language specific fields */}
        {subject === 'english' && (
          <>
            <label>Section: <span className="required">*</span></label>
            <div className="radio-group">
              {['SECTION A', 'SECTION B', 'SECTION C'].map((section) => (
                <label key={section} className="radio-inline">
                  <input
                    type="radio"
                    name="section"
                    value={section}
                    checked={formData.section === section}
                    onChange={handleSectionChange}
                  />
                  {section}
                </label>
              ))}
            </div>
            {errors.section && <span className="error-message">{errors.section}</span>}

            {/* Show these fields only when Comprehension is selected */}
            {formData.topic === 'Comprehension' && (
              <>
                <label>Passage: <span className="required">*</span></label>
                <textarea 
                  name="passage" 
                  value={formData.passage} 
                  onChange={handleChange} 
                  className={errors.passage ? 'error-field' : ''}
                />
                {errors.passage && <span className="error-message">{errors.passage}</span>}

                <label>Group ID: <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="group_id" 
                  value={formData.group_id} 
                  onChange={handleChange} 
                  className={errors.group_id ? 'error-field' : ''}
                />
                {errors.group_id && <span className="error-message">{errors.group_id}</span>}

                <label>Order Number: <span className="required">*</span></label>
                <input 
                  type="number" 
                  name="order_number" 
                  value={formData.order_number} 
                  onChange={handleChange} 
                  className={errors.order_number ? 'error-field' : ''}
                />
                {errors.order_number && <span className="error-message">{errors.order_number}</span>}
              </>
            )}
          </>
        )}

        <div className="button-group">
          <button 
            type="button" 
            className="preview-btn"
            onClick={handlePreview}
            disabled={isSubmitting}
          >
            Preview Question
          </button>
        </div>

        {statusMessage && (
          <p className={`status-message ${
            statusMessage.includes('✅') ? 'success' : 
            statusMessage.includes('❌') ? 'error' : 'info'
          }`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export default UploadQuizForm;