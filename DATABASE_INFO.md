# MedMate Database Documentation

## 🗄️ Database Technology
**IndexedDB** - Browser's built-in NoSQL database that persists data even after closing the browser.

## 📊 Database Structure

### Database Name: `MedMateDB`
Version: 1

---

## 📦 Object Stores (Tables)

### 1. **users** Store
Stores registered user accounts

**Key Path:** `workerId` (unique identifier)

**Schema:**
```javascript
{
  workerId: string,      // Unique user ID (primary key)
  name: string,          // Full name
  pin: string,           // PIN for authentication
  createdAt: string,     // ISO timestamp of registration
  lastLogin: string      // ISO timestamp of last login
}
```

**Indexes:**
- `workerId` (unique)

---

### 2. **sessions** Store
Manages active user sessions

**Key Path:** `id` (auto-generated)

**Schema:**
```javascript
{
  id: string,           // Session ID (e.g., "session_1234567890")
  workerId: string,     // Reference to user
  name: string,         // User's name
  loginTime: string,    // ISO timestamp
  active: boolean       // Session status
}
```

**Indexes:**
- `workerId` (non-unique)

---

### 3. **chatHistory** Store
Stores conversation history for each user

**Key Path:** `id` (auto-increment)

**Schema:**
```javascript
{
  id: number,           // Auto-incremented ID
  workerId: string,     // Reference to user
  role: string,         // 'user' or 'assistant'
  content: string,      // Message content
  timestamp: string     // ISO timestamp
}
```

**Indexes:**
- `workerId` (non-unique)
- `timestamp` (non-unique)

---

## 🔧 Available Functions

### User Management

#### `addUser(userData)`
Register a new user
```javascript
await MedMateDB.addUser({
  workerId: 'user123',
  name: 'John Doe',
  pin: '1234'
});
```

#### `getUser(workerId)`
Get user details
```javascript
const user = await MedMateDB.getUser('user123');
```

#### `updateLastLogin(workerId)`
Update user's last login timestamp
```javascript
await MedMateDB.updateLastLogin('user123');
```

#### `getAllUsers()`
Get all registered users (for debugging)
```javascript
const users = await MedMateDB.getAllUsers();
```

---

### Session Management

#### `createSession(workerId, name)`
Create a new active session
```javascript
const session = await MedMateDB.createSession('user123', 'John Doe');
```

#### `getActiveSession()`
Get the current active session
```javascript
const session = await MedMateDB.getActiveSession();
```

#### `clearSessions()`
Logout - clear all sessions
```javascript
await MedMateDB.clearSessions();
```

---

### Chat History

#### `saveChatMessage(workerId, message)`
Save a chat message
```javascript
await MedMateDB.saveChatMessage('user123', {
  role: 'user',
  content: 'Hello MedMate!'
});
```

#### `getChatHistory(workerId, limit)`
Get chat history for a user
```javascript
const messages = await MedMateDB.getChatHistory('user123', 50);
```

#### `clearChatHistory(workerId)`
Clear chat history for a user
```javascript
await MedMateDB.clearChatHistory('user123');
```

---

## 🔐 Security Features

1. **PIN-based Authentication** - User passwords (PINs) are stored in IndexedDB
2. **Session Management** - Active sessions tracked in database
3. **User Isolation** - Each user's data is separate
4. **Browser-level Security** - IndexedDB is sandboxed per domain

---

## 💾 Data Persistence

### What Persists:
✅ User accounts (workerId, name, PIN)
✅ Login sessions
✅ Chat history
✅ Last login timestamps

### What Doesn't Persist:
❌ Gemini AI conversation context (resets on page reload)
❌ Temporary UI state

---

## 🛠️ Developer Tools

### View Database in Browser:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **IndexedDB**
4. Click **MedMateDB**
5. View each object store

### Clear Database:
```javascript
// In browser console
indexedDB.deleteDatabase('MedMateDB');
location.reload();
```

---

## 📈 Database Limits

- **Storage:** ~50MB per domain (varies by browser)
- **Records:** Unlimited (within storage limit)
- **Performance:** Fast for < 10,000 records

---

## 🔄 Auto-Login Feature

When you open MedMate:
1. Checks for active session in IndexedDB
2. If found → Auto-login
3. If not found → Show login page

**No need to login every time!** 🎉

---

## 🧪 Testing

### Create Test User:
```javascript
// In browser console
await MedMateDB.addUser({
  workerId: 'test123',
  name: 'Test User',
  pin: '1234'
});
```

### Check Active Session:
```javascript
const session = await MedMateDB.getActiveSession();
console.log(session);
```

---

## 🚀 Future Enhancements

Possible additions:
- [ ] Password hashing
- [ ] Multi-device sync
- [ ] Export chat history
- [ ] User profile pictures
- [ ] Health records storage
- [ ] Appointment reminders

---

## ⚠️ Important Notes

1. **Browser-specific** - Data doesn't sync across browsers
2. **Device-specific** - Data doesn't sync across devices
3. **Clear browsing data** - Will delete the database
4. **Incognito mode** - Database is temporary

---

## 📞 Support

For issues with the database:
1. Check browser console for errors
2. Clear database and try again
3. Ensure browser supports IndexedDB (all modern browsers do)

---

**Built with ❤️ for MedMate - Your AI Health Companion**
