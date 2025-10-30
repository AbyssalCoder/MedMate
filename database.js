// IndexedDB Database for MedMate
const MedMateDB = {
  dbName: 'MedMateDB',
  version: 1,
  db: null,

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Database failed to open');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database opened successfully');
        resolve(this.db);
      };

      // Create object stores if they don't exist
      request.onupgradeneeded = (e) => {
        this.db = e.target.result;
        console.log('📦 Creating database stores...');

        // Users store
        if (!this.db.objectStoreNames.contains('users')) {
          const usersStore = this.db.createObjectStore('users', { keyPath: 'workerId' });
          usersStore.createIndex('workerId', 'workerId', { unique: true });
          console.log('✅ Users store created');
        }

        // Sessions store
        if (!this.db.objectStoreNames.contains('sessions')) {
          const sessionsStore = this.db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('workerId', 'workerId', { unique: false });
          console.log('✅ Sessions store created');
        }

        // Chat history store
        if (!this.db.objectStoreNames.contains('chatHistory')) {
          const chatStore = this.db.createObjectStore('chatHistory', { keyPath: 'id', autoIncrement: true });
          chatStore.createIndex('workerId', 'workerId', { unique: false });
          chatStore.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('✅ Chat history store created');
        }
      };
    });
  },

  // Add a new user
  async addUser(userData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      
      const user = {
        workerId: userData.workerId,
        name: userData.name,
        pin: userData.pin,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const request = store.add(user);

      request.onsuccess = () => {
        console.log('✅ User registered:', userData.workerId);
        resolve({ success: true, user });
      };

      request.onerror = () => {
        console.error('❌ Failed to register user');
        reject({ success: false, message: 'User ID already exists' });
      };
    });
  },

  // Get user by ID
  async getUser(workerId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(workerId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Update user's last login
  async updateLastLogin(workerId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const getRequest = store.get(workerId);

      getRequest.onsuccess = () => {
        const user = getRequest.result;
        if (user) {
          user.lastLogin = new Date().toISOString();
          const updateRequest = store.put(user);
          
          updateRequest.onsuccess = () => {
            resolve(user);
          };
          
          updateRequest.onerror = () => {
            reject(updateRequest.error);
          };
        } else {
          reject(new Error('User not found'));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  },

  // Create session
  async createSession(workerId, name) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      
      const session = {
        id: 'session_' + Date.now(),
        workerId: workerId,
        name: name,
        loginTime: new Date().toISOString(),
        active: true
      };

      const request = store.put(session);

      request.onsuccess = () => {
        console.log('✅ Session created');
        resolve(session);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Get active session
  async getActiveSession() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions = request.result;
        const activeSession = sessions.find(s => s.active);
        resolve(activeSession || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Clear all sessions (logout)
  async clearSessions() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.clear();

      request.onsuccess = () => {
        console.log('✅ Sessions cleared');
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Save chat message
  async saveChatMessage(workerId, message) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chatHistory'], 'readwrite');
      const store = transaction.objectStore('chatHistory');
      
      const chatEntry = {
        workerId: workerId,
        role: message.role,
        content: message.content,
        timestamp: new Date().toISOString()
      };

      const request = store.add(chatEntry);

      request.onsuccess = () => {
        resolve(chatEntry);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Get chat history for user
  async getChatHistory(workerId, limit = 50) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chatHistory'], 'readonly');
      const store = transaction.objectStore('chatHistory');
      const index = store.index('workerId');
      const request = index.getAll(workerId);

      request.onsuccess = () => {
        const messages = request.result
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(-limit);
        resolve(messages);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Clear chat history for user
  async clearChatHistory(workerId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chatHistory'], 'readwrite');
      const store = transaction.objectStore('chatHistory');
      const index = store.index('workerId');
      const request = index.openCursor(workerId);

      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log('✅ Chat history cleared');
          resolve();
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  // Get all users (for debugging)
  async getAllUsers() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
};

// Initialize database when script loads
(async () => {
  try {
    await MedMateDB.init();
    console.log('🎉 MedMate Database ready!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
})();
