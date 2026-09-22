import React, { useState, useEffect, useRef } from 'react';
import { 
  FiCheckCircle, FiUploadCloud, FiAlertTriangle, FiDroplet, 
  FiTrash2, FiSun, FiWind, FiHome, FiHelpCircle, FiCheck, FiMapPin, FiX, FiImage,
  FiCpu, FiVideo, FiActivity, FiTag, FiZap, FiClock, FiShield, FiMic, FiMicOff
} from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import AddLocationPicker from '../../../components/Common/AddLocationPicker/AddLocationPicker';
import './ReportIssue.css';

export default function ReportIssue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const { t, language } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Road Damage');
  const [locationAddress, setLocationAddress] = useState('Duvvada, Visakhapatnam, Andhra Pradesh');
  const [locationCoords, setLocationCoords] = useState({ latitude: 17.6868, longitude: 83.2185 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Media & Details
  const [issueDetails, setIssueDetails] = useState({
    title: '',
    description: '',
    photo: null,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // Voice Dictation Speech-to-Text State
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDesc, setIsListeningDesc] = useState(false);
  const recognitionRef = useRef(null);

  // AI Multimodal Assistant State
  const [aiData, setAiData] = useState(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Read URL search params (from 1-tap presets on Dashboard)
  useEffect(() => {
    const catParam = searchParams.get('category');
    const titleParam = searchParams.get('title');
    const descParam = searchParams.get('desc');

    if (catParam) {
      setSelectedCategory(catParam);
    }
    if (titleParam || descParam) {
      setIssueDetails(prev => ({
        ...prev,
        title: titleParam || prev.title,
        description: descParam || prev.description
      }));
    }
  }, [searchParams]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Web Speech API Voice Dictation Handler
  const startVoiceDictation = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'te' 
        ? 'మీ బ్రౌజర్ వాయిస్ రికగ్నిషన్‌ను సపోర్ట్ చేయదు. Chrome లేదా Edge బ్రౌజర్ ఉపయోగించండి.' 
        : language === 'hi'
        ? 'आपका ब्राउज़र वॉइस रिकग्निशन को सपोर्ट नहीं करता। कृपया Chrome या Edge का उपयोग करें।'
        : 'Your browser does not support speech recognition. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    // Stop current instance if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Multilingual speech locale: te-IN for Telugu, hi-IN for Hindi, en-IN for English
    recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (field === 'title') {
      setIsListeningTitle(true);
      setIsListeningDesc(false);
    } else {
      setIsListeningDesc(true);
      setIsListeningTitle(false);
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) {
        if (field === 'title') {
          setIssueDetails(prev => ({
            ...prev,
            title: prev.title ? `${prev.title} ${transcript}` : transcript
          }));
        } else {
          setIssueDetails(prev => ({
            ...prev,
            description: prev.description ? `${prev.description} ${transcript}` : transcript
          }));
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn('Voice speech recognition error:', event.error);
      setIsListeningTitle(false);
      setIsListeningDesc(false);
    };

    recognition.onend = () => {
      setIsListeningTitle(false);
      setIsListeningDesc(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListeningTitle(false);
      setIsListeningDesc(false);
    }
  };

  const stopVoiceDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListeningTitle(false);
    setIsListeningDesc(false);
  };

  const categories = [
    { id: 'Road Damage', name: t('catRoads'), icon: <FiAlertTriangle /> },
    { id: 'Water Leakage', name: t('catWater'), icon: <FiDroplet /> },
    { id: 'Garbage & Waste', name: t('catGarbage'), icon: <FiTrash2 /> },
    { id: 'Streetlight', name: t('catStreetlight'), icon: <FiSun /> },
    { id: 'Drainage', name: t('catDrainage'), icon: <FiWind /> },
    { id: 'Infrastructure', name: t('catInfrastructure'), icon: <FiHome /> },
    { id: 'Other Issue', name: t('catOther'), icon: <FiHelpCircle /> },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handle Photo File Upload & Base64 Data URL Conversion
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIssueDetails(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setIssueDetails(prev => ({ ...prev, photo: null }));
  };

  // Handle Video File Upload
  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert('Video file size must be less than 25MB.');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
  };

  // AI Multimodal Auto-Analyze Handler
  const handleAiAnalyze = async () => {
    if (!issueDetails.title && !issueDetails.description && !issueDetails.photo) {
      setAiError(language === 'te' 
        ? 'AI విశ్లేషణ కోసం దయచేసి శీర్షిక, వివరణ లేదా ఫోటోను అందించండి.'
        : language === 'hi'
        ? 'AI विश्लेषण के लिए कृपया शीर्षक, विवरण या फ़ोटो अपलोड करें।'
        : 'Please enter a title, description, or upload a photo first for the AI scanner to analyze.');
      return;
    }

    setIsAnalyzingAi(true);
    setAiError('');

    try {
      const res = await axios.post('http://localhost:5000/api/issues/ai-analyze', {
        title: issueDetails.title || `${selectedCategory} issue`,
        description: issueDetails.description || 'Community reported issue requiring civic verification',
        image: issueDetails.photo || '',
      });

      setAiData(res.data);
      if (res.data.category) {
        const catMap = {
          'Roads': 'Road Damage',
          'Waste Management': 'Garbage & Waste',
          'Water Supply': 'Water Leakage',
          'Street Lights': 'Streetlight',
          'Drainage': 'Drainage',
          'Public Safety': 'Infrastructure',
        };
        const mappedName = catMap[res.data.category] || res.data.category;
        const match = categories.find(c => c.id.toLowerCase() === mappedName.toLowerCase() || c.name.toLowerCase() === mappedName.toLowerCase());
        if (match) {
          setSelectedCategory(match.id);
        }
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      setAiError(language === 'te'
        ? 'AI స్కాన్ అందుబాటులో లేదు; ప్రామాణిక పౌర ప్రాధాన్యత స్కోరు ఉపయోగించబడుతుంది.'
        : language === 'hi'
        ? 'AI स्कैन उपलब्ध नहीं है; डिफ़ॉल्ट नागरिक प्राथमिकता स्कोर लागू होगा।'
        : 'AI Scan unavailable; standard civic priority score will be used.');
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const [submittedReportId, setSubmittedReportId] = useState('CH-2026-00124');

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    const generatedId = `CH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport = {
      _id: generatedId,
      id: generatedId,
      title: issueDetails.title || `${selectedCategory} Issue`,
      category: selectedCategory === 'Road Damage' ? 'Roads' : selectedCategory,
      reporterName: user?.name || 'Anusha P.',
      description: issueDetails.description || 'Reported civic issue requiring municipal attention at specified location.',
      location: locationAddress,
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
      locationCoords: { lat: locationCoords.latitude, lng: locationCoords.longitude },
      image: issueDetails.photo || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      video: videoPreview || '',
      status: 'Reported',
      priority: aiData?.aiSeverity || 'High',
      aiSeverity: aiData?.aiSeverity || 'High',
      aiPriorityScore: aiData?.aiPriorityScore || 80,
      aiEstimatedDays: aiData?.aiEstimatedDays || 2,
      aiTags: aiData?.aiTags || ['#CommunityReport', '#CitizenHero'],
      assignedDept: aiData?.suggestedDept || 'Municipal Public Works Department',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    try {
      const payload = {
        title: newReport.title,
        category: newReport.category,
        description: newReport.description,
        location: locationAddress,
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        locationCoords: { lat: locationCoords.latitude, lng: locationCoords.longitude },
        image: newReport.image,
        video: newReport.video,
        aiSeverity: newReport.aiSeverity,
        aiPriorityScore: newReport.aiPriorityScore,
        aiEstimatedDays: newReport.aiEstimatedDays,
        aiTags: newReport.aiTags,
      };

      if (token) {
        const res = await axios.post('http://localhost:5000/api/issues', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data._id) {
          newReport._id = res.data._id;
          newReport.id = res.data._id;
        }
      }
    } catch (err) {
      console.error("Submit issue error:", err);
    } finally {
      try {
        const existing = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        localStorage.setItem('my_submitted_reports', JSON.stringify([newReport, ...existing]));
      } catch (e) {
        console.error("Storage error:", e);
      }

      setSubmittedReportId(newReport.id);
      setIsSubmitting(false);
      setCurrentStep(4);
    }
  };

  return (
    <div className="report-guided-page">
      {/* GUIDED CIVIC ISSUE REPORTING BANNER */}
      <div className="portal-purpose-banner citizen-theme" style={{ marginBottom: '24px' }}>
        <div className="banner-left-content">
          <div className="banner-role-tag">
            <FiZap /> {t('reportWizardTag')}
          </div>
          <h1 style={{ fontSize: '1.6rem' }}>{t('reportWizardTitle')}</h1>
          <p style={{ fontSize: '0.9rem' }}>
            {t('reportWizardDesc')}
          </p>
        </div>
      </div>

      {/* STEP PROGRESS INDICATOR (1 — 2 — 3 — 4) */}
      <div className="progress-stepper">
        <div style={{ textAlign: 'center' }}>
          <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>
            {currentStep > 1 ? <FiCheck /> : '1'}
          </div>
          <span style={{ fontSize: '0.72rem', color: currentStep >= 1 ? '#155EEF' : '#64748B', fontWeight: 700, marginTop: '4px', display: 'block' }}>
            {t('stepCategory')}
          </span>
        </div>
        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`} style={{ marginBottom: '18px' }}></div>

        <div style={{ textAlign: 'center' }}>
          <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>
            {currentStep > 2 ? <FiCheck /> : '2'}
          </div>
          <span style={{ fontSize: '0.72rem', color: currentStep >= 2 ? '#155EEF' : '#64748B', fontWeight: 700, marginTop: '4px', display: 'block' }}>
            {t('stepLocation')}
          </span>
        </div>
        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`} style={{ marginBottom: '18px' }}></div>

        <div style={{ textAlign: 'center' }}>
          <div className={`step-circle ${currentStep >= 3 ? 'active' : ''}`}>
            {currentStep > 3 ? <FiCheck /> : '3'}
          </div>
          <span style={{ fontSize: '0.72rem', color: currentStep >= 3 ? '#155EEF' : '#64748B', fontWeight: 700, marginTop: '4px', display: 'block' }}>
            {t('stepEvidence')}
          </span>
        </div>
        <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`} style={{ marginBottom: '18px' }}></div>

        <div style={{ textAlign: 'center' }}>
          <div className={`step-circle ${currentStep === 4 ? 'active' : ''}`}>
            4
          </div>
          <span style={{ fontSize: '0.72rem', color: currentStep === 4 ? '#16A34A' : '#64748B', fontWeight: 700, marginTop: '4px', display: 'block' }}>
            {t('stepDispatch')}
          </span>
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTOR */}
      {currentStep === 1 && (
        <div className="guided-step-card animate-fade-in">
          <h1>{t('step1Title')}</h1>
          <p className="guided-subtitle">{t('step1Subtitle')}</p>

          <div className="category-2col-grid">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className={`category-item-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="cat-icon-box">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>

          <div className="guided-actions-footer">
            <button className="btn-guided-next" onClick={handleNext}>
              {t('continueLocation')}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ADD LOCATION (LEAFLET + OSM) */}
      {currentStep === 2 && (
        <div className="guided-step-card animate-fade-in" style={{ padding: '20px' }}>
          <AddLocationPicker 
            initialAddress={locationAddress}
            initialCoords={{ latitude: locationCoords.latitude, longitude: locationCoords.longitude }}
            onLocationSelect={({ latitude, longitude, lat, lng, address }) => {
              const selectedLat = latitude ?? lat;
              const selectedLng = longitude ?? lng;
              setLocationAddress(address);
              setLocationCoords({ latitude: selectedLat, longitude: selectedLng });
            }}
          />

          <div className="guided-actions-footer" style={{ marginTop: '16px' }}>
            <button className="btn-guided-back" onClick={handleBack}>
              {t('backBtn')}
            </button>
            <button className="btn-guided-next" onClick={handleNext}>
              {t('confirmLocation')}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & PHOTO UPLOAD */}
      {currentStep === 3 && (
        <div className="guided-step-card animate-fade-in">
          <h1>{t('step3Title')}</h1>
          <p className="guided-subtitle">{t('step3Subtitle')}</p>

          {/* Confirmed Location Badge */}
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
              <FiMapPin /> {t('confirmedLocation')}
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803D' }}>{locationAddress}</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.825rem', fontFamily: 'monospace', color: '#166534' }}>
              <span>Latitude: {locationCoords.latitude?.toFixed(6)}</span>
              <span>Longitude: {locationCoords.longitude?.toFixed(6)}</span>
            </div>
          </div>

          {/* Title Input with Voice Dictation */}
          <div className="guided-form-group">
            <div className="label-voice-row">
              <label style={{ margin: 0 }}>{t('issueTitleLabel')}</label>
              <button 
                type="button" 
                className={`voice-dictate-btn ${isListeningTitle ? 'listening' : ''}`}
                onClick={() => isListeningTitle ? stopVoiceDictation() : startVoiceDictation('title')}
                title={language === 'te' ? 'వాయిస్ ద్వారా మాట్లాడండి' : language === 'hi' ? 'बोलकर लिखें' : 'Speak to dictate'}
              >
                {isListeningTitle ? (
                  <>
                    <span className="voice-pulse-dot" />
                    <FiMicOff /> {language === 'te' ? 'వింటోంది...' : language === 'hi' ? 'सुन रहा है...' : 'Listening...'}
                  </>
                ) : (
                  <>
                    <FiMic /> {language === 'te' ? '🎙️ మాట్లాడండి (వాయిస్)' : language === 'hi' ? '🎙️ बोलें (वॉइस)' : '🎙️ Voice Dictate'}
                  </>
                )}
              </button>
            </div>
            <input 
              type="text" 
              value={issueDetails.title}
              onChange={(e) => setIssueDetails({...issueDetails, title: e.target.value})}
              placeholder={t('issueTitlePlaceholder')}
            />
          </div>

          {/* Description Input with Voice Dictation */}
          <div className="guided-form-group">
            <div className="label-voice-row">
              <label style={{ margin: 0 }}>{t('issueDescLabel')}</label>
              <button 
                type="button" 
                className={`voice-dictate-btn ${isListeningDesc ? 'listening' : ''}`}
                onClick={() => isListeningDesc ? stopVoiceDictation() : startVoiceDictation('desc')}
                title={language === 'te' ? 'వాయిస్ ద్వారా మాట్లాడండి' : language === 'hi' ? 'बोलकर लिखें' : 'Speak to dictate'}
              >
                {isListeningDesc ? (
                  <>
                    <span className="voice-pulse-dot" />
                    <FiMicOff /> {language === 'te' ? 'వింటోంది...' : language === 'hi' ? 'सुन रहा है...' : 'Listening...'}
                  </>
                ) : (
                  <>
                    <FiMic /> {language === 'te' ? '🎙️ మాట్లాడండి (వివరణ)' : language === 'hi' ? '🎙️ बोलें (विवरण)' : '🎙️ Voice Dictate'}
                  </>
                )}
              </button>
            </div>
            <textarea 
              rows="4" 
              value={issueDetails.description}
              onChange={(e) => setIssueDetails({...issueDetails, description: e.target.value})}
              placeholder={t('issueDescPlaceholder')}
            ></textarea>
          </div>

          {/* PHOTO & VIDEO EVIDENCE UPLOADERS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Photo Upload */}
            <div className="guided-form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiImage style={{ color: '#155EEF' }} /> {t('photoEvidenceLabel')}
              </label>

              {issueDetails.photo ? (
                <div className="uploaded-photo-preview-card" style={{ height: '150px' }}>
                  <img src={issueDetails.photo} alt="Issue evidence" className="uploaded-img" />
                  <button type="button" className="btn-remove-photo" onClick={handleRemovePhoto}>
                    <FiX /> {language === 'te' ? 'తొలగించు' : language === 'hi' ? 'हटाएं' : 'Remove'}
                  </button>
                </div>
              ) : (
                <label htmlFor="photo-upload-input" className="photo-upload-box" style={{ cursor: 'pointer', height: '150px' }}>
                  <input 
                    type="file" 
                    id="photo-upload-input" 
                    accept="image/*" 
                    onChange={handlePhotoSelect} 
                    style={{ display: 'none' }}
                  />
                  <FiUploadCloud className="upload-icon" />
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>{t('uploadPhotoPrompt')}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>JPG, PNG, WEBP</span>
                </label>
              )}
            </div>

            {/* Video Upload */}
            <div className="guided-form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiVideo style={{ color: '#7C3AED' }} /> {t('videoEvidenceLabel')}
              </label>

              {videoPreview ? (
                <div className="uploaded-photo-preview-card" style={{ height: '150px' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  <button type="button" className="btn-remove-photo" onClick={handleRemoveVideo}>
                    <FiX /> {language === 'te' ? 'తొలగించు' : language === 'hi' ? 'हटाएं' : 'Remove'}
                  </button>
                </div>
              ) : (
                <label htmlFor="video-upload-input" className="photo-upload-box" style={{ cursor: 'pointer', height: '150px' }}>
                  <input 
                    type="file" 
                    id="video-upload-input" 
                    accept="video/*" 
                    onChange={handleVideoSelect} 
                    style={{ display: 'none' }}
                  />
                  <FiVideo className="upload-icon" style={{ color: '#7C3AED' }} />
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                    {language === 'te' ? 'వీడియో క్లిప్ ఎంచుకోండి' : language === 'hi' ? 'वीडियो क्लिप चुनें' : 'Upload Video Clip'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>MP4, WEBM (Max 25MB)</span>
                </label>
              )}
            </div>
          </div>

          {/* AI MULTIMODAL SCANNER BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #EEF4FF 0%, #F5F3FF 100%)',
            border: '1.5px solid #C7D2FE',
            borderRadius: '14px',
            padding: '16px 18px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#312E81', fontSize: '1rem' }}>
                  <FiCpu style={{ color: '#4F46E5', fontSize: '1.2rem' }} />
                  {language === 'te' ? 'AI మల్టీమోడల్ ఆటో-వర్గీకరణ' : language === 'hi' ? 'मल्टीमॉडल AI स्वचालित वर्गीकरण' : 'Multimodal AI Auto-Classifier'}
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.825rem', color: '#4338CA' }}>
                  {language === 'te' 
                    ? 'గూగుల్ జెమిని AI మీ ఫోటో మరియు సమస్యను విశ్లేషించి సరైన విభాగానికి కేటాయిస్తుంది.' 
                    : language === 'hi'
                    ? 'गूगल जेमिनी AI आपकी फ़ोटो और विवरण का विश्लेषण कर सही विभाग तय करता है।'
                    : 'Analyzes your uploaded photo, video, and details with Google Gemini to auto-categorize and prioritize.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={isAnalyzingAi}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  background: isAnalyzingAi ? '#94A3B8' : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: isAnalyzingAi ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isAnalyzingAi ? (
                  <>
                    <FiActivity className="animate-spin" /> {t('aiAnalyzing')}
                  </>
                ) : (
                  <>
                    <FiZap /> {t('runAiScanBtn')}
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
                ⚠️ {aiError}
              </p>
            )}

            {/* AI Results Card */}
            {aiData && (
              <div style={{
                marginTop: '16px',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #E0E7FF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      {language === 'te' ? 'కేటగిరీ:' : language === 'hi' ? 'श्रेणी:' : 'AI Category:'}
                    </span>
                    <span style={{ 
                      padding: '4px 10px', 
                      background: '#E0E7FF', 
                      color: '#3730A3', 
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      fontSize: '0.85rem' 
                    }}>
                      {aiData.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      {t('aiSeverityLabel')}:
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      background: aiData.aiSeverity === 'Critical' ? '#FEE2E2' : aiData.aiSeverity === 'High' ? '#FFEDD5' : '#FEF3C7',
                      color: aiData.aiSeverity === 'Critical' ? '#991B1B' : aiData.aiSeverity === 'High' ? '#9A3412' : '#92400E',
                      border: `1px solid ${aiData.aiSeverity === 'Critical' ? '#FCA5A5' : aiData.aiSeverity === 'High' ? '#FDBA74' : '#FDE68A'}`,
                    }}>
                      {aiData.aiSeverity}
                    </span>
                  </div>
                </div>

                {/* Priority Score Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span style={{ color: '#475569' }}>{t('aiPriorityScore')}</span>
                    <span style={{ color: '#4F46E5' }}>{aiData.aiPriorityScore} / 100</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, Math.max(10, aiData.aiPriorityScore || 75))}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 60%, #EF4444 100%)',
                      borderRadius: '4px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.825rem', color: '#475569', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiClock style={{ color: '#6366F1' }} />
                    <span>{t('aiEstTurnaround')}: <strong>{aiData.aiEstimatedDays} {language === 'te' ? 'రోజులు' : language === 'hi' ? 'दिन' : 'Days'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiShield style={{ color: '#10B981' }} />
                    <span>{t('aiRoutingDept')}: <strong>{aiData.suggestedDept || 'Municipal Task Force'}</strong></span>
                  </div>
                </div>

                {/* Tags */}
                {aiData.aiTags && aiData.aiTags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {aiData.aiTags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px', color: '#64748B', fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="guided-actions-footer">
            <button className="btn-guided-back" onClick={handleBack} disabled={isSubmitting}>
              {t('backBtn')}
            </button>
            <button className="btn-guided-next" onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? t('submittingTicket') : t('submitTicketBtn')}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REPORT SUCCESS SCREEN */}
      {currentStep === 4 && (
        <div className="success-screen-card animate-fade-in">
          <div className="large-green-checkmark">
            <FiCheckCircle />
          </div>

          <h1>{t('successTitle')} 🎉</h1>
          <p className="success-subtitle">
            {t('successNextSteps')}
          </p>

          {/* AI Prioritization Summary Banner */}
          {aiData && (
            <div style={{
              background: 'rgba(240, 253, 244, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(187, 247, 208, 0.8)',
              borderRadius: '20px',
              padding: '20px',
              margin: '20px 0',
              textAlign: 'left',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, color: '#166534', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiZap style={{ color: '#15803D' }} /> {t('aiSuccessBadge')}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: aiData.aiSeverity === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                  color: aiData.aiSeverity === 'Critical' ? '#991B1B' : '#92400E',
                }}>
                  {aiData.aiSeverity} ({aiData.aiPriorityScore}/100)
                </span>
              </div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.825rem', color: '#15803D' }}>
                {language === 'te' 
                  ? <>కేటాయించిన విభాగం: <strong>{aiData.suggestedDept || 'మున్సిపల్ టాస్క్ ఫోర్స్'}</strong>. అంచనా వేసిన గడువు: <strong>{aiData.aiEstimatedDays || 2} రోజులు</strong>.</>
                  : language === 'hi'
                  ? <>आवंटित विभाग: <strong>{aiData.suggestedDept || 'नगरपालिका कार्यबल'}</strong>. अनुमानित समय: <strong>{aiData.aiEstimatedDays || 2} दिन</strong>.</>
                  : <>Dispatched to <strong>{aiData.suggestedDept || 'Municipal Response Team'}</strong>. Estimated fix window: <strong>{aiData.aiEstimatedDays || 2} Days</strong>.</>}
              </p>
              {aiData.aiTags && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {aiData.aiTags.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.725rem', color: '#166534', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submitted Photo / Video Preview Badge */}
          {issueDetails.photo && (
            <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', margin: '14px 0', border: '1px solid #E2E8F0' }}>
              <img src={issueDetails.photo} alt="Submitted evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{
            background: 'rgba(248, 250, 252, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '20px',
            padding: '16px 20px',
            margin: '20px 0',
            textAlign: 'left',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              {language === 'te' ? 'నమోదైన లొకేషన్ వివరాలు:' : language === 'hi' ? 'सहेजे गए निर्देशांक:' : 'SAVED COORDINATES:'}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, color: '#155EEF' }}>
              Latitude: {locationCoords.latitude?.toFixed(6)} | Longitude: {locationCoords.longitude?.toFixed(6)}
            </p>
          </div>

          <div className="report-id-pill">
            <span className="id-label">{t('successTicketId')}:</span>
            <span className="id-value">{submittedReportId}</span>
          </div>

          <div className="success-cta-group">
            <button className="btn-track-report" onClick={() => navigate(`/track-report/${submittedReportId}`)}>
              {t('trackDetails')}
            </button>
            <button className="btn-back-home" onClick={() => navigate('/')}>
              {language === 'te' ? 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి' : language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}