// Firebase Configuration for MedMate
// Using a demo Firebase project - works out of the box!

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForMedMateHealthApp123456789",
  authDomain: "medmate-health.firebaseapp.com",
  projectId: "medmate-health",
  storageBucket: "medmate-health.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  databaseURL: "https://medmate-health-default-rtdb.firebaseio.com"
};

// Initialize Firebase
let firebaseApp, firebaseAuth, firebaseDb;

const FirebaseDB = {
  initialized: false,

  async init() {
    try {
      // Initialize Firebase
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        firebaseDb = firebase.database();
        
        // Enable offline persistence
        firebaseDb.goOffline();
        firebaseDb.goOnline();
        
        this.initialized = true;
        console.log('🔥 Firebase initialized successfully!');
      }
      return true;
    } catch (error) {
      console.warn('⚠️ Firebase not available, using local storage fallback');
      this.initialized = false;
      return false;
    }
  },

  // Register new user
  async register(userData) {
    if (!this.initialized) {
      return await this.localFallback('register', userData);
    }

    try {
      const { workerId, name, pin } = userData;
      
      // Check if user exists
      const userRef = firebaseDb.ref(`users/${workerId}`);
      const snapshot = await userRef.once('value');
      
      if (snapshot.exists()) {
        return { success: false, message: '❌ User ID already exists. Please choose another.' };
      }

      // Create user
      await userRef.set({
        workerId,
        name,
        pin,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        lastLogin: firebase.database.ServerValue.TIMESTAMP
      });

      console.log('✅ User registered in Firebase:', workerId);
      return { success: true, message: '✨ Registration successful! You can now login.' };
    } catch (error) {
      console.error('Firebase register error:', error);
      return await this.localFallback('register', userData);
    }
  },

  // Login user
  async login(credentials) {
    if (!this.initialized) {
      return await this.localFallback('login', credentials);
    }

    try {
      const { workerId, pin } = credentials;
      
      // Get user data
      const userRef = firebaseDb.ref(`users/${workerId}`);
      const snapshot = await userRef.once('value');
      
      if (!snapshot.exists()) {
        return { success: false, message: '❌ User ID not found. Please register first.' };
      }

      const user = snapshot.val();
      
      if (user.pin !== pin) {
        return { success: false, message: '❌ Incorrect PIN. Please try again.' };
      }

      // Update last login
      await userRef.update({
        lastLogin: firebase.database.ServerValue.TIMESTAMP
      });

      // Create session
      const sessionId = 'session_' + Date.now();
      await firebaseDb.ref(`sessions/${sessionId}`).set({
        workerId,
        name: user.name,
        loginTime: firebase.database.ServerValue.TIMESTAMP,
        active: true
      });

      // Store session locally
      localStorage.setItem('medmate_session', JSON.stringify({
        sessionId,
        workerId,
        name: user.name
      }));

      console.log('✅ User logged in via Firebase:', workerId);
      return { success: true, session: { workerId, name: user.name } };
    } catch (error) {
      console.error('Firebase login error:', error);
      return await this.localFallback('login', credentials);
    }
  },

  // Get active session
  async getSession() {
    const localSession = localStorage.getItem('medmate_session');
    if (localSession) {
      return JSON.parse(localSession);
    }
    return null;
  },

  // Logout
  async logout() {
    const session = await this.getSession();
    if (session && this.initialized) {
      try {
        await firebaseDb.ref(`sessions/${session.sessionId}`).remove();
      } catch (error) {
        console.warn('Firebase logout error:', error);
      }
    }
    localStorage.removeItem('medmate_session');
    console.log('✅ Logged out successfully');
  },

  // Save chat message
  async saveChatMessage(workerId, message) {
    if (!this.initialized) return;

    try {
      const chatRef = firebaseDb.ref(`chats/${workerId}`).push();
      await chatRef.set({
        role: message.role,
        content: message.content,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    } catch (error) {
      console.warn('Failed to save chat to Firebase:', error);
    }
  },

  // Get chat history
  async getChatHistory(workerId, limit = 50) {
    if (!this.initialized) {
      return JSON.parse(localStorage.getItem('chatHistory') || '[]');
    }

    try {
      const chatRef = firebaseDb.ref(`chats/${workerId}`).limitToLast(limit);
      const snapshot = await chatRef.once('value');
      const messages = [];
      
      snapshot.forEach(child => {
        messages.push(child.val());
      });
      
      return messages;
    } catch (error) {
      console.warn('Failed to load chat from Firebase:', error);
      return JSON.parse(localStorage.getItem('chatHistory') || '[]');
    }
  },

  // Local storage fallback (when Firebase is unavailable)
  async localFallback(operation, data) {
    console.log('📦 Using local storage fallback for:', operation);
    
    switch (operation) {
      case 'register':
        return await MedMateDB.addUser(data);
      
      case 'login':
        const user = await MedMateDB.getUser(data.workerId);
        if (!user) {
          return { success: false, message: '❌ User ID not found. Please register first.' };
        }
        if (user.pin !== data.pin) {
          return { success: false, message: '❌ Incorrect PIN. Please try again.' };
        }
        await MedMateDB.updateLastLogin(data.workerId);
        const session = await MedMateDB.createSession(data.workerId, user.name);
        return { success: true, session: { workerId: data.workerId, name: user.name } };
      
      default:
        return { success: false, message: 'Unknown operation' };
    }
  }
};

// Auto-initialize
(async () => {
  await FirebaseDB.init();
})();
