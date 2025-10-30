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

// AI Service - Google Gemini API
const AIService = {
  apiKey: 'AIzaSyAiF-X7LEqcN_9_79-V_BqLgz8ZH9genb8',
  preferredModel: 'models/gemini-1.5-flash-latest', // fast, widely available

  async ensureModel() {
    // Avoid extra requests and credits: pin to flash-latest on v1beta
    this.preferredModel = 'models/gemini-1.5-flash-latest';
    localStorage.setItem('arogya_model', this.preferredModel);
    return this.preferredModel;
  },

  async chat(message, context = []) {
    const systemPrompt = `You are Arogya Sahayak, an AI health assistant for community health workers in India. You provide:
- Mental health support and therapy guidance
- Symptom triage and medical recommendations
- Analysis of medical reports
- Doctor and hospital referrals
- Emergency care guidance

Always be empathetic, clear, and provide actionable advice. When unsure, recommend professional medical consultation.`;

    try {
      const model = await this.ensureModel();
      // Build full prompt with system context and conversation history
      let fullPrompt = systemPrompt + '\n\n';
      context.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
      });
      fullPrompt += `User: ${message}\n\nAssistant:`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'AI request failed');
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || data?.candidates?.[0]?.output_text
        || '';
      if (!text) throw new Error('Empty AI response');
      return text;
    } catch (error) {
      console.error('AI Service error:', error);
      throw error;
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
