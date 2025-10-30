// =====================================================
// AROGYA SAHAYAK - AI CARE COPILOT
// Simplified version with working AI
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

// AI Service - Uses real Gemini AI
const AIService = {
  currentImageData: null,

  async chat(message, context = [], imageData = null) {
    try {
      // Use real Gemini AI if available
      if (typeof RealConversationalAI !== 'undefined') {
        const response = await RealConversationalAI.processMessage(message, imageData);
        return response;
      }

      // Fallback to simple response
      return this.getDefaultResponse(message);

    } catch (error) {
      console.error('AI error:', error);
      return {
        message: `I apologize, but I encountered an error: ${error.message}\n\nPlease try again or rephrase your question.`,
        showImageUpload: false
      };
    }
  },

  getDefaultResponse(message) {
    return {
      message: `**Arogya Sahayak - Healthcare Assistant**

Thank you for your question: "${message}"

I'm here to help with:
- Mental health support
- Symptom assessment
- Doctor referrals
- Hospital information
- Lab report interpretation
- Skin condition guidance

Please use the quick action buttons below or provide more details about the patient's condition for specific guidance.

**For emergencies, call 108 immediately.**`,
      needsInput: false,
      showImageUpload: false
    };
  }
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
  const modelStatus = document.getElementById('model-status');

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
    welcomeNote.textContent = `Hey ${session.name}! 👋 Ready to help you stay healthy!`;
    loadChatHistory();
    
    // Update model status
    if (modelStatus) {
      modelStatus.textContent = '✓ AI Ready';
      modelStatus.className = 'text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700';
    }
  }

  // Chat Functions
  function appendMessage({ role, content, isHTML = false }) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex items-start gap-3';

    if (role === 'assistant') {
      // AI responses - render HTML tags like <b>, <i>, <br>
      msgDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
        <div class="flex-1 bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100 rounded-2xl p-4 text-slate-800">${content}</div>
      `;
    } else {
      // User messages - escape HTML for safety
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
      
      // Handle response object from conversational AI
      let responseText = '';
      let showUploadBtn = false;
      let uploadType = '';
      
      if (typeof aiResponse === 'object' && aiResponse.message) {
        responseText = aiResponse.message;
        showUploadBtn = aiResponse.showImageUpload || false;
        uploadType = aiResponse.uploadType || '';
      } else {
        responseText = aiResponse;
      }
      
      const assistantMsg = { role: 'assistant', content: responseText, isHTML: false };
      appendMessage(assistantMsg);
      saveMessage(assistantMsg);
      
      // Show image upload button if needed
      if (showUploadBtn) {
        showImageUploadButton(uploadType);
      }
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
    therapist: "I'm feeling stressed and anxious. Can you help me?",
    symptom: "I'm not feeling well. Can you help me understand what's wrong?",
    skin: "I have a skin condition I'd like you to look at. Can I upload a photo?",
    report: "I have my lab test results. Can you help me understand what they mean?",
    doctor: "I need to see a doctor. Can you recommend the right specialist for me?",
    hospital: "I need to find a hospital nearby. Can you help?",
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

  // Image upload functionality
  function showImageUploadButton(uploadType) {
    const uploadBtn = document.createElement('div');
    uploadBtn.className = 'flex items-center justify-center my-4';
    uploadBtn.innerHTML = `
      <label for="image-upload" class="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
          <path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>
        ${uploadType === 'skin' ? '📷 Upload Skin Image' : '📄 Upload Lab Report'}
      </label>
      <input type="file" id="image-upload" accept="image/*" class="hidden" />
    `;
    
    chatMessages.appendChild(uploadBtn);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Handle file selection
    const fileInput = document.getElementById('image-upload');
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await handleImageUpload(file, uploadType);
        uploadBtn.remove();
      }
    });
  }

  async function handleImageUpload(file, uploadType) {
    // Show uploading message
    const uploadingMsg = { role: 'user', content: `📤 Uploading ${uploadType === 'skin' ? 'skin image' : 'lab report'}...` };
    appendMessage(uploadingMsg);
    
    // Read image as base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageBase64 = e.target.result;
      
      // Create image preview
      const imagePreview = document.createElement('div');
      imagePreview.className = 'flex items-start gap-3 my-2';
      imagePreview.innerHTML = `
        <div class="flex-1"></div>
        <div class="max-w-[70%] bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl p-4">
          <p class="mb-2">✓ Image uploaded successfully!</p>
          <img src="${imageBase64}" alt="Uploaded image" class="rounded-lg max-w-full h-auto max-h-64 object-contain" />
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-bold flex-shrink-0">U</div>
      `;
      chatMessages.appendChild(imagePreview);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Show analyzing message
      const analyzingMsg = { role: 'assistant', content: '🔍 Analyzing image with AI... This may take a few seconds.' };
      appendMessage(analyzingMsg);
      
      try {
        // Send image to Gemini AI for analysis
        const aiResponse = await AIService.chat('Analyze this image', conversationContext, imageBase64);
        
        let responseText = '';
        if (typeof aiResponse === 'object' && aiResponse.message) {
          responseText = aiResponse.message;
        } else {
          responseText = aiResponse;
        }
        
        const assistantMsg = { role: 'assistant', content: responseText, isHTML: false };
        appendMessage(assistantMsg);
        saveMessage(assistantMsg);
      } catch (error) {
        const errorMsg = { role: 'assistant', content: `⚠️ Error analyzing image: ${error.message}\n\nPlease try again or upload a different image.` };
        appendMessage(errorMsg);
      }
    };
    reader.readAsDataURL(file);
  }

  // Initialize
  const session = Backend.getSession();
  if (session) {
    enterWorkspace(session);
  }
});
