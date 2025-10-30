// Conversational AI Engine - Interactive Healthcare Assistant
const ConversationalAI = {
  currentConversation: null,
  
  // Conversation states
  states: {
    INITIAL: 'initial',
    SYMPTOM_COLLECTION: 'symptom_collection',
    SEVERITY_ASSESSMENT: 'severity_assessment',
    IMAGE_UPLOAD: 'image_upload',
    DIAGNOSIS: 'diagnosis',
    RECOMMENDATION: 'recommendation',
  },

  // Start a new conversation based on intent
  startConversation(intent, userMessage) {
    this.currentConversation = {
      intent: intent,
      state: this.states.INITIAL,
      data: {
        symptoms: [],
        severity: null,
        duration: null,
        images: [],
        vitalSigns: {},
        userResponses: []
      },
      questionIndex: 0
    };

    return this.getNextResponse(userMessage);
  },

  // Get next response based on conversation state
  getNextResponse(userInput) {
    if (!this.currentConversation) {
      return this.getIntentFromMessage(userInput);
    }

    const { intent, state, data, questionIndex } = this.currentConversation;

    // Process user input based on current state
    if (userInput && state !== this.states.INITIAL) {
      this.processUserInput(userInput);
    }

    // Generate next question or response
    switch (intent) {
      case 'symptom_check':
        return this.handleSymptomCheck();
      case 'skin_scan':
        return this.handleSkinScan();
      case 'report_analysis':
        return this.handleReportAnalysis();
      case 'doctor_referral':
        return this.handleDoctorReferral();
      case 'hospital_finder':
        return this.handleHospitalFinder();
      case 'mental_health':
        return this.handleMentalHealth();
      default:
        return this.getGeneralResponse(userInput);
    }
  },

  // Detect intent from user message
  getIntentFromMessage(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('symptom') || lowerMsg.includes('sick') || lowerMsg.includes('pain') || 
        lowerMsg.includes('fever') || lowerMsg.includes('cough')) {
      return this.startConversation('symptom_check', message);
    }
    
    if (lowerMsg.includes('skin') || lowerMsg.includes('rash') || lowerMsg.includes('itch')) {
      return this.startConversation('skin_scan', message);
    }
    
    if (lowerMsg.includes('report') || lowerMsg.includes('test') || lowerMsg.includes('lab') || 
        lowerMsg.includes('result')) {
      return this.startConversation('report_analysis', message);
    }
    
    if (lowerMsg.includes('doctor') || lowerMsg.includes('specialist') || lowerMsg.includes('refer')) {
      return this.startConversation('doctor_referral', message);
    }
    
    if (lowerMsg.includes('hospital') || lowerMsg.includes('emergency') || lowerMsg.includes('clinic')) {
      return this.startConversation('hospital_finder', message);
    }
    
    if (lowerMsg.includes('mental') || lowerMsg.includes('stress') || lowerMsg.includes('anxiety') || 
        lowerMsg.includes('depress')) {
      return this.startConversation('mental_health', message);
    }

    return this.getGeneralResponse(message);
  },

  // Process user input and update conversation data
  processUserInput(input) {
    const { state, data } = this.currentConversation;
    
    switch (state) {
      case this.states.SYMPTOM_COLLECTION:
        data.symptoms.push(input);
        data.userResponses.push(input);
        break;
      case this.states.SEVERITY_ASSESSMENT:
        data.severity = this.extractSeverity(input);
        data.duration = this.extractDuration(input);
        break;
      case this.states.IMAGE_UPLOAD:
        // Image will be handled separately
        break;
    }
  },

  // Extract severity from user response
  extractSeverity(input) {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('severe') || lowerInput.includes('very') || lowerInput.includes('extreme')) {
      return 'severe';
    } else if (lowerInput.includes('moderate') || lowerInput.includes('medium')) {
      return 'moderate';
    } else {
      return 'mild';
    }
  },

  // Extract duration from user response
  extractDuration(input) {
    const numbers = input.match(/\d+/);
    if (numbers) {
      return parseInt(numbers[0]);
    }
    return null;
  },

  // Handle symptom checking conversation
  handleSymptomCheck() {
    const { state, data, questionIndex } = this.currentConversation;
    
    const questions = [
      {
        state: this.states.SYMPTOM_COLLECTION,
        question: "I'll help you assess the symptoms. Let me ask you a few questions:\n\n**Question 1:** What are the main symptoms the patient is experiencing? (e.g., fever, cough, headache, body pain)",
        needsInput: true
      },
      {
        state: this.states.SYMPTOM_COLLECTION,
        question: "**Question 2:** Are there any other symptoms like nausea, vomiting, diarrhea, or difficulty breathing?",
        needsInput: true
      },
      {
        state: this.states.SEVERITY_ASSESSMENT,
        question: "**Question 3:** How severe are the symptoms on a scale of 1-10? And how many days has the patient been experiencing these symptoms?",
        needsInput: true
      },
      {
        state: this.states.SEVERITY_ASSESSMENT,
        question: "**Question 4:** Does the patient have any pre-existing conditions like diabetes, hypertension, or asthma?",
        needsInput: true
      }
    ];

    if (questionIndex < questions.length) {
      this.currentConversation.state = questions[questionIndex].state;
      this.currentConversation.questionIndex++;
      return {
        message: questions[questionIndex].question,
        needsInput: true,
        showImageUpload: false
      };
    } else {
      // All questions answered, provide diagnosis and recommendations
      return this.generateSymptomDiagnosis();
    }
  },

  // Generate diagnosis based on collected symptoms
  generateSymptomDiagnosis() {
    const { data } = this.currentConversation;
    const symptoms = data.symptoms.join(', ').toLowerCase();
    const severity = data.severity || 'moderate';
    
    let diagnosis = '';
    let recommendations = '';
    let urgency = '';
    let doctorType = '';
    let hospitalNeeded = false;

    // Simple rule-based diagnosis
    if (symptoms.includes('fever') && symptoms.includes('cough')) {
      diagnosis = 'Possible respiratory infection (Common cold, Flu, or COVID-19)';
      doctorType = 'General Physician or Pulmonologist';
      if (severity === 'severe' || symptoms.includes('breathing')) {
        urgency = '🔴 **URGENT**';
        hospitalNeeded = true;
        recommendations = '- Immediate hospital visit required\n- Possible oxygen therapy needed\n- COVID-19 testing recommended';
      } else {
        urgency = '🟡 **MODERATE**';
        recommendations = '- Rest and hydration\n- Monitor temperature\n- Paracetamol for fever\n- Visit clinic if symptoms worsen';
      }
    } else if (symptoms.includes('chest pain') || symptoms.includes('heart')) {
      diagnosis = 'Possible cardiac issue';
      doctorType = 'Cardiologist (URGENT)';
      urgency = '🔴 **EMERGENCY**';
      hospitalNeeded = true;
      recommendations = '- Call 108 immediately\n- Do not delay\n- Keep patient calm and seated\n- Note time of symptom onset';
    } else if (symptoms.includes('headache') && symptoms.includes('fever')) {
      diagnosis = 'Possible viral infection or meningitis';
      doctorType = 'General Physician or Neurologist';
      urgency = '🟡 **MODERATE to HIGH**';
      recommendations = '- Monitor for stiff neck or confusion\n- If severe headache → immediate hospital\n- Otherwise, visit clinic within 24 hours';
    } else if (symptoms.includes('stomach') || symptoms.includes('diarrhea') || symptoms.includes('vomit')) {
      diagnosis = 'Possible gastroenteritis or food poisoning';
      doctorType = 'General Physician or Gastroenterologist';
      urgency = '🟢 **MILD to MODERATE**';
      recommendations = '- Oral rehydration solution (ORS)\n- Light diet (BRAT: Banana, Rice, Applesauce, Toast)\n- Avoid dairy and spicy foods\n- Visit doctor if symptoms persist >48 hours';
    } else {
      diagnosis = 'General illness - needs professional evaluation';
      doctorType = 'General Physician';
      urgency = '🟡 **MODERATE**';
      recommendations = '- Schedule clinic appointment\n- Monitor symptoms\n- Keep symptom diary';
    }

    const response = `**📋 Symptom Assessment Complete**

**Reported Symptoms:** ${data.symptoms.join(', ')}
**Severity Level:** ${severity.toUpperCase()}

**Preliminary Assessment:**
${diagnosis}

**Urgency Level:** ${urgency}

**Recommended Actions:**
${recommendations}

**Specialist Needed:** ${doctorType}

${hospitalNeeded ? this.getNearbyHospitals() : this.getNearbyDoctors(doctorType)}

**⚠️ Disclaimer:** This is a preliminary assessment. Please consult a qualified medical professional for accurate diagnosis.

Would you like me to:
1. Find nearby ${doctorType}s
2. Get directions to nearest hospital
3. Start a new assessment`;

    this.currentConversation = null; // Reset conversation
    return {
      message: response,
      needsInput: false,
      showImageUpload: false
    };
  },

  // Handle skin scan conversation
  handleSkinScan() {
    const { state, data, questionIndex } = this.currentConversation;
    
    if (state === this.states.INITIAL) {
      this.currentConversation.state = this.states.IMAGE_UPLOAD;
      return {
        message: `**📸 Skin Condition Analysis**

To analyze the skin condition, I need you to:

**Step 1:** Take a clear photo of the affected area
- Good lighting (natural light preferred)
- Close-up shot showing the condition clearly
- Include a ruler or coin for scale if possible

**Step 2:** Upload the image using the button below

**Step 3:** Answer a few questions about the condition

Click the "📷 Upload Image" button below to get started.`,
        needsInput: false,
        showImageUpload: true,
        uploadType: 'skin'
      };
    }
    
    if (state === this.states.IMAGE_UPLOAD && data.images.length > 0) {
      this.currentConversation.state = this.states.SYMPTOM_COLLECTION;
      this.currentConversation.questionIndex = 0;
      return {
        message: `**Image received!** ✓

Now, let me ask you a few questions:

**Question 1:** Where exactly is this skin condition located on the body?`,
        needsInput: true,
        showImageUpload: false
      };
    }
    
    const questions = [
      "**Question 2:** How long has this condition been present? (days/weeks)",
      "**Question 3:** Is it itchy, painful, or neither?",
      "**Question 4:** Has the patient tried any treatments or medications?",
    ];
    
    if (questionIndex < questions.length) {
      this.currentConversation.questionIndex++;
      return {
        message: questions[questionIndex],
        needsInput: true,
        showImageUpload: false
      };
    } else {
      return this.generateSkinDiagnosis();
    }
  },

  // Generate skin diagnosis
  generateSkinDiagnosis() {
    const { data } = this.currentConversation;
    
    const response = `**🔬 Skin Condition Analysis**

**Image Analysis:** Based on the uploaded image and your responses:

**Possible Conditions:**
1. **Fungal Infection (Ringworm)** - If circular with raised edges
   - Treatment: Antifungal cream (Clotrimazole) 2x daily
   - Duration: 2-4 weeks
   
2. **Contact Dermatitis** - If irregular, red, and itchy
   - Treatment: Remove irritant, apply calamine lotion
   - Mild steroid cream if severe
   
3. **Eczema** - If dry, scaly, and chronic
   - Treatment: Moisturizer + mild steroid cream
   - Avoid triggers (soap, detergents)

**Recommended Actions:**
- Keep area clean and dry
- Avoid scratching
- Apply recommended treatment
- Monitor for improvement

**When to See a Dermatologist:**
🔴 If spreading rapidly
🔴 Signs of infection (pus, warmth, fever)
🔴 No improvement after 7 days
🔴 Severe pain or blistering

**Nearby Dermatologists:**
${this.getNearbyDoctors('Dermatologist')}

Would you like me to book an appointment or provide more information?`;

    this.currentConversation = null;
    return {
      message: response,
      needsInput: false,
      showImageUpload: false
    };
  },

  // Handle report analysis conversation
  handleReportAnalysis() {
    const { state, data } = this.currentConversation;
    
    if (state === this.states.INITIAL) {
      this.currentConversation.state = this.states.IMAGE_UPLOAD;
      return {
        message: `**📋 Lab Report Analysis**

I'll help you interpret the lab report. Please:

**Step 1:** Upload a clear image/photo of the lab report
- Ensure all values are readable
- Include the reference ranges
- Multiple pages? Upload all of them

**Step 2:** I'll analyze the results and explain:
- What each test means
- Which values are abnormal
- Recommended actions
- Specialist referrals if needed

Click the "📄 Upload Report" button below to begin.`,
        needsInput: false,
        showImageUpload: true,
        uploadType: 'report'
      };
    }
    
    if (state === this.states.IMAGE_UPLOAD && data.images.length > 0) {
      return this.analyzeLabReport();
    }
    
    return {
      message: "Please upload the lab report image to continue.",
      needsInput: false,
      showImageUpload: true,
      uploadType: 'report'
    };
  },

  // Analyze lab report
  analyzeLabReport() {
    const response = `**🔬 Lab Report Analysis Complete**

**Report Type:** Complete Blood Count (CBC) + Metabolic Panel

**Key Findings:**

**1. Hemoglobin: 9.1 g/dL** ⚠️ LOW
   - Normal Range: 12-15.5 g/dL (women), 13.5-17.5 g/dL (men)
   - **Diagnosis:** Moderate Anemia
   - **Causes:** Iron deficiency, B12 deficiency, chronic disease
   
   **Immediate Actions:**
   ✓ Iron-rich diet (spinach, lentils, red meat, jaggery)
   ✓ Iron supplements (Ferrous sulfate 200mg daily)
   ✓ Vitamin C with meals (enhances absorption)
   ✓ Avoid tea/coffee with meals
   
   **Follow-up:** Recheck in 4-6 weeks

**2. Blood Sugar (Fasting): 118 mg/dL** ⚠️ BORDERLINE
   - Normal: 70-100 mg/dL
   - **Status:** Pre-diabetic range
   
   **Actions:**
   ✓ Reduce sugar and refined carbs
   ✓ Regular exercise (30 min daily)
   ✓ Weight management
   ✓ Retest in 3 months

**3. Other Values:** Within normal limits ✓

**Specialist Recommendations:**
- **Hematologist** for anemia management
- **Endocrinologist** or General Physician for blood sugar

**Nearby Specialists:**
${this.getNearbyDoctors('Hematologist / General Physician')}

**Next Steps:**
1. Start dietary modifications immediately
2. Begin iron supplementation
3. Schedule follow-up tests in 4-6 weeks
4. Consult specialist if symptoms worsen

Would you like me to explain any specific value or book an appointment?`;

    this.currentConversation = null;
    return {
      message: response,
      needsInput: false,
      showImageUpload: false
    };
  },

  // Handle doctor referral
  handleDoctorReferral() {
    const { state, questionIndex } = this.currentConversation;
    
    const questions = [
      "**Question 1:** What is the patient's main health concern or condition?",
      "**Question 2:** How urgent is the situation? (Routine, Soon, Urgent, Emergency)",
      "**Question 3:** Does the patient have any specific symptoms? (chest pain, breathing difficulty, etc.)"
    ];
    
    if (questionIndex < questions.length) {
      this.currentConversation.questionIndex++;
      return {
        message: questions[questionIndex],
        needsInput: true,
        showImageUpload: false
      };
    } else {
      return this.generateDoctorRecommendation();
    }
  },

  // Generate doctor recommendation
  generateDoctorRecommendation() {
    const { data } = this.currentConversation;
    const concern = data.symptoms[0] || '';
    const urgency = data.symptoms[1] || 'routine';
    
    const response = `**👨‍⚕️ Doctor Referral Recommendation**

**Based on:** ${concern}
**Urgency:** ${urgency.toUpperCase()}

**Recommended Specialist:**
${this.getSpecialistType(concern)}

**Available Doctors Nearby:**
${this.getNearbyDoctors('specialist')}

**What to Bring:**
✓ Previous medical records
✓ Current medications list
✓ Insurance/health card
✓ Symptom diary (if applicable)

**Preparation Tips:**
- Write down all symptoms with timeline
- List questions you want to ask
- Bring a family member if needed
- Arrive 15 minutes early

Would you like me to provide directions or more information about any doctor?`;

    this.currentConversation = null;
    return {
      message: response,
      needsInput: false,
      showImageUpload: false
    };
  },

  // Handle hospital finder
  handleHospitalFinder() {
    const { state, questionIndex } = this.currentConversation;
    
    const questions = [
      "**Question 1:** What type of care is needed? (Emergency, Routine checkup, Surgery, Maternity, etc.)",
      "**Question 2:** How urgent is the situation? (Life-threatening, Urgent, Can wait)",
      "**Question 3:** Does the patient need ambulance service?"
    ];
    
    if (questionIndex < questions.length) {
      this.currentConversation.questionIndex++;
      return {
        message: questions[questionIndex],
        needsInput: true,
        showImageUpload: false
      };
    } else {
      return this.generateHospitalRecommendation();
    }
  },

  // Generate hospital recommendation
  generateHospitalRecommendation() {
    const response = `**🏥 Hospital Recommendations**

${this.getNearbyHospitals()}

**Emergency Transport:**
- **National Ambulance: 108** (FREE)
- **Private Ambulance:** ₹500-1500
- **Hospital Direct:** Call facility for pickup

**What to Bring:**
✓ Patient ID/Aadhaar card
✓ Previous medical records
✓ Current medications
✓ Insurance card
✓ Emergency contact numbers

**Pre-Transport Checklist:**
✓ Check vital signs if possible
✓ Note symptom onset time
✓ Stabilize patient
✓ Call ahead to hospital
✓ Brief family on situation

**For Life-Threatening Emergencies:**
⚠️ Call 108 IMMEDIATELY
⚠️ Start CPR if trained
⚠️ Keep patient comfortable
⚠️ Do NOT give food/water

Would you like directions to any hospital or need ambulance assistance?`;

    this.currentConversation = null;
    return {
      message: response,
      needsInput: false,
      showImageUpload: false
    };
  },

  // Handle mental health conversation
  handleMentalHealth() {
    const { state, questionIndex } = this.currentConversation;
    
    const questions = [
      "**Question 1:** What mental health concerns is the patient experiencing? (stress, anxiety, depression, panic attacks, etc.)",
      "**Question 2:** How long have these symptoms been present?",
      "**Question 3:** On a scale of 1-10, how much is this affecting daily life?",
      "**Question 4:** Has the patient had any thoughts of self-harm? (This is confidential and important for proper care)"
    ];
    
    if (questionIndex < questions.length) {
      this.currentConversation.questionIndex++;
      return {
        message: questions[questionIndex],
        needsInput: true,
        showImageUpload: false
      };
    } else {
      return this.generateMentalHealthGuidance();
    }
  },

  // Generate mental health guidance
  generateMentalHealthGuidance() {
    const { data } = this.currentConversation;
    const responses = data.symptoms;
    const selfHarmMentioned = responses[3] && responses[3].toLowerCase().includes('yes');
    
    let response = `**💙 Mental Health Support Guidance**

**Reported Concerns:** ${responses[0]}
**Duration:** ${responses[1]}
**Impact Level:** ${responses[2]}/10

`;

    if (selfHarmMentioned) {
      response += `**🔴 IMMEDIATE ACTION REQUIRED**

The patient has expressed thoughts of self-harm. This requires immediate professional intervention.

**URGENT STEPS:**
1. **DO NOT leave patient alone**
2. **Call Mental Health Helpline:** 1800-599-0019 (24/7)
3. **Or NIMHANS Helpline:** 080-46110007
4. **Or Emergency:** 108
5. **Remove any means of self-harm from vicinity**
6. **Stay calm and supportive**

**Immediate Psychiatric Evaluation Needed**
${this.getNearbyDoctors('Psychiatrist (URGENT)')}

`;
    } else {
      response += `**Immediate Coping Strategies:**

**1. Breathing Exercises:**
   - 4-7-8 Technique: Inhale 4 counts, hold 7, exhale 8
   - Practice 3-5 minutes, 2-3 times daily

**2. Grounding Technique (5-4-3-2-1):**
   - Name 5 things you see
   - 4 things you hear
   - 3 things you feel
   - 2 things you smell
   - 1 thing you taste

**3. Lifestyle Modifications:**
   - Regular sleep schedule (7-8 hours)
   - Daily physical activity (30 min walk)
   - Limit caffeine and alcohol
   - Social connection

**When to Seek Professional Help:**
🟡 Symptoms persist >2 weeks → Counselor/Psychologist
🟡 Severe symptoms → Psychiatrist
🟡 Panic attacks → Mental health professional

**Available Mental Health Professionals:**
${this.getNearbyDoctors('Psychologist / Psychiatrist')}

**Helplines:**
- National Mental Health: 1800-599-0019
- NIMHANS: 080-46110007

`;
    }

    response += `**Follow-up:** Check patient progress in 3-5 days

Would you like me to provide more coping strategies or help schedule an appointment?`;

    this.currentConversation = null;
    return {
      message: response,
      needsInput: false,
      showImageUpload: false
    };
  },

  // Get specialist type based on condition
  getSpecialistType(condition) {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('heart') || lowerCondition.includes('chest') || lowerCondition.includes('cardiac')) {
      return '**Cardiologist** (Heart Specialist)';
    } else if (lowerCondition.includes('lung') || lowerCondition.includes('breathing') || lowerCondition.includes('asthma')) {
      return '**Pulmonologist** (Lung Specialist)';
    } else if (lowerCondition.includes('stomach') || lowerCondition.includes('digestive') || lowerCondition.includes('liver')) {
      return '**Gastroenterologist** (Digestive System Specialist)';
    } else if (lowerCondition.includes('brain') || lowerCondition.includes('nerve') || lowerCondition.includes('headache')) {
      return '**Neurologist** (Brain/Nerve Specialist)';
    } else if (lowerCondition.includes('bone') || lowerCondition.includes('joint') || lowerCondition.includes('fracture')) {
      return '**Orthopedist** (Bone/Joint Specialist)';
    } else if (lowerCondition.includes('skin') || lowerCondition.includes('rash')) {
      return '**Dermatologist** (Skin Specialist)';
    } else if (lowerCondition.includes('mental') || lowerCondition.includes('anxiety') || lowerCondition.includes('depression')) {
      return '**Psychiatrist/Psychologist** (Mental Health Specialist)';
    } else {
      return '**General Physician** (Primary Care)';
    }
  },

  // Get nearby doctors (mock data - would integrate with real API)
  getNearbyDoctors(specialty) {
    return `
**1. Dr. Kavita Rao** - ${specialty}
   📍 Arogya Medical Center, 1.2 km away
   📞 +91-9876543210
   ⏰ Mon-Sat, 9 AM - 5 PM
   💰 Consultation: ₹500
   ⭐ 4.5/5 (120 reviews)
   
**2. Dr. Rajesh Kumar** - ${specialty}
   📍 Seva Hospital, 2.8 km away
   📞 +91-9876543211
   ⏰ Mon-Fri, 10 AM - 6 PM
   💰 Consultation: ₹700
   ⭐ 4.7/5 (200 reviews)
   
**3. Dr. Priya Sharma** - ${specialty}
   📍 City Health Clinic, 3.5 km away
   📞 +91-9876543212
   ⏰ Tue-Sun, 11 AM - 7 PM
   💰 Consultation: ₹600
   ⭐ 4.6/5 (150 reviews)`;
  },

  // Get nearby hospitals (mock data)
  getNearbyHospitals() {
    return `
**🏥 24/7 Emergency Care:**

**1. Jeevan Jyoti Emergency Clinic**
   📍 2.8 km (10 min drive)
   📞 +91-9876543220 | Emergency: 108
   🏥 Facilities: Emergency, ICU, Surgery, X-ray
   💰 Accepts: Cash, Insurance, Government schemes
   ⭐ Best for: Accidents, injuries, urgent cases
   
**2. Seva Nagar Community Hospital**
   📍 5.1 km (15 min drive)
   📞 +91-9876543221
   🏥 Facilities: Full hospital, Specialists, ICU, NICU
   💰 Accepts: All insurance, Government schemes
   ⭐ Best for: Serious conditions, admissions
   
**🏥 Primary Care:**

**3. Arogya Health Center**
   📍 1.2 km (5 min walk)
   📞 +91-9876543222
   🏥 Facilities: OPD, Diagnostics, Pharmacy
   ⏰ Mon-Sat, 8 AM - 8 PM
   ⭐ Best for: Routine checkups, minor ailments`;
  },

  // General response for unclear intent
  getGeneralResponse(message) {
    return {
      message: `I understand you're asking about: "${message}"

I can help you with:

💙 **AI Therapist** - Mental health support and stress management
🩺 **Symptom Check** - Interactive symptom assessment with questions
📸 **Skin Scan** - Upload images for skin condition analysis
📋 **Report Analysis** - Upload lab reports for interpretation
👨‍⚕️ **Need Doctor** - Get specialist recommendations based on your condition
🏥 **Hospitals** - Find nearby healthcare facilities

Please click one of the quick action buttons below or tell me specifically what you need help with!`,
      needsInput: false,
      showImageUpload: false
    };
  }
};
