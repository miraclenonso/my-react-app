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
      commerce: 'Commerce',
      crs: 'Crs'
    };
    return subjectMap[subject] || subject;
  };

  // Generate topics based on subject
  const generateTopics = () => {
    const topicMap = {
      physics: [
        "Measurements and Unit", "Scalars and Vectors", "Motion", "Gravitational field", "Equilibrium of Forces", 
        "Work, Energy and Power", "Friction", "Simple Machines", "Elasticity", "Pressure", "Liquids At Rest", 
        "Temperature and Its Measurement", "Thermal Expansion", "Gas Laws", "Quantity of Heat", "Change of State",
        "Vapours", "Structure of Matter and Kinetic Theory", "Heat Transfer", "Waves", 
        "Propagation of Sound Waves", "Characteristics of Sound Waves", 
        "Light Energy", "Reflection of Light at Plane and Curved Surfaces", 
        "Refraction of Light Through at Plane and Curved Surfaces", "Optical Instruments", 
        "Dispersion of light and colours", "Electrostatics", "Capacitors", "Electric Cells", "Current Electricity",
        "Electrical Energy and Power", "Magnets and Magnetic Fields", 
        "Force on a Current-Carrying Conductor in a Magnetic Field", "Electromagnetic Induction", 
        "Simple A. C. Circuits", "Conduction of Electricity", "Elementary Modern Physics", "Introductory Electronics"
      ],
      chemistry: [
        "Separation of mixtures and purification of chemical substances", 
        "Chemical combination", "Kinetic theory of matter and Gas Laws", 
        "Atomic structure and bonding", "Air", "Water", "Solubility", "Environmental Pollution", 
        "Acids, bases and salts", "Oxidation and reduction", "Electrolysis", "Energy changes", 
        "Rates of Chemical Reaction", "Chemical equilibrium", "Non-metals and their compounds", 
        "Metals and their compounds", "Organic Compounds", "Chemistry and Industry"
      ],
      biology: [
        "Living organisms", "Evolution", "Variety of Organisms", "Internal structure of a flowering plant", 
        "Nutrition", "Transport", "Respiration", "Excretion", "Support and movement", "Reproduction", "Growth", 
        "Co-ordination and control", "Factors affecting the distribution of Organisms", 
        "Symbiotic interactions of plants and animals", "Natural Habitats", "Local (Nigerian) Biomes", 
        "The Ecology of Populations", "SOIL", "Humans and Environment", "Variation In Population", "Heredity", 
        "Theories of evolution", "Evidence of evolution"
      ],
      mathematics: [
        "Number bases", "Fractions, Decimals, Approximations and Percentages", "Indices, Logarithms and Surds", "Sets", "Polynomials", 
        "Variation", "Inequalities", "Progression", "Binary Operations", "Matrices and Determinants", 
        "Euclidean Geometry", "Mensuration", "Loci", "Coordinate Geometry", "Trigonometry", "Differentiation", 
        "Application of differentiation", "Integration", "Representation of data", "Measures of Location", 
        "Measures of Dispersion", "Permutation and Combination", "Probability"
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
        "Basic Concepts in Government", "Forms of Government", "Arms of Government", 
        "Structures of Governance", "Systems of Governance", "Political Ideologies", "Constitution", 
        "Principles of Democratic Government", "Processes of Legislation", "Citizenship", "The Electoral Process",
        "Political Parties and Party Systems", "Pressure Groups", "Public Opinion",
        "The Civil Service", "Pre-colonial Polities", "Imperialist Penetration", "Process of Decolonization", 
        "Constitutional Development in Nigeria", "Post-Independence Constitutions", 
        "Institutions of Government in Post-Independence Nigeria", "Public Commissions Established by the 1979 and Subsequent Constitutions", 
        "Political Parties and Party Politics in Post-Independence Nigeria", 
        "The Structure and Workings of Nigerian Federalism", "Public Corporations and Parastatals", 
        "Local Government", "The Military in Nigerian Politics", "Foreign Policy", "Nigeria's Foreign Policy", 
        "Relations with African Countries", "Nigeria in International Organizations", "International Organizations"
      ],
      economics: [
        "Economics as a science", "Economic Systems", "Methods and Tools of Economic Analysis", "The Theory of Demand", 
        "The Theory of Consumer Behaviour", "The Theory of Supply", "The Theory of Price Determination", 
        "The Theory of Production", "Theory of Costs and Revenue", "Market Structures", "National Income", 
        "Money and Inflation", "Financial Institutions", "Public Finance", "Economic Growth and Development", 
        "Agriculture in Nigeria", "Industry and Industrialization", "Natural Resources and the Nigerian Economy", 
        "Business Organizations", "Population", "International Trade", "International Economic Organizations", 
        "Factors of Production and their Theories"
      ],
      commerce: [
        "Commerce", "Occupation", "Production", "Trade", "Purchase and Sale of Goods", "Aids-to-trade", 
        "Business Units", "Financing Business", "Trade Associations", "Money", "Stock Exchange", 
        "Elements of Business Management", "Elements of Marketing", "Legal Aspects of Business", 
        "Information and Communication Technology (ICT)", "Business Environment and Social Responsibility"
      ],
      crs: [
        "The Sovereignty of God", "The Covenant", "Leadership qualities", "Divine providence, Guidance and Protection", 
        "Parental responsibility", "Obedience and Disobedience", "A man after God's own heart", 
        "Decision - Making", "Greed and its effects", "The Supremacy of God", "Religious reforms in Judah", 
        "Concern for Judah", "Faith, Courage and Protection", "God's message to Nineveh", 
        "Social justice, True religion and Divine love", "Holiness and Divine call", "Punishment and Hope", 
        "The birth and early life of Jesus", "The baptism and temptation of Jesus", "Discipleship", "Miracles",
        "The Parables", "Sermon on the Mount", "Mission of the disciples", "The Great Confession", 
        "The Transfiguration", "The Triumphal Entry and the cleansing of the Temple", "The Last Supper", 
        "The trials and the death of Jesus", "Resurrection, appearances and ascension of Jesus", 
        "Jesus' teachings about Himself", "Love", "Fellowship in the Early Church", 
        "The Holy Spirit and the mission of the Church", "Opposition to the Gospel message", 
        "Mission to the Gentiles", "Justification by Faith", "The Law and Grace", "New life in Christ", 
        "Christians as joint heirs with Christ", "Humility", "Forgiveness", "Spiritual gifts", 
        "Christian Giving", "Civic responsibility", "Dignity of labour", "The second coming of Christ", 
        "Impartiality", "Effective prayer", "Christian living in the community", "Corruption", "Sexual Immorality"
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
