# Arogya Sahayak - AI Care Copilot

## 🚀 Real AI-Powered Healthcare Assistant

### ✨ Key Features

#### 1. **Real Conversational AI**
- Powered by **Google Gemini 1.5 Flash**
- Truly conversational - asks follow-up questions
- Contextual responses based on conversation history
- Adapts to user needs dynamically

#### 2. **Actual Image Analysis**
- **Skin Condition Analysis**: Upload images, get real AI diagnosis
  - Visual description of what AI sees
  - Differential diagnosis (3-4 possible conditions)
  - Specific treatment recommendations
  - Severity assessment
  - Specialist referrals
  
- **Lab Report Analysis**: Upload reports, get accurate interpretation
  - Identifies all test values
  - Highlights abnormalities
  - Explains medical significance
  - Provides actionable recommendations
  - Specialist referrals based on findings

#### 3. **Interactive Symptom Assessment**
- AI asks relevant follow-up questions
- Collects detailed patient history
- Provides diagnosis based on collected information
- Recommends specific specialists (not generic)
- Urgency-based hospital recommendations

#### 4. **Smart Doctor Recommendations**
- Recommends specialists based on diagnosed condition
- Provides nearby doctor information:
  - Name, specialty, location
  - Contact details
  - Consultation fees
  - Working hours
  - Patient ratings

#### 5. **Contextual Hospital Finder**
- Recommendations based on urgency level
- Emergency vs. routine care facilities
- Distance and contact information
- Available facilities and services
- Ambulance service details

### 🔧 Technical Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **AI Engine**: Google Gemini 1.5 Flash API
- **Image Processing**: Base64 encoding for vision API
- **Storage**: LocalStorage for sessions and chat history
- **Authentication**: Simple user registration and login

### 📋 How It Works

1. **Text Conversations**:
   ```
   User: "I need help with a patient's symptoms"
   AI: "I'll help you assess the patient. What are the main symptoms they're experiencing?"
   User: "Fever and cough for 5 days"
   AI: "How high is the fever? Any difficulty breathing?"
   ... (continues conversation)
   AI: "Based on symptoms, this appears to be [diagnosis]. I recommend seeing a [specialist]."
   ```

2. **Image Analysis**:
   ```
   User: Clicks "Skin Scan"
   AI: "Please upload a clear image of the affected area"
   User: Uploads image
   AI: Analyzes image with Gemini Vision API
   AI: "I can see [detailed description]. This appears to be [diagnosis]. 
        Recommended treatment: [specific medications and care]"
   ```

3. **Lab Report Analysis**:
   ```
   User: Clicks "Report Analysis"
   AI: "Please upload the lab report"
   User: Uploads report image
   AI: Reads and interprets all values
   AI: "Hemoglobin: 9.1 g/dL (LOW) - indicates moderate anemia.
        Recommendation: Iron supplements, dietary changes.
        Specialist: Hematologist or General Physician"
   ```

### 🎯 Usage

1. **Register/Login**: Create account or sign in
2. **Start Conversation**: 
   - Click quick action buttons, OR
   - Type your question naturally
3. **Follow AI Guidance**:
   - Answer follow-up questions
   - Upload images when prompted
   - Get personalized recommendations
4. **Take Action**:
   - Contact recommended specialists
   - Visit suggested hospitals
   - Follow treatment guidelines

### 🔐 API Configuration

The app uses Google Gemini API with the key hardcoded in `gemini-ai.js`:
```javascript
apiKey: 'AIzaSyAiF-X7LEqcN_9_79-V_BqLgz8ZH9genb8'
```

For production, move this to environment variables.

### 🚨 Important Notes

- **Real AI Analysis**: All image and text analysis is done by Gemini AI
- **Internet Required**: Needs active internet for API calls
- **Conversation Memory**: Maintains context throughout session
- **Reset Conversation**: Start fresh topic by clicking new quick action
- **Emergency**: Always call 108 for life-threatening situations

### 📱 Quick Actions

- 💙 **AI Therapist**: Mental health assessment and support
- 🩺 **Symptom Check**: Interactive symptom evaluation
- 📸 **Skin Scan**: Upload and analyze skin conditions
- 📋 **Report Analysis**: Interpret lab reports
- 👨‍⚕️ **Need Doctor**: Get specialist recommendations
- 🏥 **Hospitals**: Find nearby healthcare facilities

### 🎓 For Developers

**File Structure**:
- `index.html`: Main UI
- `gemini-ai.js`: Gemini API integration and conversational logic
- `app-simple.js`: App logic, event handlers, UI updates
- `README.md`: This file

**Key Functions**:
- `GeminiAI.chat()`: Text-based conversation
- `GeminiAI.chatWithImage()`: Image analysis
- `RealConversationalAI.processMessage()`: Intent detection and routing
- `AIService.chat()`: Main AI interface

### 🔄 Updates from Previous Version

**What Changed**:
1. ❌ Removed hardcoded template responses
2. ✅ Added real Gemini AI integration
3. ✅ Actual image analysis (not simulated)
4. ✅ True conversational flow
5. ✅ Context-aware responses
6. ✅ Specific recommendations based on AI diagnosis

**Result**: A truly intelligent healthcare assistant that provides real value!

---

**Version**: 2.0 (Real AI)  
**Last Updated**: October 30, 2025  
**Developer**: Aniket Chowdhury

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
