// Healthcare Knowledge Base for Semantic Matching
const HEALTHCARE_KNOWLEDGE = {
  // Mental Health & Therapy
  mental_health: {
    keywords: ['mental', 'stress', 'anxiety', 'depression', 'therapy', 'therapist', 'emotional', 'psychological', 'panic', 'worry', 'nervous', 'breathing'],
    responses: [
      {
        context: 'stress_anxiety',
        answer: `**Mental Health Support - Stress & Anxiety Management**

**Immediate Interventions:**

1. **Breathing Techniques:**
   - 4-7-8 Method: Inhale 4 counts → Hold 7 counts → Exhale 8 counts
   - Box Breathing: 4-4-4-4 pattern (inhale-hold-exhale-hold)
   - Practice 3-5 minutes, 2-3 times daily

2. **Grounding Exercises:**
   - 5-4-3-2-1 Technique: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste
   - Physical grounding: Press feet firmly on floor, notice body contact with chair

3. **Cognitive Strategies:**
   - Identify and challenge negative thoughts
   - Practice mindfulness meditation (10 min daily)
   - Maintain a worry journal

**Lifestyle Modifications:**
- Regular sleep schedule (7-8 hours)
- Daily physical activity (30 min walking)
- Limit caffeine and alcohol
- Social connection and support

**When to Escalate:**
🔴 Self-harm thoughts → Immediate mental health professional
🟡 Symptoms persist >2 weeks → Refer to counselor/psychiatrist
🟡 Severe panic attacks → Consider emergency evaluation

**Follow-up:** Check patient progress in 3-5 days`
      },
      {
        context: 'depression_mood',
        answer: `**Depression Assessment & Support**

**Warning Signs:**
- Persistent sadness or emptiness (>2 weeks)
- Loss of interest in activities
- Changes in sleep/appetite
- Fatigue and low energy
- Difficulty concentrating
- Feelings of worthlessness

**Immediate Actions:**
1. **Safety Assessment:**
   - Ask directly about suicidal thoughts
   - If present → immediate referral to mental health crisis services

2. **Supportive Interventions:**
   - Active listening without judgment
   - Validate feelings
   - Encourage small, achievable daily tasks
   - Promote social connection

3. **Behavioral Activation:**
   - Schedule pleasant activities
   - Establish daily routine
   - Encourage gentle exercise

**Referral Criteria:**
- Suicidal ideation → Emergency psychiatric evaluation
- Moderate-severe symptoms → Psychiatrist/psychologist
- Mild symptoms → Counselor or primary care physician

**Resources:**
- National Mental Health Helpline: 1800-599-0019
- NIMHANS Helpline: 080-46110007`
      }
    ]
  },

  // Symptom Checking & Triage
  symptoms: {
    keywords: ['symptom', 'fever', 'cough', 'pain', 'headache', 'vomit', 'diarrhea', 'nausea', 'dizzy', 'weak', 'tired', 'sick', 'ill'],
    responses: [
      {
        context: 'fever_respiratory',
        answer: `**Fever & Respiratory Symptom Triage**

**Assessment Parameters:**
- Temperature: Record actual reading
- Duration: How many days?
- Associated symptoms: Cough, breathing difficulty, chest pain?
- Vital signs: Respiratory rate, oxygen saturation if available

**Triage Classification:**

🟢 **GREEN - Home Care:**
- Fever <100.4°F (38°C)
- Duration <3 days
- No breathing difficulty
- Patient alert and responsive

**Management:**
- Rest and hydration (8-10 glasses/day)
- Paracetamol 500mg every 6 hours (adults)
- Monitor temperature every 6 hours
- Reassess in 48 hours

🟡 **YELLOW - Clinic Visit (24-48 hrs):**
- Fever 100.4-102°F (38-39°C)
- Duration 3-5 days
- Mild chest discomfort
- Persistent cough

**Action:** Schedule clinic appointment, continue home care

🔴 **RED - Urgent Hospital Referral:**
- Fever >102°F (39°C) for >5 days
- Difficulty breathing or rapid breathing
- Chest pain or pressure
- Confusion or altered consciousness
- Severe dehydration (dry mouth, no urine)
- Coughing blood

**Action:** Immediate transport to hospital, call 108 if needed

**Documentation:**
- Vital signs with timestamps
- Symptom progression timeline
- Current medications
- Comorbidities (diabetes, heart disease, etc.)`
      },
      {
        context: 'pain_assessment',
        answer: `**Pain Assessment & Management**

**Pain Evaluation (0-10 Scale):**
- 0-3: Mild pain (manageable)
- 4-6: Moderate pain (interferes with activities)
- 7-10: Severe pain (requires immediate attention)

**Location-Specific Assessment:**

**Chest Pain:**
🔴 EMERGENCY if:
- Crushing/squeezing sensation
- Radiates to arm, jaw, or back
- Associated with sweating, nausea
- Difficulty breathing
→ Call ambulance immediately (108)

**Abdominal Pain:**
🟡 Refer if:
- Severe, persistent pain
- Vomiting with pain
- Rigid, tender abdomen
- Blood in stool/vomit

**Headache:**
🔴 EMERGENCY if:
- Sudden, severe ("worst headache ever")
- With fever and stiff neck
- Vision changes or confusion
- After head injury

**Joint/Muscle Pain:**
🟢 Home care if:
- Mild-moderate pain
- No swelling or redness
- Improves with rest

**Management:**
- Mild-moderate: Paracetamol/Ibuprofen
- Apply ice/heat as appropriate
- Rest affected area
- Elevate if swelling present

**Red Flags (Immediate Referral):**
- Sudden severe pain
- Pain with fever
- Neurological symptoms
- Trauma-related pain
- Pain not responding to basic measures`
      }
    ]
  },

  // Doctor Referrals
  doctor_referral: {
    keywords: ['doctor', 'specialist', 'refer', 'physician', 'cardiologist', 'neurologist', 'referral'],
    responses: [
      {
        context: 'specialist_referral',
        answer: `**Specialist Referral Guidelines**

**By Symptom/Condition:**

**Cardiology (Heart Specialist):**
- Chest pain, palpitations
- High blood pressure (>140/90 consistently)
- Heart murmur or irregular heartbeat
- Shortness of breath with exertion

**Pulmonology (Lung Specialist):**
- Chronic cough (>3 weeks)
- Breathing difficulties
- Suspected asthma or COPD
- Abnormal chest X-ray

**Gastroenterology (Digestive System):**
- Persistent abdominal pain
- Blood in stool
- Chronic diarrhea/constipation
- Jaundice or liver issues

**Neurology (Brain/Nerve Specialist):**
- Chronic headaches/migraines
- Seizures
- Numbness or weakness
- Memory problems

**Orthopedics (Bone/Joint):**
- Fractures or severe sprains
- Chronic joint pain
- Back pain with nerve symptoms
- Sports injuries

**Dermatology (Skin):**
- Persistent rashes
- Suspicious moles or growths
- Severe acne or skin infections
- Chronic skin conditions

**Emergency Referral (Call 108):**
⚠️ Chest pain with sweating
⚠️ Stroke symptoms (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call)
⚠️ Severe bleeding
⚠️ Loss of consciousness
⚠️ Difficulty breathing

**Referral Preparation:**
1. Document complete history
2. List all medications
3. Record vital signs
4. Gather previous reports
5. Write clear referral note with urgency level

**Available Physicians:**
- Dr. Kavita Rao (General Physician) - Mon-Sat, 9 AM-5 PM
- District Hospital - 24/7 emergency
- Specialty clinics - By appointment`
      }
    ]
  },

  // Hospital Information
  hospitals: {
    keywords: ['hospital', 'emergency', 'clinic', 'ambulance', 'facility', 'admission'],
    responses: [
      {
        context: 'emergency_facilities',
        answer: `**Healthcare Facilities Directory**

**🏥 24/7 Emergency Care:**

**1. Jeevan Jyoti Emergency Clinic**
📍 Distance: 2.8 km (10 min drive)
🏥 Facilities:
   - Emergency department
   - Basic surgery
   - ICU (4 beds)
   - X-ray and lab
   - Ambulance service
📞 Contact: Walk-in accepted
💰 Accepts: Cash, insurance
✅ Best for: Accidents, injuries, urgent cases

**2. Seva Nagar Community Hospital**
📍 Distance: 5.1 km (15 min drive)
🏥 Facilities:
   - Full hospital with specialists
   - 50-bed capacity
   - ICU and NICU
   - Surgery and maternity
   - Complete diagnostics
📞 Contact: Referral preferred, emergencies accepted
💰 Accepts: Cash, insurance, government schemes
✅ Best for: Serious conditions, admissions

**🏥 Primary Care Clinics:**

**3. Arogya Health Center**
📍 Distance: 1.2 km (5 min walk)
🏥 Facilities:
   - OPD consultations
   - Basic diagnostics
   - Pharmacy
   - Vaccination
⏰ Hours: Mon-Sat, 8 AM - 8 PM
✅ Best for: Routine checkups, minor ailments

**4. Community Health Post**
📍 Distance: 0.5 km (2 min walk)
🏥 Facilities:
   - Basic first aid
   - Maternal health
   - Immunization
   - Health education
⏰ Hours: Mon-Fri, 9 AM - 5 PM

**🚑 Emergency Transport:**
- **National Ambulance: 108** (FREE)
- **Private Ambulance:** ₹500-1500
- **Hospital Ambulance:** Call facility directly

**Pre-Transport Checklist:**
✅ Patient ID/Aadhaar card
✅ Previous medical records
✅ Current medication list
✅ Insurance/health card
✅ Emergency contact numbers

**What to Communicate:**
- Patient age and gender
- Chief complaint
- Vital signs if available
- Allergies and medications
- Time of symptom onset

**For Life-Threatening Emergencies:**
1. Call 108 immediately
2. Start basic first aid/CPR if trained
3. Keep patient calm and comfortable
4. Gather documents while waiting
5. Brief family on situation`
      }
    ]
  },

  // Skin Conditions
  skin_conditions: {
    keywords: ['skin', 'rash', 'itch', 'allergy', 'fungal', 'dermatitis', 'eczema', 'acne'],
    responses: [
      {
        context: 'skin_assessment',
        answer: `**Skin Condition Assessment Protocol**

**Visual Examination Checklist:**
1. **Location:** Where on body?
2. **Appearance:** Color, texture, borders
3. **Size:** Measure in cm
4. **Distribution:** Localized or widespread?
5. **Associated symptoms:** Itching, pain, discharge?

**Common Presentations:**

**🔴 Red, Itchy Patches:**
Possible causes:
- Contact dermatitis (allergic reaction)
- Fungal infection (ringworm)
- Eczema
- Heat rash

**Assessment:**
- Circular with raised edges → Likely fungal
- Irregular, dry, scaly → Likely eczema
- Blisters, weeping → Contact dermatitis

**Initial Treatment:**
- Fungal: Antifungal cream (clotrimazole) 2x daily
- Eczema: Moisturizer + mild steroid cream
- Contact dermatitis: Identify and remove irritant, calamine lotion
- Heat rash: Keep cool and dry, loose clothing

**🟡 Acne/Pimples:**
- Mild: Benzoyl peroxide wash
- Moderate-severe: Refer to dermatologist

**⚠️ Urgent Referral Needed:**
- Rapidly spreading rash
- Rash with fever
- Blisters or open sores
- Signs of infection (pus, warmth, red streaks)
- Rash after new medication
- Severe pain or swelling

**Documentation:**
📸 Take clear photos in good lighting:
- Close-up of affected area
- Wider shot showing location
- Include ruler/coin for scale
- Multiple angles if needed

**Prevention Education:**
- Maintain hygiene
- Keep skin dry (especially folds)
- Use mild, fragrance-free products
- Avoid sharing personal items
- Wear breathable fabrics

**Follow-up:**
- Reassess in 5-7 days
- If no improvement → dermatologist referral
- If worsening → immediate medical attention`
      }
    ]
  },

  // Lab Report Analysis
  lab_reports: {
    keywords: ['report', 'lab', 'test', 'result', 'hemoglobin', 'blood', 'sugar', 'cholesterol', 'analysis'],
    responses: [
      {
        context: 'blood_test_interpretation',
        answer: `**Lab Report Interpretation Guide**

**Complete Blood Count (CBC):**

**Hemoglobin:**
- Normal: Men 13.5-17.5 g/dL, Women 12-15.5 g/dL
- Low (<12 g/dL): Anemia
  - Mild: 10-12 g/dL
  - Moderate: 7-10 g/dL
  - Severe: <7 g/dL

**Anemia Management:**
1. **Dietary:**
   - Iron-rich: Spinach, lentils, red meat, jaggery
   - Vitamin C: Citrus fruits (enhances absorption)
   - Avoid tea/coffee with meals

2. **Supplementation:**
   - Iron tablets (ferrous sulfate 200mg) daily
   - Take with orange juice
   - Empty stomach if tolerated

3. **Follow-up:**
   - Recheck after 4-6 weeks
   - Monitor symptoms: fatigue, pale skin, dizziness

**White Blood Cell Count (WBC):**
- Normal: 4,000-11,000/μL
- High: Infection or inflammation
- Low: Immune suppression

**Platelet Count:**
- Normal: 150,000-450,000/μL
- Low (<50,000): Bleeding risk → urgent referral

**Blood Sugar (Glucose):**
- Fasting normal: 70-100 mg/dL
- Pre-diabetes: 100-125 mg/dL
- Diabetes: ≥126 mg/dL (on 2 occasions)

**Diabetes Management:**
- Diet modification
- Regular exercise
- Blood sugar monitoring
- Medication as prescribed
- Refer to physician for management plan

**Lipid Profile (Cholesterol):**
- Total cholesterol: <200 mg/dL (desirable)
- LDL (bad): <100 mg/dL (optimal)
- HDL (good): >40 mg/dL men, >50 mg/dL women
- Triglycerides: <150 mg/dL

**High Cholesterol Management:**
- Low-fat diet
- Increase fiber
- Regular exercise
- Weight management
- Medication if prescribed

**Liver Function Tests:**
- Elevated enzymes → Liver stress
- Jaundice → Urgent evaluation needed

**Kidney Function:**
- Creatinine elevated → Kidney impairment
- Refer to nephrologist if abnormal

**When to Escalate:**
🔴 Severe anemia (Hb <7 g/dL)
🔴 Very high/low blood sugar with symptoms
🔴 Abnormal kidney/liver function
🟡 Persistent abnormalities after treatment

**Patient Education:**
- Explain results in simple terms
- Discuss lifestyle modifications
- Emphasize medication compliance
- Schedule follow-up tests`
      }
    ]
  },

  // General Health Guidance
  general: {
    keywords: ['health', 'advice', 'guidance', 'help', 'question', 'what', 'how', 'when'],
    responses: [
      {
        context: 'general_guidance',
        answer: `**Arogya Sahayak - Healthcare Guidance**

I'm here to assist you with comprehensive healthcare support for community health workers.

**My Capabilities:**

✅ **Mental Health Support**
   - Stress and anxiety management
   - Depression screening
   - Therapeutic interventions
   - Crisis assessment

✅ **Symptom Triage**
   - Fever and respiratory symptoms
   - Pain assessment
   - Emergency identification
   - Home care vs. hospital decision

✅ **Specialist Referrals**
   - Appropriate specialist identification
   - Urgency level determination
   - Referral documentation
   - Emergency protocols

✅ **Healthcare Facilities**
   - Nearby hospitals and clinics
   - Emergency transport
   - Facility capabilities
   - Contact information

✅ **Lab Report Interpretation**
   - Blood test analysis
   - Abnormality identification
   - Follow-up recommendations
   - Patient education

✅ **Skin Condition Assessment**
   - Visual examination protocol
   - Common condition identification
   - Treatment recommendations
   - Referral criteria

**How to Use:**
1. Describe the patient's condition in detail
2. Include relevant symptoms, duration, severity
3. Mention vital signs if available
4. Ask specific questions

**Emergency Indicators:**
⚠️ Call 108 immediately if:
- Difficulty breathing
- Chest pain
- Severe bleeding
- Loss of consciousness
- Stroke symptoms
- Severe trauma

**Best Practices:**
- Always document thoroughly
- Check vital signs when possible
- Follow up on referrals
- Maintain patient confidentiality
- Know your limitations - refer when unsure

**Quick Actions Available:**
Use the buttons below for common scenarios:
- 💙 AI Therapist
- 🩺 Symptom Check
- 📸 Skin Scan
- 📋 Report Analysis
- 👨‍⚕️ Need Doctor
- 🏥 Hospitals

How can I assist you today?`
      }
    ]
  }
};
