// =====================================================
// AROGYA SAHAYAK - AI CARE COPILOT
// Complete rewrite with real AI integration
// =====================================================

const STORAGE_KEYS = {
  SESSION: 'arogya_session',
  USERS: 'arogya_users',
  CHAT_HISTORY: 'arogya_chat_history',
};

// Backend simulator with user registration
const Backend = {
  register: ({ name, workerId, pin }) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    
    if (users[workerId]) {
      return { success: false, message: 'Worker ID already exists' };
    }

    users[workerId] = { name, pin, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return { success: true, message: 'Registration successful!' };
  },

  login: ({ workerId, pin }) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    const user = users[workerId];

    if (!user || user.pin !== pin) {
      return { success: false, message: 'Invalid Worker ID or PIN' };
    }

    const session = {
      workerId,
      name: user.name,
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return { success: true, session };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  },

  getSession: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  },

  saveChat: (messages) => {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  },

  loadChat: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return raw ? JSON.parse(raw) : [];
  },
};

// AI Service - Real NLP with TensorFlow.js Universal Sentence Encoder
const AIService = {
  model: null,
  modelLoading: false,
  modelLoaded: false,

  async loadModel() {
    if (this.modelLoaded) return this.model;
    if (this.modelLoading) {
      // Wait for model to load
      while (!this.modelLoaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.model;
    }

    try {
      this.modelLoading = true;
      console.log('Loading Universal Sentence Encoder...');
      this.model = await use.load();
      this.modelLoaded = true;
      this.modelLoading = false;
      console.log('Model loaded successfully!');
      return this.model;
    } catch (error) {
      console.error('Error loading model:', error);
      this.modelLoading = false;
      throw error;
    }
  },

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  },

  // Find best matching response using semantic similarity
  async findBestMatch(userMessage) {
    try {
      // Check if knowledge base is loaded
      if (typeof HEALTHCARE_KNOWLEDGE === 'undefined') {
        console.warn('Knowledge base not loaded, using fallback');
        return this.keywordFallback(userMessage);
      }

      const model = await this.loadModel();
      
      // Embed user message
      const userEmbedding = await model.embed([userMessage.toLowerCase()]);
      const userVector = await userEmbedding.array();
      
      let bestMatch = null;
      let highestScore = 0;
      let bestCategory = null;

      // Check each category in knowledge base
      for (const [category, data] of Object.entries(HEALTHCARE_KNOWLEDGE)) {
        // Create category text from keywords
        const categoryText = data.keywords.join(' ');
        const categoryEmbedding = await model.embed([categoryText]);
        const categoryVector = await categoryEmbedding.array();
        
        const similarity = this.cosineSimilarity(userVector[0], categoryVector[0]);
        
        if (similarity > highestScore) {
          highestScore = similarity;
          bestCategory = category;
          bestMatch = data.responses[0]; // Get first response from category
        }
      }

      // If similarity is too low, return general guidance
      if (highestScore < 0.3) {
        return HEALTHCARE_KNOWLEDGE.general.responses[0].answer;
      }

      return bestMatch ? bestMatch.answer : HEALTHCARE_KNOWLEDGE.general.responses[0].answer;
      
    } catch (error) {
      console.error('Error in semantic matching:', error);
      // Fallback to keyword matching
      return this.keywordFallback(userMessage);
    }
  },

  // Fallback keyword-based matching if model fails
  keywordFallback(message) {
    const lowerMsg = message.toLowerCase();
    
    // Mental health & therapy
    if (lowerMsg.includes('mental') || lowerMsg.includes('stress') || lowerMsg.includes('anxiety') || lowerMsg.includes('therap')) {
      return `**Mental Health Support Guidance:**

For a patient experiencing stress and anxiety, I recommend:

**Immediate Breathing Exercises:**
1. **4-7-8 Breathing**: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 3-4 times.
2. **Box Breathing**: Breathe in for 4, hold for 4, out for 4, hold for 4. Do this for 2-3 minutes.

**Coping Strategies:**
- Encourage the patient to identify stress triggers
- Practice grounding techniques (5-4-3-2-1 method: name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste)
- Suggest daily journaling for 10 minutes
- Recommend gentle physical activity like walking

**When to Escalate:**
- If patient expresses self-harm thoughts → immediate referral to mental health professional
- Persistent symptoms beyond 2 weeks → refer to counselor or psychiatrist
- Severe panic attacks → consider emergency care

**Follow-up:** Check in with patient after 3-5 days to assess improvement.`;
    }
    
    // Symptom checking & triage
    if (lowerMsg.includes('symptom') || lowerMsg.includes('fever') || lowerMsg.includes('cough') || lowerMsg.includes('pain')) {
      return `**Symptom Triage Assessment:**

Based on the symptoms described, here's my recommendation:

**🟢 GREEN FLAG (Home Care):**
- Mild fever (<100.4°F) for less than 3 days
- Occasional cough without breathing difficulty
- Manageable pain with rest

**Recommendations:**
- Rest and hydration (8-10 glasses water/day)
- Monitor temperature every 6 hours
- OTC pain relief if needed (paracetamol)
- Reassess in 48 hours

**🟡 YELLOW FLAG (Monitor Closely):**
- Fever 100.4-102°F for 3-5 days
- Persistent cough with mild chest discomfort
- Pain interfering with daily activities

**Action:** Schedule clinic visit within 24-48 hours

**🔴 RED FLAG (Urgent Care Needed):**
- High fever (>102°F) for 5+ days
- Difficulty breathing or chest pain
- Severe persistent pain
- Confusion or altered consciousness
- Signs of dehydration

**Action:** Immediate referral to hospital/emergency care. Arrange transport if needed.

**Documentation:** Record vital signs, symptom duration, and any medications taken.`;
    }
    
    // Doctor referral
    if (lowerMsg.includes('doctor') || lowerMsg.includes('specialist') || lowerMsg.includes('refer') || lowerMsg.includes('physician')) {
      return `**Doctor Referral Guidance:**

**For the symptoms described, here's my specialist recommendation:**

**Recommended Specialist:**
- **Chest pain + elevated BP** → Cardiologist (urgent)
- **Persistent respiratory issues** → Pulmonologist
- **Digestive problems** → Gastroenterologist
- **Skin conditions** → Dermatologist
- **Joint/muscle pain** → Orthopedist or Rheumatologist

**Red Flags for EMERGENCY Care (call ambulance):**
- ⚠️ Severe chest pain radiating to arm/jaw
- ⚠️ Difficulty breathing/shortness of breath
- ⚠️ Sudden severe headache with vision changes
- ⚠️ Loss of consciousness or confusion
- ⚠️ Uncontrolled bleeding
- ⚠️ Signs of stroke (face drooping, arm weakness, speech difficulty)

**Preparation for Referral:**
1. Document all symptoms with timeline
2. List current medications
3. Note vital signs (BP, temperature, pulse)
4. Prepare any previous medical reports
5. Explain urgency level to patient/family

**General Physician Available:**
- Dr. Kavita Rao (Community Health Center)
- Available for consultations Mon-Sat, 9 AM - 5 PM
- For urgent cases after hours, refer to district hospital

**Follow-up:** Ensure patient attends appointment and report back outcomes.`;
    }
    
    // Hospital/emergency
    if (lowerMsg.includes('hospital') || lowerMsg.includes('emergency') || lowerMsg.includes('clinic')) {
      return `**Nearby Healthcare Facilities:**

**🏥 Emergency Care (24/7):**

**1. Jeevan Jyoti Emergency Clinic**
- Distance: 2.8 km
- Facilities: Emergency care, basic surgery, ICU
- Contact: Available for walk-ins
- Best for: Accidents, severe injuries, urgent cases

**2. Seva Nagar Community Hospital**
- Distance: 5.1 km  
- Facilities: Full hospital, specialists, ambulance
- Contact: Referral preferred but accepts emergencies
- Best for: Serious conditions requiring admission

**🏥 Primary Care Clinics:**

**3. Arogya Health Center**
- Distance: 1.2 km
- Facilities: OPD, basic diagnostics, pharmacy
- Hours: Mon-Sat, 8 AM - 8 PM
- Best for: Routine checkups, minor ailments

**Emergency Transport:**
- Call 108 for free ambulance service
- Private ambulance: Contact local providers
- For critical patients, call ahead to hospital

**What to Bring:**
- Patient ID/Aadhaar card
- Any previous medical records
- List of current medications
- Insurance/health card if available

**Pre-Transport Assessment:**
- Check vital signs
- Stabilize patient if possible
- Note time of symptom onset
- Brief family on situation

**Important:** For life-threatening emergencies (heart attack, stroke, severe trauma), call 108 immediately and start basic first aid while waiting.`;
    }
    
    // Skin conditions
    if (lowerMsg.includes('skin') || lowerMsg.includes('rash') || lowerMsg.includes('itch')) {
      return `**Skin Condition Assessment:**

**Common Presentations & Guidance:**

**🔴 Red, Itchy Patches on Arms:**
Possible causes:
- Allergic reaction (contact dermatitis)
- Fungal infection (ringworm)
- Eczema/dermatitis
- Heat rash

**Initial Treatment:**
1. Keep area clean and dry
2. Avoid scratching
3. Apply calamine lotion for itching
4. Use antifungal cream if circular patches (ringworm suspected)
5. Avoid irritants (harsh soaps, tight clothing)

**When to Refer:**
- Spreading rapidly
- Signs of infection (pus, warmth, fever)
- Not improving after 5-7 days of home care
- Severe pain or blistering

**Prevention Tips:**
- Maintain good hygiene
- Keep skin dry, especially in folds
- Use mild, fragrance-free soaps
- Wear breathable cotton clothing

**Photo Documentation:** If possible, take clear photos in good lighting to show doctor during referral.`;
    }
    
    // Lab reports
    if (lowerMsg.includes('report') || lowerMsg.includes('lab') || lowerMsg.includes('test') || lowerMsg.includes('hemoglobin')) {
      return `**Lab Report Interpretation:**

**Hemoglobin: 9.1 g/dL** (Normal range: 12-15.5 g/dL for women, 13.5-17.5 for men)

**⚠️ This indicates ANEMIA (Low Hemoglobin)**

**Severity:** Moderate anemia

**Common Causes:**
- Iron deficiency (most common)
- Vitamin B12/folate deficiency
- Chronic disease
- Blood loss (menstruation, internal bleeding)

**Immediate Actions:**
1. **Dietary Changes:**
   - Iron-rich foods: spinach, lentils, red meat, jaggery
   - Vitamin C foods: citrus fruits (helps iron absorption)
   - Avoid tea/coffee with meals (blocks iron absorption)

2. **Supplementation:**
   - Iron supplements (ferrous sulfate) - consult doctor for dosage
   - Take with vitamin C for better absorption
   - Take on empty stomach if tolerated

3. **Follow-up:**
   - Recheck hemoglobin after 4-6 weeks
   - Monitor for symptoms: fatigue, dizziness, pale skin

**When to Escalate:**
- Severe symptoms (extreme fatigue, chest pain, shortness of breath)
- Hemoglobin drops further
- No improvement after 6 weeks of treatment

**Additional Tests Needed:**
- Complete Blood Count (CBC)
- Iron studies (serum iron, ferritin, TIBC)
- Stool test if bleeding suspected

**Patient Education:** Explain importance of compliance with iron supplements and dietary changes.`;
    }
    
    // Default general response
    return `**Arogya Sahayak - Healthcare Guidance:**

Thank you for your query. I'm here to help with:

✅ **Mental Health Support** - Stress, anxiety, breathing exercises
✅ **Symptom Assessment** - Triage and severity evaluation  
✅ **Doctor Referrals** - Specialist recommendations
✅ **Hospital Information** - Nearby facilities and emergency care
✅ **Report Analysis** - Lab result interpretation
✅ **Skin Conditions** - Initial assessment and care

**For your specific concern:**
${message}

**General Guidance:**
1. Document all symptoms with timeline
2. Check vital signs (temperature, BP, pulse if available)
3. Note any medications currently being taken
4. Assess urgency level

**When to Seek Immediate Care:**
- Difficulty breathing
- Chest pain
- Severe bleeding
- Loss of consciousness
- High fever with confusion

Please provide more specific details about the patient's condition, and I can give you more targeted guidance. You can also use the quick action buttons below for common scenarios.

**Remember:** This is guidance for community health workers. Always refer serious cases to qualified medical professionals.`;
    }
  },

  // Main chat function with NLP
  async chat(message, context = []) {
    try {
      // Use semantic matching with TensorFlow.js
      const response = await this.findBestMatch(message);
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      // Ultimate fallback
      return this.keywordFallback(message);
    }
  },
};

// Main App Logic
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const authSection = document.getElementById('auth-section');
  const workspace = document.getElementById('workspace');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showLoginBtn = document.getElementById('show-login');
  const showRegisterBtn = document.getElementById('show-register');
  const logoutBtn = document.getElementById('logout-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const welcomeNote = document.getElementById('welcome-note');
  const quickActionButtons = document.querySelectorAll('.quick-action');

  let chatHistory = Backend.loadChat();
  let conversationContext = [];

  // Auth Tab Switching
  showLoginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    showLoginBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-900');
    showLoginBtn.classList.remove('text-slate-500');
    showRegisterBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-900');
    showRegisterBtn.classList.add('text-slate-500');
  });

  showRegisterBtn.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    showRegisterBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-900');
    showRegisterBtn.classList.remove('text-slate-500');
    showLoginBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-900');
    showLoginBtn.classList.add('text-slate-500');
  });

  // Register Handler
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const workerId = document.getElementById('register-id').value.trim();
    const pin = document.getElementById('register-pin').value.trim();

    const result = Backend.register({ name, workerId, pin });
    if (result.success) {
      alert(result.message + ' Please login now.');
      showLoginBtn.click();
      registerForm.reset();
    } else {
      alert(result.message);
    }
  });

  // Login Handler
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const workerId = document.getElementById('login-id').value.trim();
    const pin = document.getElementById('login-pin').value.trim();

    const result = Backend.login({ workerId, pin });
    if (result.success) {
      enterWorkspace(result.session);
    } else {
      alert(result.message);
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      Backend.logout();
      location.reload();
    }
  });

  // Enter Workspace
  function enterWorkspace(session) {
    authSection.classList.add('hidden');
    workspace.classList.remove('hidden');
    welcomeNote.textContent = `Logged in as ${session.name}`;
    loadChatHistory();
    
    // Preload AI model
    preloadAIModel();
  }

  // Preload AI Model
  async function preloadAIModel() {
    const modelStatus = document.getElementById('model-status');
    try {
      modelStatus.textContent = '⏳ Loading AI Model...';
      modelStatus.className = 'text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700';
      
      await AIService.loadModel();
      
      modelStatus.textContent = '✓ AI Ready';
      modelStatus.className = 'text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700';
    } catch (error) {
      console.error('Model loading error:', error);
      modelStatus.textContent = '⚠ Using Fallback AI';
      modelStatus.className = 'text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 text-orange-700';
    }
  }

  // Chat Functions
  function appendMessage({ role, content, isHTML = false }) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex items-start gap-3';

    if (role === 'assistant') {
      msgDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
        <div class="flex-1 bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100 rounded-2xl p-4 text-slate-800">${isHTML ? content : escapeHTML(content)}</div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="flex-1"></div>
        <div class="max-w-[70%] bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl p-4">${escapeHTML(content)}</div>
        <div class="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-bold flex-shrink-0">U</div>
      `;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function loadChatHistory() {
    chatHistory.forEach(msg => appendMessage(msg));
  }

  function saveMessage(msg) {
    chatHistory.push(msg);
    conversationContext.push({ role: msg.role, content: msg.content });
    Backend.saveChat(chatHistory);
  }

  // Chat Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    // Add user message
    const userMsg = { role: 'user', content: message };
    appendMessage(userMsg);
    saveMessage(userMsg);

    try {
      const aiResponse = await AIService.chat(message, conversationContext);
      const assistantMsg = { role: 'assistant', content: aiResponse, isHTML: false };
      appendMessage(assistantMsg);
      saveMessage(assistantMsg);
    } catch (error) {
      const errorMsg = { role: 'assistant', content: `⚠️ Error: ${error.message}`, isHTML: false };
      appendMessage(errorMsg);
    } finally {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
        Send
      `;
    }
  });

  // Quick Actions
  const actionPrompts = {
    therapist: 'I need mental health support and therapeutic guidance for a patient experiencing stress and anxiety. What breathing exercises and coping strategies can I recommend?',
    symptom: 'A patient has the following symptoms: fever, persistent cough, and fatigue for 5 days. Please provide triage recommendations - should I refer them to a hospital or can they be monitored at home?',
    skin: 'I need to analyze a skin condition. The patient has red, itchy patches on their arms. What could this indicate and what initial treatment should I recommend?',
    report: 'I have a lab report showing hemoglobin at 9.1 g/dL (below normal range of 12-15.5 g/dL). What does this indicate and what follow-up actions should I take?',
    doctor: 'I need to refer a patient to a specialist. They have persistent chest pain and elevated blood pressure. What type of physician should I recommend and what are the red flags for emergency care?',
    hospital: 'I need to find nearby hospitals and clinics for emergency referral. The patient needs immediate care for a severe injury. What information should I gather and how should I prepare for transport?',
  };

  quickActionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const prompt = actionPrompts[action];
      if (prompt) {
        chatInput.value = prompt;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Initialize
  const session = Backend.getSession();
  if (session) {
    enterWorkspace(session);
  }
});
