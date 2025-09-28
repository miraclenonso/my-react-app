import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UploadQuizForm.css';

function FlashcardsUploadScreen() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: '',
    question: '',
    answer: '',
    type: '',
    explanation: ''
  });

  const [errors, setErrors] = useState({});
  const [subjectName, setSubjectName] = useState('');
  const [topics, setTopics] = useState([]);

  // Helper
  const isBlank = (str) => !str || !str.trim();

  // Subject display names
  const getSubjectDisplayName = () => {
    const subjectMap = {
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      mathematics: 'Mathematics',
      english: 'English Language',
      government: 'Government',
      economics: 'Economics',
      commerce: 'Commerce',
      crs: 'CRS',
      novel: 'Reading Text'
    };
    return subjectMap[subject] || subject;
  };

  // Reuse same topics from quiz form
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
        "Living organisms", "Evolution", "Variety of Organisms", "Internal structure of a flowering plant and mammal",
        "Nutrition", "Transport", "Respiration", "Excretion", "Support and movement", "Reproduction", "Growth",
        "Co-ordination and control", "Factors affecting the distribution of Organisms",
        "Symbiotic interactions of plants and animals", "Natural Habitats", "Local (Nigerian) Biomes",
        "The Ecology of Populations", "Soil", "Humans and Environment", "Variation In Population", "Heredity",
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
        'Comprehension Passage', 'Cloze Passage', 'Sentence Interpretation',
        'Antonyms', 'Synonyms', 'Sentence completion', 'Oral Forms'
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
      ],
      novel: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6",
        "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12"
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
    if (isBlank(formData.answer)) newErrors.answer = 'Answer is required';
    if (isBlank(formData.topic)) newErrors.topic = 'Topic is required';
    if (isBlank(formData.type)) newErrors.type = 'Type is required';
    if (isBlank(formData.explanation)) newErrors.explanation = 'Explanation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePreview = () => {
    if (!validateForm()) return;

    // Navigate to FlashPreview with state
    navigate(`/flashcardpreview/${subject}`, { state: { formData } });
  };

  if (!subject) {
    return (
      <div className="quiz-container">
        <h2 className="form-title">No Subject Selected</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Subject Selection
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="form-title">Upload {subjectName} Flashcard</h2>
      <form className="quiz-form">
        <label>Question: <span className="required">*</span></label>
        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          className={errors.question ? 'error-field' : ''}
        />
        {errors.question && <span className="error-message">{errors.question}</span>}

        <label>Answer: <span className="required">*</span></label>
        <textarea
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          className={errors.answer ? 'error-field' : ''}
        />
        {errors.answer && <span className="error-message">{errors.answer}</span>}

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

        <label>Type: <span className="required">*</span></label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={errors.type ? 'error-field' : ''}
        >
          <option value="">Select type</option>
          <option value="Read mode">Read mode</option>
          <option value="Practice mode">Practice mode</option>
        </select>
        {errors.type && <span className="error-message">{errors.type}</span>}

        <div className="button-group">
          <button
            type="button"
            className="preview-btn"
            onClick={handlePreview}
          >
            Preview Flashcard
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlashcardsUploadScreen;
