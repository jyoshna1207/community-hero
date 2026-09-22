import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Nav
    navDashboard: "Dashboard",
    navReportIssue: "Report Issue",
    navExploreMap: "Explore Map",
    navMyReports: "My Reports",
    navLogout: "Logout",
    navLogin: "Login",
    navCitizenPortal: "Citizen Portal",
    
    // Portal Banner
    bannerRoleTag: "Citizen Civic Action Portal",
    bannerTitle: "Empowering Your Community, One Fix at a Time",
    bannerDesc: "Report neighborhood hazards with Google Gemini Vision AI, track ward officers and department crews in real time, verify completed repairs, and earn Civic Hero XP!",
    bannerReportBtn: "+ Report New Issue",
    bannerExploreBtn: "Explore City Map",
    
    // Quick 1-Tap Presets
    presetsTitle: "⚡ 1-Tap Quick Civic Issue Presets",
    presetsSubtitle: "Select frequent neighborhood problems to start a report in seconds:",
    presetPothole: "Road Pothole Hazard",
    presetPotholeDesc: "Dangerous road crater or broken asphalt causing vehicle traffic hazard.",
    presetStreetlight: "Dark Streetlight / Blackout",
    presetStreetlightDesc: "Faulty or non-functioning street pole light compromising pedestrian safety.",
    presetWaterLeak: "Water Pipeline Leakage",
    presetWaterLeakDesc: "Municipal drinking water pipeline broken or leaking onto public street.",
    presetGarbage: "Overflowing Garbage Dump",
    presetGarbageDesc: "Waste pile not cleared by sanitation crew causing health hazard.",
    presetOneTapBtn: "Report This Now →",

    // Helplines Widget
    helplinesTitle: "📞 Municipal Emergency & Ward Helplines",
    helpline1913: "State / Municipal 24x7 Control Room: 1913",
    helpline1912: "Electricity Disaster & Pole Cell: 1912",
    helplineWater: "Water Supply & Sewage Board: 155313",
    helplineOfficer: "Ward Officer On-Duty: +91 891 256 4444",

    // SLA & Guarantee
    slaTag: "⏱️ Municipal SLA Target",
    slaText: "Average Ward 04 Resolution Time: 38 Hours. Guaranteed triage by municipal engineer within 4 hours.",

    // KPI Cards
    kpiReported: "Issues Reported",
    kpiReportedSub: "Active neighborhood logs",
    kpiInProgress: "In Progress",
    kpiInProgressSub: "Under active repair by crews",
    kpiResolved: "Resolved Issues",
    kpiResolvedSub: "Successfully fixed & verified",
    kpiImpact: "Civic Value Generated",
    kpiImpactSub: "Estimated community economic benefit",

    // Live Feed & Upvoting
    recentReportsTitle: "Recent Community Reports in Your Ward",
    viewAll: "View All →",
    upvoteBtn: "👍 Me Too / High Priority",
    upvotedBtn: "✓ Priority Raised",
    trackDetails: "Track Details →",
    resolutionProgress: "Resolution Progress",
    noReportsYet: "No reports submitted yet in your community.",
    reportedBy: "Reported by",

    // Report Wizard
    reportWizardTag: "AI Civic Vision Wizard",
    reportWizardTitle: "Report a Neighborhood Issue",
    reportWizardDesc: "Follow the 4 structured steps below. Select the category, pinpoint GPS coordinates, upload photo/video evidence with Gemini Vision AI, and dispatch directly to municipal teams.",
    stepCategory: "Category",
    stepLocation: "GPS Location",
    stepEvidence: "Evidence & AI",
    stepDispatch: "Dispatch",
    step1Title: "What's the issue?",
    step1Subtitle: "Select the civic category to route to the correct municipal division",
    continueLocation: "Continue to Location →",
    backBtn: "← Back",
    confirmLocation: "Confirm Location →",
    step3Title: "Add Details & Photo Evidence",
    step3Subtitle: "Provide context to help ward officers verify and dispatch teams quickly",
    confirmedLocation: "Confirmed Problem Location",
    issueTitleLabel: "Issue Title",
    issueTitlePlaceholder: "e.g. Dangerous pothole near main road crossing",
    issueDescLabel: "Description",
    issueDescPlaceholder: "Describe the hazard size, severity, or how long it has persisted...",
    voiceBtnStart: "🎙️ Speak to Describe (Voice Input)",
    voiceBtnListening: "🔴 Listening... Speak now in Telugu / Hindi / English",
    photoEvidenceLabel: "Photo Evidence",
    videoEvidenceLabel: "Video Evidence (Optional)",
    uploadPhotoPrompt: "Click or Drag Photo (PNG, JPG, WEBP)",
    runAiScanBtn: "✨ Run Google Gemini AI Scan",
    aiAnalyzing: "Analyzing media with multimodal vision...",
    aiSuccessBadge: "✨ Gemini Multimodal AI Classification Complete",
    aiSeverityLabel: "AI Predicted Severity",
    aiPriorityScore: "Priority Score",
    aiEstTurnaround: "Est. Turnaround",
    aiRoutingDept: "Target Municipal Dept",
    submitTicketBtn: "🚀 Submit Report to Ward Officer",
    submittingTicket: "Dispatching to Municipal Task Force...",
    successTitle: "Civic Report Dispatched Successfully!",
    successTicketId: "Official Ticket ID",
    successNextSteps: "Your report has been geotagged and forwarded to the local Ward Officer & Municipal Department.",

    // Categories
    catRoads: "Road Damage",
    catWater: "Water Leakage",
    catGarbage: "Garbage & Waste",
    catStreetlight: "Streetlight",
    catDrainage: "Drainage",
    catInfrastructure: "Infrastructure",
    catOther: "Other Issue",

    // Statuses
    statusReported: "Reported",
    statusInProgress: "In Progress",
    statusUnderReview: "Under Review",
    statusResolved: "Resolved",

    // Explore Map
    mapBannerTitle: "Andhra Pradesh State Civic Issue Map",
    mapBannerDesc: "Compressed state-wide map representing citizen-reported issues with pins situated across Andhra Pradesh districts. Inspect live locations, track crew dispatch, and view real-time civic progress.",
    mapResetBtn: "🗺️ Full Andhra Pradesh View",
    mapReportInWard: "Report In Your Ward",
    mapRegionLabel: "Andhra Pradesh Region:",
    mapSearchPlaceholder: "Search reported issues across Andhra Pradesh by title or location...",
    mapViewMode: "Map View",
    listViewMode: "List View",
    legendReported: "Reported / Critical",
    legendInProgress: "In Progress",
    legendResolved: "Resolved / Solved",

    // My Reports
    myReportsTitle: "My Submitted Civic Reports",
    myReportsDesc: "Audit real-time status transitions, review officer inspection remarks, and track department resolution milestones for all tickets you have reported.",
    searchMyReportsPlaceholder: "Search my reports by title or location...",
    filterStatusLabel: "Filter by Status",
    allStatuses: "All Statuses",
    tableIssueLoc: "Issue Title & Location",
    tableCategory: "Category",
    tableStatus: "Status",
    tablePriority: "Priority",
    tableDate: "Reported Date",
    tableActions: "Actions",
    noMyReports: "No reports found matching your criteria.",
    deleteReportConfirm: "Are you sure you want to delete this report?",
  },

  te: {
    // Nav
    navDashboard: "డాష్‌బోర్డ్",
    navReportIssue: "సమస్య నివేదించండి",
    navExploreMap: "మ్యాప్ చూడండి",
    navMyReports: "నా నివేదికలు",
    navLogout: "లాగ్ అవుట్",
    navLogin: "లాగిన్",
    navCitizenPortal: "పౌర వేదిక",

    // Portal Banner
    bannerRoleTag: "పౌర సమస్యల పరిష్కార వేదిక",
    bannerTitle: "మీ పరిసరాల బాగు కోసం.. ఒక్క అడుగు!",
    bannerDesc: "ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ (AI) సహాయంతో మీ ప్రాంతంలో గుంతలు, చెత్త, వీధి దీపాల సమస్యలను నివేదించండి. మున్సిపల్ అధికారుల పనులను ప్రత్యక్షంగా ట్రాక్ చేయండి!",
    bannerReportBtn: "+ కొత్త సమస్యను నివేదించండి",
    bannerExploreBtn: "ఆంధ్రప్రదేశ్ మ్యాప్ చూడండి",

    // Quick 1-Tap Presets
    presetsTitle: "⚡ ఒక్క ట్యాప్‌తో త్వరిత సమస్య నివేదన",
    presetsSubtitle: "సాధారణంగా ఎదురయ్యే ఈ సమస్యలలో ఒకదానిని ఎంచుకోండి:",
    presetPothole: "రోడ్డు గుంతలు / ప్రమాదకర రహదారి",
    presetPotholeDesc: "వాహనాల రాకపోకలకు ఆటంకం కలిగించే పెద్ద గుంతలు మరియు పగిలిన తారు రోడ్డు.",
    presetStreetlight: "వెలుగుల లేని వీధి దీపం (చీకటి వీధి)",
    presetStreetlightDesc: "వీధి లైట్లు వెలగకపోవడం వల్ల ప్రజలకు, పాదచారులకు రాత్రివేళల్లో భద్రతా సమస్య.",
    presetWaterLeak: "నీటి సరఫరా పైపు లీకేజ్",
    presetWaterLeakDesc: "మంచి నీటి పైపు పగిలి వీధిలో రోడ్లపై నీరు వృధాగా ప్రవహించడం.",
    presetGarbage: "చెత్త కుప్పలు / పారిశుధ్య సమస్య",
    presetGarbageDesc: "సకాలంలో చెత్త తొలగించకపోవడం వల్ల దుర్వాసన మరియు వ్యాధుల ముప్పు.",
    presetOneTapBtn: "వెంటనే నివేదించండి →",

    // Helplines Widget
    helplinesTitle: "📞 మున్సిపల్ అత్యవసర & వార్డ్ హెల్ప్‌లైన్లు",
    helpline1913: "మున్సిపల్ 24x7 కంట్రోల్ రూమ్ టోల్‌ఫ్రీ: 1913",
    helpline1912: "విద్యుత్ సమస్యలు & తీగల అత్యవసర విభాగం: 1912",
    helplineWater: "మంచి నీటి సరఫరా & డ్రైనేజీ బోర్డు: 155313",
    helplineOfficer: "వార్డ్ అధికారి డెస్క్: +91 891 256 4444",

    // SLA & Guarantee
    slaTag: "⏱️ సమస్య పరిష్కార సమయం (SLA)",
    slaText: "మీ వార్డులో సగటు పరిష్కార సమయం: 38 గంటలు. 4 గంటల్లో మున్సిపల్ ఇంజనీర్ తనిఖీ హామీ.",

    // KPI Cards
    kpiReported: "మొత్తం నివేదించినవి",
    kpiReportedSub: "ప్రజల నుండి వచ్చిన సమస్యలు",
    kpiInProgress: "పని జరుగుతోంది",
    kpiInProgressSub: "మరమ్మతుల్లో ఉన్న పనులు",
    kpiResolved: "పరిష్కరించబడినవి",
    kpiResolvedSub: "విజయవంతంగా పూర్తి చేసినవి",
    kpiImpact: "ప్రజా ప్రయోజన విలువ",
    kpiImpactSub: "ఆర్థిక & పరిసర ప్రయోజనం",

    // Live Feed & Upvoting
    recentReportsTitle: "మీ వార్డులో ఇటీవల నమోదైన సమస్యలు",
    viewAll: "అన్నీ చూడండి →",
    upvoteBtn: "👍 నాకూ ఇదే సమస్య ఉంది (+1)",
    upvotedBtn: "✓ మీ ప్రాధాన్యత జోడించబడింది",
    trackDetails: "వివరాలు చూడండి →",
    resolutionProgress: "పరిష్కార పురోగతి",
    noReportsYet: "మీ ప్రాంతంలో ఇంకా ఏ సమస్యలూ నమోదు కాలేదు.",
    reportedBy: "నివేదించిన వారు",

    // Report Wizard
    reportWizardTag: "AI ఆధారిత సమస్యల నమోదు విజార్డ్",
    reportWizardTitle: "సమస్యను నివేదించండి",
    reportWizardDesc: "కింది 4 సులభమైన దశలను అనుసరించండి. సమస్య రకాన్ని ఎంచుకోండి, మ్యాప్‌లో లొకేషన్ గుర్తించండి, ఫోటో తీయండి మరియు అధికారులకు పంపండి.",
    stepCategory: "సమస్య రకం",
    stepLocation: "స్థలం (GPS)",
    stepEvidence: "ఫోటో & AI",
    stepDispatch: "నివేదన",
    step1Title: "మీ ప్రాంతంలో సమస్య ఏమిటి?",
    step1Subtitle: "సరైన మున్సిపల్ విభాగానికి చేరేలా సరైన కేటగిరీని ఎంచుకోండి",
    continueLocation: "స్థలం ఎంచుకోండి →",
    backBtn: "← వెనుకకు",
    confirmLocation: "స్థలాన్ని నిర్ధారించండి →",
    step3Title: "సమస్య వివరాలు & ఫోటో అందించండి",
    step3Subtitle: "అధికారులు వెంటనే పరిశీలించడానికి అవసరమైన సమాచారం ఇవ్వండి",
    confirmedLocation: "నిర్ధారించిన స్థలం",
    issueTitleLabel: "సమస్య శీర్షిక (Title)",
    issueTitlePlaceholder: "ఉదాహరణ: మెయిన్ రోడ్డు దగ్గర పెద్ద గుంత",
    issueDescLabel: "సమస్య వివరణ (Description)",
    issueDescPlaceholder: "సమస్య పరిమాణం, ప్రమాదం లేదా ఎంతకాలంగా ఉందో వివరించండి...",
    voiceBtnStart: "🎙️ మాట్లాడి రాయించండి (తెలుగు వాయిస్ రికగ్నిషన్)",
    voiceBtnListening: "🔴 వింటోంది... దయచేసి మాట్లాడండి...",
    photoEvidenceLabel: "ఫోటో సాక్ష్యం",
    videoEvidenceLabel: "వీడియో సాక్ష్యం (ఐచ్ఛికం)",
    uploadPhotoPrompt: "ఫోటోను అప్‌లోడ్ చేయండి (PNG, JPG)",
    runAiScanBtn: "✨ Gemini AI తో స్కాన్ చేయండి",
    aiAnalyzing: "ఫోటోను AI పరిశీలిస్తోంది...",
    aiSuccessBadge: "✨ AI ఆటో-వర్గీకరణ పూర్తయింది",
    aiSeverityLabel: "AI అంచనా వేసిన తీవ్రత",
    aiPriorityScore: "ప్రాధాన్యత స్కోరు",
    aiEstTurnaround: "పరిష్కార సమయం",
    aiRoutingDept: "చేరిన మున్సిపల్ విభాగం",
    submitTicketBtn: "🚀 వార్డ్ అధికారికి నివేదించండి",
    submittingTicket: "మున్సిపల్ సిబ్బందికి పంపుతోంది...",
    successTitle: "మీ సమస్య విజయవంతంగా నమోదైంది!",
    successTicketId: "అధికారిక టికెట్ ఐడీ",
    successNextSteps: "మీ సమస్యను స్థానిక వార్డ్ అధికారి మరియు సంబంధిత ఇంజనీరింగ్ విభాగానికి ఫార్వర్డ్ చేశాము.",

    // Categories
    catRoads: "రోడ్లు & గుంతలు",
    catWater: "నీటి లీకేజీ",
    catGarbage: "చెత్త & పారిశుధ్యం",
    catStreetlight: "వీధి దీపాలు",
    catDrainage: "మురుగు కాలువలు",
    catInfrastructure: "మౌలిక సదుపాయాలు",
    catOther: "ఇతర సమస్య",

    // Statuses
    statusReported: "నివేదించబడింది",
    statusInProgress: "పురోగతిలో ఉంది",
    statusUnderReview: "పరిశీలనలో ఉంది",
    statusResolved: "పరిష్కరించబడింది",

    // Explore Map
    mapBannerTitle: "ఆంధ్రప్రదేశ్ ప్రజా సమస్యల మ్యాప్",
    mapBannerDesc: "ఆంధ్రప్రదేశ్ జిల్లాల్లో ప్రజలు నివేదించిన సమస్యల రాష్ట్ర స్థాయి మ్యాప్. సమస్య తీవ్రత మరియు మున్సిపల్ పనుల పురోగతిని పర్యవేక్షించండి.",
    mapResetBtn: "🗺️ పూర్తి ఆంధ్రప్రదేశ్ వ్యూ",
    mapReportInWard: "మీ వార్డులో నివేదించండి",
    mapRegionLabel: "ఆంధ్రప్రదేశ్ జిల్లాలు:",
    mapSearchPlaceholder: "ఆంధ్రప్రదేశ్ అంతటా సమస్యలు లేదా స్థలాల పేరుతో వెతకండి...",
    mapViewMode: "మ్యాప్ వ్యూ",
    listViewMode: "జాబితా వ్యూ",
    legendReported: "నివేదించబడింది / అత్యవసరం",
    legendInProgress: "పని జరుగుతోంది",
    legendResolved: "పరిష్కరించబడింది",

    // My Reports
    myReportsTitle: "నేను నివేదించిన సమస్యలు",
    myReportsDesc: "మీరు మున్సిపల్ అధికారులకు నివేదించిన సమస్యల ప్రస్తుత స్థితి, అధికారుల వ్యాఖ్యలు మరియు ఫోటో సాక్ష్యాలను చూడండి.",
    searchMyReportsPlaceholder: "శీర్షిక లేదా స్థలం పేరుతో వెతకండి...",
    filterStatusLabel: "స్థితి ఆధారంగా ఫిల్టర్ చేయండి",
    allStatuses: "అన్ని స్థితులు",
    tableIssueLoc: "సమస్య & స్థలం",
    tableCategory: "కేటగిరీ",
    tableStatus: "స్థితి",
    tablePriority: "ప్రాధాన్యత",
    tableDate: "నమోదైన తేదీ",
    tableActions: "చర్యలు",
    noMyReports: "ఎలాంటి సమస్యలు కనుగొనబడలేదు.",
    deleteReportConfirm: "ఈ నివేదికను తొలగించాలనుకుంటున్నారా?",
  },

  hi: {
    // Nav
    navDashboard: "डैशबोर्ड",
    navReportIssue: "समस्या दर्ज करें",
    navExploreMap: "मानचित्र देखें",
    navMyReports: "मेरी शिकायतें",
    navLogout: "लॉग आउट",
    navLogin: "लॉग इन",
    navCitizenPortal: "नागरिक पोर्टल",

    // Portal Banner
    bannerRoleTag: "नागरिक समस्या समाधान पोर्टल",
    bannerTitle: "अपने मोहल्ले को बेहतर बनाएं, एक कदम आगे बढ़ाएं",
    bannerDesc: "आर्टिफिशियल इंटेलिजेंस (AI) की मदद से सड़क के गड्ढे, कचरा, स्ट्रीटलाइट की समस्या दर्ज करें। नगर निगम द्वारा किए जा रहे काम को लाइव ट्रैक करें!",
    bannerReportBtn: "+ नई समस्या दर्ज करें",
    bannerExploreBtn: "आंध्र प्रदेश मैप देखें",

    // Quick 1-Tap Presets
    presetsTitle: "⚡ 1-क्लिक त्वरित समस्या रिपोर्ट",
    presetsSubtitle: "अक्सर होने वाली समस्याओं में से चुनें और तुरंत शिकायत दर्ज करें:",
    presetPothole: "सड़क के खतरनाक गड्ढे",
    presetPotholeDesc: "यातायात में बाधा डालने वाले बड़े गड्ढे और टूटी हुई सड़क।",
    presetStreetlight: "बंद स्ट्रीट लाइट / अंधेरी सड़क",
    presetStreetlightDesc: "स्ट्रीट पोल लाइट खराब होने से पैदल चलने वालों के लिए सुरक्षा खतरा।",
    presetWaterLeak: "पानी की पाइपलाइन लीकेज",
    presetWaterLeakDesc: "पीने के पानी की पाइपलाइन टूटने से सड़क पर पानी का बहाव।",
    presetGarbage: "कचरे का ढेर / अस्वच्छता",
    presetGarbageDesc: "सफाई कर्मचारियों द्वारा समय पर कचरा न उठाने से दुर्गंध और बीमारी का खतरा।",
    presetOneTapBtn: "तुरंत शिकायत करें →",

    // Helplines Widget
    helplinesTitle: "📞 नगर निगम आपातकालीन हेल्पलाइन",
    helpline1913: "नगर निगम 24x7 कंट्रोल रूम: 1913",
    helpline1912: "बिजली समस्या एवं आपदा सेल: 1912",
    helplineWater: "जल आपूर्ति एवं सीवरेज बोर्ड: 155313",
    helplineOfficer: "वार्ड अधिकारी संपर्क: +91 891 256 4444",

    // SLA & Guarantee
    slaTag: "⏱️ समाधान समय सीमा (SLA)",
    slaText: "आपके वार्ड में औसत समाधान समय: 38 घंटे। 4 घंटे में नगर निगम इंजीनियर द्वारा निरीक्षण की गारंटी।",

    // KPI Cards
    kpiReported: "कुल दर्ज समस्याएं",
    kpiReportedSub: "नागरिकों द्वारा दर्ज मामले",
    kpiInProgress: "कार्य प्रगति पर",
    kpiInProgressSub: "कर्मचारियों द्वारा मरम्मत जारी",
    kpiResolved: "हल की गई समस्याएं",
    kpiResolvedSub: "सफलतापूर्वक ठीक की गईं",
    kpiImpact: "नागरिक प्रभाव मूल्य",
    kpiImpactSub: "सामुदायिक एवं आर्थिक लाभ",

    // Live Feed & Upvoting
    recentReportsTitle: "आपके वार्ड में हाल ही में दर्ज समस्याएं",
    viewAll: "सभी देखें →",
    upvoteBtn: "👍 मुझे भी यह समस्या है (+1)",
    upvotedBtn: "✓ प्राथमिकता दर्ज की गई",
    trackDetails: "विवरण देखें →",
    resolutionProgress: "समाधान प्रगति",
    noReportsYet: "आपके क्षेत्र में अभी तक कोई समस्या दर्ज नहीं हुई है।",
    reportedBy: "रिपोर्टर",

    // Report Wizard
    reportWizardTag: "AI आधारित समस्या समाधान विज़ार्ड",
    reportWizardTitle: "नागरिक समस्या दर्ज करें",
    reportWizardDesc: "नीचे दिए गए 4 आसान चरणों का पालन करें। श्रेणी चुनें, मैप पर स्थान चिह्नित करें, फोटो लें और अधिकारियों को भेजें।",
    stepCategory: "श्रेणी",
    stepLocation: "स्थान (GPS)",
    stepEvidence: "सबूत व AI",
    stepDispatch: "प्रेषण",
    step1Title: "समस्या क्या है?",
    step1Subtitle: "सही नगर निगम विभाग तक पहुंचने के लिए उचित श्रेणी चुनें",
    continueLocation: "स्थान चुनें →",
    backBtn: "← वापस",
    confirmLocation: "स्थान की पुष्टि करें →",
    step3Title: "समस्या विवरण एवं फोटो संलग्न करें",
    step3Subtitle: "अधिकारियों द्वारा त्वरित सत्यापन के लिए स्पष्ट जानकारी दें",
    confirmedLocation: "पुष्टीकृत स्थान",
    issueTitleLabel: "समस्या का शीर्षक",
    issueTitlePlaceholder: "उदा. मुख्य सड़क के पास बड़ा गड्ढा",
    issueDescLabel: "विवरण (Description)",
    issueDescPlaceholder: "गड्ढे का आकार, खतरा या कितने दिनों से यह समस्या है...",
    voiceBtnStart: "🎙️ बोलकर लिखें (हिंदी वॉइस इनपुट)",
    voiceBtnListening: "🔴 सुन रहा है... कृपया बोलें...",
    photoEvidenceLabel: "फोटो प्रमाण",
    videoEvidenceLabel: "वीडियो प्रमाण (वैकल्पिक)",
    uploadPhotoPrompt: "फोटो अपलोड करें (PNG, JPG)",
    runAiScanBtn: "✨ Gemini AI से स्कैन करें",
    aiAnalyzing: "फोटो का AI विश्लेषण जारी है...",
    aiSuccessBadge: "✨ AI विश्लेषण पूर्ण हुआ",
    aiSeverityLabel: "AI द्वारा आकलित गंभीरता",
    aiPriorityScore: "प्राथमिकता स्कोर",
    aiEstTurnaround: "समाधान का अनुमानित समय",
    aiRoutingDept: "संबद्ध नगर निगम विभाग",
    submitTicketBtn: "🚀 वार्ड अधिकारी को भेजें",
    submittingTicket: "नगर निगम टीम को प्रेषित कर रहे हैं...",
    successTitle: "आपकी शिकायत सफलतापूर्वक दर्ज हो गई!",
    successTicketId: "आधिकारिक टिकट आईडी",
    successNextSteps: "आपकी शिकायत स्थानीय वार्ड अधिकारी और संबंधित विभाग को प्रेषित कर दी गई है।",

    // Categories
    catRoads: "सड़क क्षति / गड्ढे",
    catWater: "पानी का रिसाव",
    catGarbage: "कचरा और सफाई",
    catStreetlight: "स्ट्रीट लाइट",
    catDrainage: "नाली की समस्या",
    catInfrastructure: "बुनियादी ढांचा",
    catOther: "अन्य समस्या",

    // Statuses
    statusReported: "दर्ज की गई",
    statusInProgress: "प्रगति पर है",
    statusUnderReview: "समीक्षाधीन",
    statusResolved: "हल हो चुकी है",

    // Explore Map
    mapBannerTitle: "आंध्र प्रदेश नागरिक समस्या मानचित्र",
    mapBannerDesc: "आंध्र प्रदेश के सभी जिलों में नागरिकों द्वारा दर्ज समस्याओं का राज्य स्तरीय मानचित्र। वास्तविक स्थिति और कार्य प्रगति की निगरानी करें।",
    mapResetBtn: "🗺️ पूर्ण आंध्र प्रदेश दृश्य",
    mapReportInWard: "अपने वार्ड में दर्ज करें",
    mapRegionLabel: "आंध्र प्रदेश जिले:",
    mapSearchPlaceholder: "आंध्र प्रदेश में समस्या या स्थान के नाम से खोजें...",
    mapViewMode: "मैप दृश्य",
    listViewMode: "सूची दृश्य",
    legendReported: "दर्ज / गंभीर",
    legendInProgress: "कार्य प्रगति पर",
    legendResolved: "हल हो चुकी है",

    // My Reports
    myReportsTitle: "मेरी दर्ज की गई शिकायतें",
    myReportsDesc: "आपके द्वारा दर्ज की गई समस्याओं की लाइव स्थिति, अधिकारियों की टिप्पणी और समाधान प्रमाण की समीक्षा करें।",
    searchMyReportsPlaceholder: "शीर्षक या स्थान से खोजें...",
    filterStatusLabel: "स्थिति अनुसार फ़िल्टर करें",
    allStatuses: "सभी स्थितियां",
    tableIssueLoc: "समस्या एवं स्थान",
    tableCategory: "श्रेणी",
    tableStatus: "स्थिति",
    tablePriority: "प्राथमिकता",
    tableDate: "दर्ज करने की तारीख",
    tableActions: "कार्रवाई",
    noMyReports: "कोई शिकायत नहीं मिली।",
    deleteReportConfirm: "क्या आप इस शिकायत को हटाना चाहते हैं?",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('ch_language') || 'en';
  });

  const setLanguage = (lang) => {
    if (['en', 'te', 'hi'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('ch_language', lang);
    }
  };

  const t = (key) => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (currentDict[key] !== undefined) {
      return currentDict[key];
    }
    return TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
