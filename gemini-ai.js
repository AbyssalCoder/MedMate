// Real AI Integration with Google Gemini API
const GeminiAI = {
  apiKey: 'AIzaSyAiF-X7LEqcN_9_79-V_BqLgz8ZH9genb8', // Your working API key
  conversationHistory: [], // Stores the full conversation
  
  // Initialize system prompt for healthcare context
  systemPrompt: `You are MedMate, a friendly AI health companion helping everyday people with their health questions.

Communication style:
- Keep responses SHORT and conversational (2-4 sentences max)
- Use LOTS of emojis to make it fun and engaging! 😊💙🩺
- Ask only 1-2 questions at a time, not overwhelming lists
- Use HTML tags: <b>bold</b>, <i>italic</i>, <br> for breaks
- Be warm, supportive, and encouraging like a caring friend
- Speak directly to the user (not about "patients")

Your role:
- Help users understand their symptoms quickly
- Analyze medical images and lab reports
- Give clear, easy-to-follow advice
- Recommend doctors when needed
- Use Indian context (108 ambulance 🚑)

When analyzing images:
- Start with what you see 👀
- Give the most likely diagnosis with emoji
- Provide 2-3 simple treatment tips
- Mention if they should see a doctor

When analyzing lab reports:
- Highlight abnormal values with emojis (⚠️ for concerning, ✅ for good)
- Explain in simple, non-scary terms
- Give clear next steps

Keep it brief, friendly, emoji-filled, and helpful! Make health advice feel less scary and more approachable. 💪`,

  // Chat with text only
  async chat(userMessage) {
    try {
      console.log('Calling Gemini API with message:', userMessage);
      
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
      
      // Build the full conversation context
      const contents = [
        {
          role: 'user',
          parts: [{ text: this.systemPrompt }]
        },
        ...this.conversationHistory
      ];
      
      const requestBody = {
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      };
      
      console.log('Conversation history length:', this.conversationHistory.length);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add AI response to conversation history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: aiResponse }]
      });
      
      console.log('AI Response:', aiResponse);
      return aiResponse;

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  },

  // Chat with image (for skin scan and report analysis)
  async chatWithImage(userMessage, imageBase64, mimeType = 'image/jpeg') {
    try {
      console.log('Analyzing image with Gemini Vision...');
      
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: this.systemPrompt + '\n\n' + userMessage },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      return aiResponse;

    } catch (error) {
      console.error('Gemini Vision API Error:', error);
      throw error;
    }
  },

  // Reset conversation (for new topics)
  resetConversation() {
    this.conversationHistory = [];
    console.log('Conversation history cleared');
  },
  
  // Get conversation context
  getConversationLength() {
    return this.conversationHistory.length;
  }
};

// Enhanced Conversational AI using Gemini
const RealConversationalAI = {
  currentIntent: null,
  waitingForImage: false,
  imageType: null,
  
  async processMessage(userMessage, imageData = null) {
    try {
      // If we're waiting for an image and one is provided
      if (this.waitingForImage && imageData) {
        this.waitingForImage = false;
        return await this.analyzeImage(imageData, this.imageType);
      }

      // Detect intent from message
      const intent = this.detectIntent(userMessage);
      
      // Handle different intents
      if (intent === 'skin_scan' && !imageData) {
        this.waitingForImage = true;
        this.imageType = 'skin';
        return {
          message: `**📸 Skin Condition Analysis**

I'll help you analyze the skin condition. Please upload a clear image of the affected area.

**Tips for best results:**
- Good lighting (natural light preferred)
- Close-up showing the condition clearly
- Include surrounding healthy skin for comparison
- Multiple angles if possible

After you upload the image, I'll ask you some questions and provide a detailed analysis.

Click the upload button below to continue.`,
          showImageUpload: true,
          uploadType: 'skin'
        };
      }

      if (intent === 'report_analysis' && !imageData) {
        this.waitingForImage = true;
        this.imageType = 'report';
        return {
          message: `**📋 Lab Report Analysis**

I'll analyze your lab report in detail. Please upload a clear image of the report.

**Tips for best results:**
- Ensure all text is readable
- Include reference ranges
- Capture the entire report (multiple images if needed)
- Good lighting, no glare

I'll provide:
- Detailed interpretation of all values
- Explanation of abnormalities
- Specific recommendations
- Specialist referrals if needed

Click the upload button below to continue.`,
          showImageUpload: true,
          uploadType: 'report'
        };
      }

      // Regular conversation with Gemini
      const response = await GeminiAI.chat(userMessage);
      return {
        message: response,
        showImageUpload: false
      };

    } catch (error) {
      console.error('Conversation error:', error);
      return {
        message: `I apologize, but I encountered an error: ${error.message}\n\nPlease try again or rephrase your question.`,
        showImageUpload: false
      };
    }
  },

  async analyzeImage(imageBase64, imageType) {
    try {
      let prompt = '';
      
      if (imageType === 'skin') {
        prompt = `Analyze this skin condition image in detail:

1. **Visual Description**: Describe exactly what you see (color, texture, size, distribution, borders)
2. **Differential Diagnosis**: List 3-4 most likely conditions based on the image
3. **Most Likely Diagnosis**: Your top diagnosis with reasoning
4. **Severity Assessment**: Mild/Moderate/Severe
5. **Recommended Treatment**: Specific medications and home care
6. **When to See Doctor**: Red flags that require immediate medical attention
7. **Specialist Needed**: Which type of doctor (if any)
8. **Follow-up Questions**: Ask 2-3 specific questions about symptoms, duration, etc.

Be specific and detailed. This is for a community health worker assessing a patient.`;
      } else if (imageType === 'report') {
        prompt = `Analyze this lab report image in detail:

1. **Report Type**: Identify what tests are shown
2. **All Values**: List each test with its value and reference range
3. **Abnormal Findings**: Highlight all values outside normal range
4. **Clinical Significance**: Explain what each abnormality means in simple terms
5. **Diagnosis**: What condition(s) do these results suggest?
6. **Severity**: How concerning are these findings?
7. **Immediate Actions**: What should be done right away?
8. **Lifestyle Modifications**: Diet, exercise, etc.
9. **Medications**: What treatments might be needed?
10. **Specialist Referral**: Which specialist should see this patient?
11. **Follow-up**: When to retest?

Be thorough and specific. Explain medical terms in simple language.`;
      }

      const response = await GeminiAI.chatWithImage(prompt, imageBase64);
      
      // After image analysis, ask follow-up questions
      const followUpPrompt = `Based on your analysis, ask the user 2-3 specific follow-up questions to gather more information about the patient's condition. Be conversational.`;
      
      return {
        message: response,
        showImageUpload: false,
        needsFollowUp: true
      };

    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        message: `I apologize, but I couldn't analyze the image: ${error.message}\n\nPlease ensure the image is clear and try again.`,
        showImageUpload: false
      };
    }
  },

  detectIntent(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('skin') || lowerMsg.includes('rash') || lowerMsg.includes('itch') || 
        lowerMsg.includes('spot') || lowerMsg.includes('patch')) {
      return 'skin_scan';
    }
    
    if (lowerMsg.includes('report') || lowerMsg.includes('test') || lowerMsg.includes('lab') || 
        lowerMsg.includes('blood') || lowerMsg.includes('result')) {
      return 'report_analysis';
    }
    
    if (lowerMsg.includes('symptom') || lowerMsg.includes('sick') || lowerMsg.includes('pain') || 
        lowerMsg.includes('fever') || lowerMsg.includes('cough')) {
      return 'symptom_check';
    }
    
    if (lowerMsg.includes('doctor') || lowerMsg.includes('specialist') || lowerMsg.includes('refer')) {
      return 'doctor_referral';
    }
    
    if (lowerMsg.includes('hospital') || lowerMsg.includes('emergency') || lowerMsg.includes('clinic')) {
      return 'hospital_finder';
    }
    
    if (lowerMsg.includes('mental') || lowerMsg.includes('stress') || lowerMsg.includes('anxiety') || 
        lowerMsg.includes('depress')) {
      return 'mental_health';
    }

    return 'general';
  },

  resetConversation() {
    this.currentIntent = null;
    this.waitingForImage = false;
    this.imageType = null;
    GeminiAI.resetConversation();
  }
};
