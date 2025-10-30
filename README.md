# Arogya Sahayak - AI Care Copilot

A modern, AI-powered healthcare assistant designed for community health workers. Built with vanilla JavaScript, Tailwind CSS, and integrated with Google Gemini AI.

## 🌟 Features

### 🔐 User Authentication
- **Register**: Create a new worker account with name, ID, and PIN
- **Login**: Secure login with worker ID and PIN
- **Session Persistence**: Automatic session restoration using localStorage

### 🤖 AI-Powered Chat Assistant
- **Real-time AI Responses**: Powered by Google Gemini Pro
- **Pre-configured & Ready**: No API key setup needed - works out of the box!
- **Context-Aware Conversations**: Maintains chat history and context
- **Multi-Purpose Support**:
  - 💙 **AI Therapist** - Mental health support and breathing exercises
  - 🩺 **Symptom Check** - Triage recommendations and severity assessment
  - 📸 **Skin Scan** - Image-based diagnosis suggestions
  - 📋 **Report Analysis** - Lab report interpretation
  - 👨‍⚕️ **Doctor Referrals** - Find suitable specialists
  - 🏥 **Hospital Finder** - Locate nearby emergency care

### 🎨 Modern UI/UX
- Gradient backgrounds and glassmorphism effects
- Responsive design for mobile and desktop
- Smooth transitions and hover effects
- Clean, professional interface

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for AI responses)

### Installation

1. **Clone or download** the Sahayak folder
2. **Open `index.html`** in your browser
3. **Register** a new account (any name, ID, and PIN)
4. **Login** with your credentials
5. **Start chatting!** - AI is pre-configured and ready to use

## 📖 How to Use

### First Time Setup

1. **Register an Account**
   - Click on "Register" tab
   - Enter your full name
   - Choose a unique Worker ID
   - Set a 4-6 digit PIN
   - Click "Create account"

2. **Login**
   - Switch to "Login" tab
   - Enter your Worker ID and PIN
   - Click "Sign in"

3. **Start Using!**
   - AI is pre-configured and ready
   - You'll see "AI Ready" status in green
   - Start chatting immediately!

### Using the Chat

#### Method 1: Quick Actions
Click any of the colored quick action buttons:
- **💙 AI Therapist**: Get mental health support prompts
- **🩺 Symptom Check**: Analyze symptoms and get triage advice
- **📸 Skin Scan**: Get guidance on skin conditions
- **📋 Report Analysis**: Interpret lab results
- **👨‍⚕️ Need Doctor**: Get specialist recommendations
- **🏥 Hospitals**: Find nearby emergency care

#### Method 2: Free-form Chat
Type any question or concern in the message box. Examples:
- "Patient has persistent cough and fever for 5 days. What should I do?"
- "Help me with breathing exercises for an anxious patient"
- "What does low hemoglobin mean?"
- "Where can I refer a patient with chest pain?"

## 🔧 Technical Details

### Architecture
- **Frontend**: Pure HTML, Tailwind CSS v3, Vanilla JavaScript
- **Storage**: localStorage for user data, sessions, and chat history
- **AI Service**: Google Gemini Pro API
- **No Backend Required**: Fully client-side application

### Data Storage
All data is stored locally in your browser:
- `arogya_users`: Registered user accounts
- `arogya_session`: Active session information
- `arogya_chat_history`: Conversation history

### API Integration
The app uses Google's Gemini API with:
- Model: `gemini-pro`
- Temperature: 0.7
- Max tokens: 500
- System prompt optimized for healthcare guidance
- Pre-configured API key (no setup required!)

## 🔒 Security & Privacy

- ✅ All data stored locally (no external database)
- ✅ PIN-based authentication
- ✅ No data sent to third parties (except Google Gemini for AI responses)
- ⚠️ For production use, implement proper backend authentication
- ⚠️ API key is visible in source code (for prototype only)

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

### Important Disclaimers
- This is a **prototype application** for educational purposes
- **Not a replacement for professional medical advice**
- Always consult qualified healthcare professionals for serious conditions
- AI responses are suggestions, not diagnoses
- API key is embedded for demo purposes - **not secure for production**

### API Usage
- Google Gemini Pro API is used for AI responses
- Free tier available with limitations
- Monitor usage at [Google AI Studio](https://makersuite.google.com/)
- For production, implement secure backend API key management

## 🛠️ Customization

### Change AI Model
In `app.js`, line 96:
```javascript
// Change model endpoint
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
  // Use 'gemini-pro-vision' for image support
```

### Adjust Response Length
In `app.js`, line 109:
```javascript
maxOutputTokens: 500, // Increase for longer responses
```

### Modify System Prompt
In `app.js`, lines 79-86 - customize the AI's behavior and expertise

### Replace API Key
In `app.js`, line 76:
```javascript
apiKey: 'YOUR_GEMINI_API_KEY_HERE',
```

## 🐛 Troubleshooting

### No AI responses
- Check browser console for errors (F12)
- Ensure internet connection is active
- Verify the Gemini API key hasn't expired
- Check if Google AI services are available in your region

### "API request failed" error
- The embedded API key may have reached its quota
- Get your own key from [Google AI Studio](https://makersuite.google.com/)
- Replace the key in `app.js` line 76

### Chat history not saving
- Check if browser allows localStorage
- Try clearing browser cache
- Use incognito mode to test

### Registration not working
- Clear localStorage: `localStorage.clear()` in console
- Ensure Worker ID doesn't already exist
- Check console for errors

## 📄 License

This project is created for educational purposes. Feel free to modify and use for learning.

## 🤝 Contributing

This is a prototype. Suggestions for improvements:
- Add image upload for skin scan feature
- Integrate PDF parsing for report analysis
- Add geolocation for nearby hospitals
- Implement voice input/output
- Add multilingual support

## 📧 Contact

For questions or issues, refer to the project documentation or OpenAI API documentation.

---

**Built with ❤️ for community health workers**
