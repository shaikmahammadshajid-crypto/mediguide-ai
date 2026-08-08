import { Disease, Medicine, UserProfile, HealthMetric, MedicalRecord, Reminder, Appointment, Order } from '../types';

export const INITIAL_PATIENT_PROFILE: UserProfile = {
  uid: 'demo_patient_123',
  fullName: 'Aarav Sharma',
  age: 34,
  gender: 'Male',
  dob: '1992-05-18',
  heightCm: 172,
  weightKg: 68,
  bloodGroup: 'B+',
  phoneNumber: '+91 98765 43210',
  email: 'aarav.sharma@mediguide.ai',
  address: 'Flat 402, Green Park Extension, Hauz Khas, New Delhi, Delhi - 110016',
  emergencyContactName: 'Sunita Sharma (Wife)',
  emergencyContactPhone: '+91 98111 22334',
  medicalHistory: 'Mild dust allergies. Diagnosed with primary hypertension in 2023.',
  allergies: ['Penicillin', 'Dust Mites', 'Peanuts'],
  currentMedications: ['Amlokind 5mg Daily', 'Multivitamin Tablet'],
  lifestyleHabits: '30 min morning walk 4x/week, Non-smoker, Moderate tea consumer.',
  familyHistory: 'Father: Type 2 Diabetes & Hypertension. Mother: Hypothyroidism.',
  existingDiseases: ['Essential Hypertension'],
  pastSurgeries: ['Appendectomy (2016)'],
  vaccinationHistory: ['COVID-19 Covishield (Booster 2023)', 'Influenza (2025)', 'Tetanus Toxoid (2024)'],
  role: 'patient',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  createdAt: '2025-01-15T08:00:00.000Z'
};

export const MOCK_DISEASES: Disease[] = [
  {
    id: 'd_diabetes_t2',
    name: 'Type 2 Diabetes Mellitus',
    category: 'Endocrinology',
    overview: 'Type 2 diabetes is a chronic metabolic condition characterized by high blood glucose levels due to insulin resistance or insufficient insulin production by the pancreas. Very common in Indian adult demographics.',
    causes: [
      'Insulin resistance in peripheral tissues (muscle, adipose tissue)',
      'Genetic predisposition and family history of metabolic disorders',
      'Sedentary lifestyle and low physical activity',
      'Overweight or obesity, particularly abdominal visceral fat deposition'
    ],
    symptoms: [
      'Increased thirst (Polydipsia)',
      'Frequent urination (Polyuria), especially at night',
      'Unexplained weight loss despite increased appetite',
      'Persistent fatigue and low energy',
      'Blurred vision and slow-healing cuts or skin infections'
    ],
    riskFactors: [
      'Age 35 or older (Indian ICMR guidelines recommend early screening)',
      'Body Mass Index (BMI) >= 23 (South Asian cutoff)',
      'Family history of diabetes in first-degree relatives',
      'Polycystic Ovary Syndrome (PCOS)',
      'History of Gestational Diabetes'
    ],
    complications: [
      'Diabetic Nephropathy (Kidney damage)',
      'Diabetic Retinopathy (Vision impairment or loss)',
      'Peripheral Neuropathy (Nerve damage in feet and hands)',
      'Cardiovascular Diseases (Heart attack, Stroke)'
    ],
    diagnosisMethods: [
      'Fasting Plasma Glucose Test (>= 126 mg/dL)',
      'HbA1c Glycated Hemoglobin Test (>= 6.5%)',
      'Oral Glucose Tolerance Test (OGTT)'
    ],
    generalTreatments: [
      'Dietary control reducing simple refined sugars, white rice, and maida',
      'Regular brisk walking and resistance exercise (150 min/week)',
      'Oral hypoglycemic pharmacotherapy (e.g. Metformin / Teneligliptin)',
      'Subcutaneous Insulin therapy in advanced cases'
    ],
    evidenceBasedMeds: [
      'Glycomet SR / Metformin Hydrochloride (First-line Biguanide)',
      'Teneligliptin / Sitagliptin (DPP-4 Inhibitors)',
      'Empagliflozin (SGLT2 Inhibitor)',
      'Glimepiride (Sulfonylurea)'
    ],
    sideEffects: [
      'Metformin: Gastrointestinal upset, nausea, mild diarrhea',
      'SGLT2 Inhibitors: Increased risk of urinary tract infections',
      'Sulfonylureas: Hypoglycemia (low blood sugar)'
    ],
    drugInteractions: [
      'Corticosteroids may elevate blood glucose levels',
      'Beta-blockers can mask hypoglycemic warning symptoms (tachycardia)'
    ],
    safetyPrecautions: [
      'Regular blood glucose monitoring using glucometer',
      'Annual dilated eye exams and foot health inspections',
      'Carry fast-acting glucose tablets or candy for sudden hypoglycemia'
    ],
    dietRecommendations: [
      'Emphasize high-fiber vegetables, millets (Ragi, Jowar, Bajra), pulses & lentils',
      'Avoid sugary beverages, sweetmeats (Mithai), white bread, and refined oils',
      'Adopt ICMR-NIN balanced Indian diet plate guidelines'
    ],
    exerciseRecommendations: [
      '30 minutes of brisk walking or yoga 5 days per week',
      'Light strength training 2 days per week to improve insulin sensitivity'
    ],
    lifestyleChanges: [
      'Target 5-10% weight loss if overweight',
      'Quit tobacco (smoking/chewing) and limit alcohol intake',
      'Maintain 7-8 hours of sound sleep daily'
    ],
    recoveryTips: [
      'Keep a daily blood glucose logbook or use continuous glucose monitors',
      'Stay well-hydrated throughout the day with clean water'
    ],
    preventionMethods: [
      'Maintain healthy body weight (BMI < 23 for South Asians)',
      'Engage in regular physical exercise',
      'Undergo annual routine preventive health checkups'
    ],
    whenToSeeDoctor: [
      'Persistent blood sugar readings above 200 mg/dL',
      'Numbness, tingling, or burning pain in feet or toes',
      'Frequent skin infections or slow-healing sores'
    ],
    emergencyWarningSigns: [
      'Dizziness, extreme confusion, or loss of consciousness (Hypoglycemia)',
      'Rapid deep breathing, fruity breath odor, severe nausea (Diabetic Ketoacidosis)',
      'Extreme dehydration with blood sugar over 500 mg/dL'
    ],
    references: [
      'ICMR Guidelines for Management of Type 2 Diabetes in India 2025',
      'RSSDI Clinical Practice Recommendations'
    ],
    relatedMedicineIds: ['m_metformin_500', 'm_atorvastatin_20']
  },
  {
    id: 'd_hypertension',
    name: 'Essential Hypertension (High Blood Pressure)',
    category: 'Cardiology',
    overview: 'Hypertension is a long-term medical condition in which the systemic arterial blood pressure is persistently elevated above 130/80 mmHg, increasing cardiac workload.',
    causes: [
      'High dietary sodium intake (pickles, papad, processed snacks)',
      'Vascular stiffness associated with aging and endothelial dysfunction',
      'Chronic psychological stress and sympathetic nervous system activation',
      'Renal artery stenosis or secondary endocrine conditions'
    ],
    symptoms: [
      'Often asymptomatic ("Silent Killer")',
      'Occasional morning occipital headaches',
      'Dizziness or lightheadedness upon standing',
      'Palpitations or feeling heart racing',
      'Visual disturbances or nosebleeds (epistaxis) in severe spikes'
    ],
    riskFactors: [
      'Family history of cardiovascular disease',
      'High salt / sodium dietary habits',
      'Physical inactivity',
      'Tobacco usage and heavy alcohol intake'
    ],
    complications: [
      'Coronary artery disease and Myocardial Infarction',
      'Ischemic or Hemorrhagic Stroke',
      'Chronic Kidney Disease (CKD)',
      'Left ventricular hypertrophy and Heart Failure'
    ],
    diagnosisMethods: [
      'Repeated blood pressure readings using calibrated sphygmomanometer',
      '24-hour Ambulatory Blood Pressure Monitoring (ABPM)',
      'Electrocardiogram (ECG) and Echocardiogram'
    ],
    generalTreatments: [
      'Dietary Approaches to Stop Hypertension (DASH / Low-Sodium Indian Diet)',
      'Sodium restriction (<2,000 mg/day)',
      'Antihypertensive pharmacotherapy tailored to patient co-morbidities'
    ],
    evidenceBasedMeds: [
      'Amlokind / Amlodipine Besylate (Calcium Channel Blocker)',
      'Telmikind / Telmisartan (ARB - First line in India)',
      'Hydrochlorothiazide / Chlorthalidone (Diuretic)',
      'Metoprolol Succinate (Beta-Blocker)'
    ],
    sideEffects: [
      'Amlodipine: Lower extremity peripheral pedal edema, facial flushing',
      'Telmisartan: Dizziness, hyperkalemia (rare)',
      'Diuretics: Increased urination, mild electrolyte imbalance'
    ],
    drugInteractions: [
      'NSAIDs (Ibuprofen, Diclofenac) can blunt antihypertensive drug effects',
      'Decongestants (Pseudoephedrine) elevate systemic blood pressure'
    ],
    safetyPrecautions: [
      'Measure blood pressure at resting state without tea, coffee or smoking 30 min prior',
      'Do not abruptly stop antihypertensive medications'
    ],
    dietRecommendations: [
      'Follow low-salt diet rich in potassium (bananas, coconut water, leafy greens)',
      'Avoid commercial pickles (Achar), papads, salted nuts, packaged chips, and processed namkeen'
    ],
    exerciseRecommendations: [
      'Aerobic activities such as brisk walking, cycling, or yoga 150 min/week'
    ],
    lifestyleChanges: [
      'Limit alcohol intake',
      'Practice Pranayama and meditation for stress reduction'
    ],
    recoveryTips: [
      'Record morning and evening BP readings in the MediGuide Health Log'
    ],
    preventionMethods: [
      'Maintain healthy South Asian BMI (< 23)',
      'Restrict dietary salt intake to under 1 teaspoon daily',
      'Avoid tobacco'
    ],
    whenToSeeDoctor: [
      'BP readings consistently above 140/90 mmHg',
      'Unexplained swelling in ankles or feet'
    ],
    emergencyWarningSigns: [
      'Severe sudden chest pressure, tightness or pain',
      'Systolic BP > 180 or Diastolic BP > 120 (Hypertensive Crisis)',
      'Sudden numbness or weakness on one side of face or body'
    ],
    references: [
      'Indian Hypertension Guidelines (IHG-IV)',
      'API-Cardiological Society of India Guidelines'
    ],
    relatedMedicineIds: ['m_amlodipine_5', 'm_atorvastatin_20']
  },
  {
    id: 'd_asthma',
    name: 'Bronchial Asthma',
    category: 'Respiratory',
    overview: 'Asthma is a chronic inflammatory disorder of the airway causing hyper-responsiveness, mucosal edema, bronchospasm, and episodic airflow obstruction, exacerbated by AQI/pollution in Indian urban cities.',
    causes: [
      'Genetic atopic vulnerability',
      'Environmental allergen exposure (pollen, dust mites, biomass smoke)',
      'High Air Quality Index (AQI) air pollution and smog',
      'Respiratory viral infections (Rhinovirus, Influenza)'
    ],
    symptoms: [
      'Recurrent wheezing during expiration',
      'Shortness of breath and air hunger',
      'Chest tightness or constriction sensation',
      'Persistent dry cough, worse at night or early morning'
    ],
    riskFactors: [
      'Personal or family history of eczema, allergic rhinitis (Atopy)',
      'Exposure to secondhand tobacco smoke or mosquito coil fumes',
      'Occupational exposure to dusts or chemical fumes'
    ],
    complications: [
      'Severe acute exacerbation (Status Asthmaticus)',
      'Airway remodeling and persistent reduced lung capacity',
      'Sleep disruption and fatigue'
    ],
    diagnosisMethods: [
      'Spirometry with bronchodilator reversibility test',
      'Peak Expiratory Flow (PEF) monitoring',
      'Fractional Exhaled Nitric Oxide (FeNO) test'
    ],
    generalTreatments: [
      'Short-acting beta-agonists (SABA) for quick rescue relief',
      'Inhaled Corticosteroids (ICS) for daily anti-inflammatory maintenance',
      'Avoiding known allergic triggers and pollution exposure'
    ],
    evidenceBasedMeds: [
      'Asthalin / Salbutamol Inhaler (Rescue Bronchodilator)',
      'Foracort / Budecort (ICS-LABA Combination Inhaler)',
      'Montair / Montelukast (Leukotriene Receptor Antagonist)'
    ],
    sideEffects: [
      'Salbutamol: Fine muscle tremor, mild tachycardia, restlessness',
      'Inhaled Steroids: Oral thrush (candidiasis), hoarseness'
    ],
    drugInteractions: [
      'Non-selective Beta-blockers (Propranolol) can induce severe bronchospasm',
      'Aspirin in aspirin-exacerbated respiratory disease (AERD)'
    ],
    safetyPrecautions: [
      'Rinse mouth thoroughly with water and gargle/spit after corticosteroid inhaler use',
      'Always carry a functioning rescue inhaler in your pocket or bag'
    ],
    dietRecommendations: [
      'Eat antioxidant-rich fruits and vegetables (Amla, citrus fruits, green vegetables)',
      'Drink warm water and ginger-tulsi herbal tea during cold season'
    ],
    exerciseRecommendations: [
      'Use rescue inhaler 15 minutes before exercise if exercise-induced',
      'Avoid heavy outdoor jogging on high AQI pollution days'
    ],
    lifestyleChanges: [
      'Use N95 masks outdoors when AQI > 200',
      'Encase pillows and mattresses in dust-mite proof covers'
    ],
    recoveryTips: [
      'Follow your personalized Asthma Action Plan'
    ],
    preventionMethods: [
      'Get annual influenza and pneumococcal vaccinations',
      'Avoid damp environments with mold growth'
    ],
    whenToSeeDoctor: [
      'Needing rescue inhaler more than twice per week for symptom relief',
      'Frequent nighttime awakenings due to coughing or shortness of breath'
    ],
    emergencyWarningSigns: [
      'Inability to speak full sentences without pausing for breath',
      'Chest indrawing or sternal retractions during breathing',
      'Bluish tint on lips, fingernails, or tongue (Cyanosis)',
      'Peak flow reading in Red Zone (< 50% personal best)'
    ],
    references: [
      'National College of Chest Physicians (NCCP) India Asthma Guidelines',
      'Global Initiative for Asthma (GINA) 2025'
    ],
    relatedMedicineIds: ['m_salbutamol_100', 'm_cetirizine_10']
  },
  {
    id: 'd_gerd',
    name: 'Gastroesophageal Reflux Disease (GERD / Acidity)',
    category: 'Gastrointestinal',
    overview: 'GERD is a digestive disorder where stomach acid or bile irritates the esophageal mucosal lining due to transient relaxation or weakness of the Lower Esophageal Sphincter (LES), commonly known as chronic acidity in India.',
    causes: [
      'Lower Esophageal Sphincter (LES) hypotonia or dysfunction',
      'Hiatal hernia displaced upper stomach',
      'Late night heavy oily dinner and immediate recumbency',
      'High consumption of deep-fried (Samosas, Pakoras) and spicy foods'
    ],
    symptoms: [
      'Heartburn (substernal burning sensation / सीने में जलन)',
      'Acid regurgitation of sour or bitter fluid into mouth',
      'Dysphagia or sensation of food sticking in throat',
      'Chronic dry cough, hoarseness, or throat clearing'
    ],
    riskFactors: [
      'Obesity and abdominal adiposity',
      'Smoking and heavy tea/coffee/alcohol intake',
      'Frequent consumption of fried, spicy, or acidic street foods'
    ],
    complications: [
      'Erosive Esophagitis and strictures',
      'Barrett Esophagus (precancerous metaplasia)',
      'Esophageal Adenocarcinoma'
    ],
    diagnosisMethods: [
      'Upper Gastrointestinal Endoscopy (EGD)',
      '24-Hour Ambulatory Esophageal pH Monitoring',
      'Esophageal Manometry'
    ],
    generalTreatments: [
      'Lifestyle modifications and dietary adjustments',
      'Proton Pump Inhibitors (PPIs) for acid suppression',
      'H2-Receptor Antagonists and Antacids'
    ],
    evidenceBasedMeds: [
      'Omez / Pantocid / Pan-D (Proton Pump Inhibitors)',
      'Digene / Gelusil Antacid Antigas Liquid',
      'Famotidine 20mg (H2 Blocker)'
    ],
    sideEffects: [
      'PPIs: Mild headache, diarrhea, long-term reduced vitamin B12 & calcium absorption',
      'Antacids: Constipation (aluminum) or laxative effect (magnesium)'
    ],
    drugInteractions: [
      'PPIs decrease absorption of medications requiring gastric acidity (Iron supplements, Ketoconazole)',
      'Clopidogrel interaction with Omeprazole'
    ],
    safetyPrecautions: [
      'Take PPIs 30-60 minutes before the morning breakfast',
      'Avoid lying down within 2-3 hours after eating dinner'
    ],
    dietRecommendations: [
      'Eat smaller, frequent meals instead of heavy feasts',
      'Avoid citrus fruits, excessive chili, fried snacks, carbonated drinks, and late-night tea/coffee'
    ],
    exerciseRecommendations: [
      'Light 15-minute walking after meals helps stimulate gastric motility',
      'Avoid heavy abdominal exercises immediately after eating'
    ],
    lifestyleChanges: [
      'Elevate the head of your bed 6 inches',
      'Avoid tight clothing around waist line'
    ],
    recoveryTips: [
      'Keep a food diary to identify personal trigger foods'
    ],
    preventionMethods: [
      'Maintain healthy weight',
      'Finish dinner at least 2.5 hours before sleep'
    ],
    whenToSeeDoctor: [
      'Heartburn occurring more than 2-3 times per week despite over-the-counter antacids',
      'Difficulty or pain when swallowing food'
    ],
    emergencyWarningSigns: [
      'Severe chest pain radiating to jaw, neck or left arm (must rule out heart attack)',
      'Vomiting blood (Hematemesis) or dark tarry black stools (Melena)',
      'Unexplained sudden weight loss with severe swallowing pain'
    ],
    references: [
      'Indian Society of Gastroenterology (ISG) Consensus Statement on GERD',
      'ACG Guidelines for GERD Management'
    ],
    relatedMedicineIds: ['m_omeprazole_20', 'm_pantocid_d', 'm_paracetamol_500']
  },
  {
    id: 'd_migraine',
    name: 'Migraine & Vascular Headaches',
    category: 'Neurology',
    overview: 'Migraine is a complex neurovascular condition characterized by recurrent episodes of moderate to severe throbbing headache, often unilateral, with sensory hypersensitivities.',
    causes: [
      'Trigeminovascular system activation and CGRP release',
      'Cortical spreading depression in brain tissue',
      'Hormonal fluctuations in women',
      'Environmental triggers (bright sunlight, heat, noise, sleep debt)'
    ],
    symptoms: [
      'Unilateral pulsating or throbbing head pain (आधे सिर का दर्द)',
      'Photophobia (sensitivity to light) and Phonophobia (sensitivity to sound)',
      'Nausea and vomiting',
      'Visual aura (flashing zig-zag lights, blind spots) in ~25% cases'
    ],
    riskFactors: [
      'Female gender (3x more common in women)',
      'Family history of migraines',
      'High chronic mental stress levels',
      'Irregular sleep or skipping meals / fasting'
    ],
    complications: [
      'Status Migrainosus (debilitating attack lasting >72 hours)',
      'Chronic Migraine (>=15 headache days/month)',
      'Medication Overuse Headache (Rebound headache)'
    ],
    diagnosisMethods: [
      'Clinical evaluation based on ICHD-3 criteria',
      'Brain MRI / CT Scan to exclude secondary structural lesions if red flags present'
    ],
    generalTreatments: [
      'Acute abortive therapy (Triptans, NSAIDs)',
      'Prophylactic therapy for frequent attacks (Beta-blockers, Flunarizine, Topiramate)',
      'Rest in dark quiet room'
    ],
    evidenceBasedMeds: [
      'Suminat 50mg / Sumatriptan Succinate',
      'Dolo 650 / Naproxen / Ibuprofen',
      'Flunarizine / Propranolol (Preventive)'
    ],
    sideEffects: [
      'Triptans: Transient chest tightness, tingling, neck stiffness',
      'NSAIDs: Gastric mucosal irritation'
    ],
    drugInteractions: [
      'Triptans should not be combined with SSRIs/SNRIs without monitoring due to Serotonin Syndrome risk',
      'Do not take ergotamines within 24 hours of Triptans'
    ],
    safetyPrecautions: [
      'Take abortive medication at the very first onset of aura or headache phase',
      'Limit acute pain reliever use to max 10 days per month to avoid rebound headaches'
    ],
    dietRecommendations: [
      'Stay hydrated with water, coconut water, or ORS',
      'Identify and avoid triggers such as aged cheeses, MSG (Ajinomoto), fermented foods, and excessive caffeine'
    ],
    exerciseRecommendations: [
      'Regular moderate aerobic exercise improves stress resilience and reduces attack frequency'
    ],
    lifestyleChanges: [
      'Maintain regular sleep-wake routine even on weekends',
      'Practice Yoga, Pranayama, or meditation'
    ],
    recoveryTips: [
      'Apply cold ice pack or menthol balm to forehead during acute attack'
    ],
    preventionMethods: [
      'Avoid known personal triggers',
      'Maintain consistent meal and sleep schedules'
    ],
    whenToSeeDoctor: [
      'Headaches increasing in frequency, severity, or interfering with daily work',
      'Over-the-counter pain relievers no longer providing relief'
    ],
    emergencyWarningSigns: [
      'Sudden severe "Thunderclap" headache reaching maximum peak within seconds',
      'Headache accompanied by high fever, stiff neck, confusion, or focal weakness',
      'New onset headache after age 50'
    ],
    references: [
      'Indian Academy of Neurology (IAN) Guidelines on Headache Disorders',
      'International Classification of Headache Disorders (ICHD-3)'
    ],
    relatedMedicineIds: ['m_sumatriptan_50', 'm_paracetamol_500']
  }
];

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'm_metformin_500',
    brandName: 'Glycomet SR 500',
    genericName: 'Metformin Hydrochloride Extended Release',
    category: 'Antidiabetic / Biguanide',
    diseaseIds: ['d_diabetes_t2'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/ko6rsu9xwrdb7hrmmszr.jpg',
    dosageForm: 'Tablet',
    strength: '500 mg Extended Release',
    usageInstructions: 'Take 1 tablet orally with evening meal or dinner.',
    commonSideEffects: ['Nausea', 'Mild stomach discomfort', 'Diarrhea', 'Metallic taste'],
    warnings: ['Take with meals', 'Avoid alcohol consumption', 'Consult doctor before radiological dye tests'],
    availability: 'In Stock',
    estimatedPrice: 38.50,
    originalPrice: 48.00,
    manufacturer: 'USV Private Limited',
    rating: 4.8,
    reviewsCount: 420,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/glycomet-500-sr-tablet-117725',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of tablets'
  },
  {
    id: 'm_amlodipine_5',
    brandName: 'Amlokind 5mg',
    genericName: 'Amlodipine Besylate',
    category: 'Antihypertensive / Calcium Channel Blocker',
    diseaseIds: ['d_hypertension'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/vjq7re777vrattte6rrx.jpg',
    dosageForm: 'Tablet',
    strength: '5 mg',
    usageInstructions: 'Take 1 tablet daily in the morning with water.',
    commonSideEffects: ['Ankle swelling (edema)', 'Dizziness', 'Facial flushing', 'Headache'],
    warnings: ['Do not stop abruptly without doctor advise', 'Caution when driving if lightheaded'],
    availability: 'In Stock',
    estimatedPrice: 28.00,
    originalPrice: 35.00,
    manufacturer: 'Mankind Pharma Ltd',
    rating: 4.7,
    reviewsCount: 389,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/amlokind-5-tablet-665338',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'm_salbutamol_100',
    brandName: 'Asthalin Inhaler',
    genericName: 'Salbutamol Sulfate',
    category: 'Bronchodilator / Beta-2 Agonist',
    diseaseIds: ['d_asthma'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/9117d15a82fc4d41889e083e295d7de9.jpg',
    dosageForm: 'Inhaler',
    strength: '100 mcg per puff (200 actuations)',
    usageInstructions: 'Inhale 1 to 2 puffs as needed for sudden breathlessness or wheezing.',
    commonSideEffects: ['Mild muscle tremor', 'Temporary rapid heartbeat', 'Headache'],
    warnings: ['Keep rescue inhaler accessible at all times', 'Rinse mouth after inhaler usage'],
    availability: 'In Stock',
    estimatedPrice: 145.00,
    originalPrice: 175.00,
    manufacturer: 'Cipla Limited',
    rating: 4.9,
    reviewsCount: 612,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/asthalin-100mcg-inhaler-141944',
    regulatorySchedule: 'Schedule H',
    packSize: 'Inhaler of 200 metered doses'
  },
  {
    id: 'm_omeprazole_20',
    brandName: 'Omez 20mg Capsule',
    genericName: 'Omeprazole Delayed Release',
    category: 'Gastrointestinal / Proton Pump Inhibitor',
    diseaseIds: ['d_gerd'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/sexw0ojgwtx60ma7b0ib.jpg',
    dosageForm: 'Capsule',
    strength: '20 mg',
    usageInstructions: 'Swallow 1 capsule whole with water 30 minutes before morning breakfast.',
    commonSideEffects: ['Headache', 'Abdominal pain', 'Flatulence', 'Mild diarrhea'],
    warnings: ['Do not crush or chew capsule', 'Consult physician if symptoms persist over 14 days'],
    availability: 'In Stock',
    estimatedPrice: 58.00,
    originalPrice: 72.00,
    manufacturer: "Dr. Reddy's Laboratories",
    rating: 4.7,
    reviewsCount: 298,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/drugs/omez-capsule-356834',
    regulatorySchedule: 'OTC',
    packSize: 'Strip of 20 capsules'
  },
  {
    id: 'm_sumatriptan_50',
    brandName: 'Suminat 50mg',
    genericName: 'Sumatriptan Succinate',
    category: 'Neurology / Triptan Antimigraine',
    diseaseIds: ['d_migraine'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/so7sxp1zgkrpddaeaqto.jpg',
    dosageForm: 'Tablet',
    strength: '50 mg',
    usageInstructions: 'Take 1 tablet at the immediate onset of migraine headache attack.',
    commonSideEffects: ['Warm/cold sensation', 'Tightness in throat or neck', 'Drowsiness'],
    warnings: ['Do not exceed 200mg in 24 hours', 'Contraindicated in severe heart conditions'],
    availability: 'In Stock',
    estimatedPrice: 185.00,
    originalPrice: 220.00,
    manufacturer: 'Sun Pharmaceutical Industries',
    rating: 4.8,
    reviewsCount: 215,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/suminat-50-tablet-70659',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of tablets'
  },
  {
    id: 'm_atorvastatin_20',
    brandName: 'Atorva 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular / Statin Antihyperlipidemic',
    diseaseIds: ['d_diabetes_t2', 'd_hypertension'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/a26355cfe6894c65b3084e81ac816df6.jpg',
    dosageForm: 'Tablet',
    strength: '20 mg',
    usageInstructions: 'Take 1 tablet once daily at bedtime.',
    commonSideEffects: ['Mild muscle aches', 'Joint stiffness', 'Nausea'],
    warnings: ['Report unexplained severe muscle pain or weakness immediately'],
    availability: 'In Stock',
    estimatedPrice: 165.00,
    originalPrice: 210.00,
    manufacturer: 'Zydus Healthcare',
    rating: 4.7,
    reviewsCount: 310,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/atorva-20-tablet-513352',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of tablets'
  },
  {
    id: 'm_paracetamol_500',
    brandName: 'Dolo 650mg / Crocin 500mg',
    genericName: 'Paracetamol',
    category: 'Analgesic & Antipyretic',
    diseaseIds: ['d_migraine', 'd_gerd'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/mu5bahqxfrp28cut6que.jpg',
    dosageForm: 'Tablet',
    strength: '650 mg',
    usageInstructions: 'Take 1 tablet every 6 hours as needed for fever or pain.',
    commonSideEffects: ['Rare at recommended doses', 'Mild skin rash in sensitive individuals'],
    warnings: ['Do not exceed 4,000 mg in 24 hours', 'Avoid alcohol to prevent liver overload'],
    availability: 'In Stock',
    estimatedPrice: 32.00,
    originalPrice: 42.00,
    manufacturer: 'Micro Labs Limited',
    rating: 4.9,
    reviewsCount: 1240,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/drugs/dolo-650-tablet-74467',
    regulatorySchedule: 'OTC',
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'm_cetirizine_10',
    brandName: 'Okacet 10mg',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine / Anti-allergy',
    diseaseIds: ['d_asthma'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/93761161f3e4401a805b064a24a4e846.jpg',
    dosageForm: 'Tablet',
    strength: '10 mg',
    usageInstructions: 'Take 1 tablet once daily with glass of water.',
    commonSideEffects: ['Mild drowsiness in some individuals', 'Dry mouth'],
    warnings: ['Use caution when driving until you know how medication affects you'],
    availability: 'In Stock',
    estimatedPrice: 22.00,
    originalPrice: 28.00,
    manufacturer: 'Cipla Limited',
    rating: 4.8,
    reviewsCount: 520,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/drugs/new-okacet-tablet-781966',
    regulatorySchedule: 'OTC',
    packSize: 'Strip of 10 tablets'
  },
  {
    id: 'm_pantocid_d',
    brandName: 'Pan-D Capsule',
    genericName: 'Pantoprazole 40mg + Domperidone 30mg',
    category: 'Gastrointestinal / Anti-reflux',
    diseaseIds: ['d_gerd'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/jayxjxwryxsuqoyyb29m.jpg',
    dosageForm: 'Capsule',
    strength: '40mg + 30mg SR',
    usageInstructions: 'Take 1 capsule on an empty stomach 30 minutes before morning breakfast.',
    commonSideEffects: ['Dry mouth', 'Headache', 'Mild diarrhea'],
    warnings: ['Swallow whole; do not chew or crush capsule'],
    availability: 'In Stock',
    estimatedPrice: 135.00,
    originalPrice: 165.00,
    manufacturer: 'Alkem Laboratories',
    rating: 4.8,
    reviewsCount: 410,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/pan-d-capsule-pr-629299',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 15 capsules'
  },
  {
    id: 'm_volini_gel',
    brandName: 'Volini Pain Relief Gel (50g)',
    genericName: 'Diclofenac Diethylamine + Menthol + Linseed Oil',
    category: 'Topical Pain Relief Gel',
    diseaseIds: ['d_migraine'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/a6aa979aa80b4b12b1700affc8990058.jpg',
    dosageForm: 'Ointment',
    strength: '50 gram tube',
    usageInstructions: 'Gently apply 3-4 times daily to affected muscle or neck areas.',
    commonSideEffects: ['Mild skin redness or tingling'],
    warnings: ['For external use only; do not apply on open wounds'],
    availability: 'In Stock',
    estimatedPrice: 118.00,
    originalPrice: 145.00,
    manufacturer: 'Sun Pharmaceutical Industries',
    rating: 4.9,
    reviewsCount: 780,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/otc/volini-pain-relief-gel-otc344449',
    regulatorySchedule: 'OTC',
    packSize: 'Tube of 50 gm gel'
  },
  {
    id: 'm_telma_40',
    brandName: 'Telma 40 Tablet',
    genericName: 'Telmisartan',
    category: 'Antihypertensive / ARB',
    diseaseIds: ['d_hypertension'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/098efd0233f445b99635b584b3ba0ec3.jpg',
    dosageForm: 'Tablet',
    strength: '40 mg',
    usageInstructions: 'Take once daily at the same time or exactly as prescribed for blood pressure control.',
    commonSideEffects: ['Dizziness', 'Back pain', 'Sinus inflammation', 'Low blood pressure in some users'],
    warnings: ['Avoid during pregnancy', 'Monitor kidney function and potassium if advised by doctor'],
    availability: 'In Stock',
    estimatedPrice: 245.00,
    originalPrice: 280.00,
    manufacturer: 'Glenmark Pharmaceuticals Ltd',
    rating: 4.8,
    reviewsCount: 690,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/telma-40-tablet-340679',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 30 tablets'
  },
  {
    id: 'm_azithral_500',
    brandName: 'Azithral 500 Tablet',
    genericName: 'Azithromycin',
    category: 'Antibiotic / Macrolide',
    diseaseIds: ['d_asthma'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/kqkouvaqejbyk47dvjfu.jpg',
    dosageForm: 'Tablet',
    strength: '500 mg',
    usageInstructions: 'Take once daily for the number of days prescribed; complete the full antibiotic course.',
    commonSideEffects: ['Nausea', 'Abdominal pain', 'Loose stools', 'Headache'],
    warnings: ['Use only with a valid prescription', 'Do not self-medicate antibiotics'],
    availability: 'In Stock',
    estimatedPrice: 119.00,
    originalPrice: 132.00,
    manufacturer: 'Alembic Pharmaceuticals Ltd',
    rating: 4.7,
    reviewsCount: 980,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/azithral-500-tablet-325616',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 5 tablets'
  },
  {
    id: 'm_augmentin_625',
    brandName: 'Augmentin 625 Duo Tablet',
    genericName: 'Amoxycillin + Clavulanic Acid',
    category: 'Antibiotic / Penicillin Combination',
    diseaseIds: ['d_asthma'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/wy2y9bdipmh6rgkrj0zm.jpg',
    dosageForm: 'Tablet',
    strength: '500 mg + 125 mg',
    usageInstructions: 'Take with food exactly as prescribed and complete the full course.',
    commonSideEffects: ['Vomiting', 'Nausea', 'Diarrhea', 'Skin rash'],
    warnings: ['Prescription antibiotic', 'Tell your doctor about penicillin allergy before use'],
    availability: 'In Stock',
    estimatedPrice: 204.00,
    originalPrice: 227.00,
    manufacturer: 'Glaxo SmithKline Pharmaceuticals Ltd',
    rating: 4.8,
    reviewsCount: 1420,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/augmentin-625-duo-tablet-138629',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 10 tablets'
  },
  {
    id: 'm_ecosprin_av_75',
    brandName: 'Ecosprin-AV 75 Capsule',
    genericName: 'Aspirin + Atorvastatin',
    category: 'Cardiovascular / Antiplatelet + Statin',
    diseaseIds: ['d_hypertension', 'd_diabetes_t2'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/7bb14353d11448548620b958be35e900.jpg',
    dosageForm: 'Capsule',
    strength: '75 mg + 10 mg',
    usageInstructions: 'Take after food at the time recommended by the cardiologist.',
    commonSideEffects: ['Indigestion', 'Bleeding tendency', 'Muscle pain', 'Stomach discomfort'],
    warnings: ['Do not stop without doctor advice', 'Inform doctor before surgery or dental procedures'],
    availability: 'In Stock',
    estimatedPrice: 62.00,
    originalPrice: 66.00,
    manufacturer: 'USV Private Limited',
    rating: 4.8,
    reviewsCount: 720,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/ecosprin-av-75-capsule-123637',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 15 capsules'
  },
  {
    id: 'm_thyronorm_50',
    brandName: 'THYronorm 50mcg Tablet',
    genericName: 'Thyroxine Sodium',
    category: 'Thyroid / Hormone Replacement',
    diseaseIds: ['d_diabetes_t2'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/pharmacy-production-rxs%2F1745998001_crop_111.png',
    dosageForm: 'Tablet',
    strength: '50 mcg',
    usageInstructions: 'Take on an empty stomach in the morning, at least 30 minutes before food.',
    commonSideEffects: ['Palpitations if dose is high', 'Weight changes', 'Restlessness'],
    warnings: ['Dose should be guided by thyroid tests', 'Do not switch strength without doctor advice'],
    availability: 'In Stock',
    estimatedPrice: 174.00,
    originalPrice: 190.00,
    manufacturer: 'Abbott',
    rating: 4.9,
    reviewsCount: 1160,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/thyronorm-50mcg-tablet-357013',
    regulatorySchedule: 'Schedule H',
    packSize: 'Bottle of 120 tablets'
  },
  {
    id: 'm_shelcal_hd',
    brandName: 'Shelcal-HD Tablet',
    genericName: 'Calcium + Vitamin D3',
    category: 'Supplements / Bone Health',
    diseaseIds: ['d_diabetes_t2'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/0ad516cd1dbe47b2ac4d559f6f237900.jpg',
    dosageForm: 'Tablet',
    strength: 'Calcium + Vitamin D3',
    usageInstructions: 'Take once daily after food or as advised for calcium and vitamin D supplementation.',
    commonSideEffects: ['Constipation', 'Bloating', 'Mild stomach upset'],
    warnings: ['Ask a doctor if you have kidney stones or high calcium levels'],
    availability: 'In Stock',
    estimatedPrice: 155.00,
    originalPrice: 163.00,
    manufacturer: 'Torrent Pharmaceuticals Ltd',
    rating: 4.5,
    reviewsCount: 860,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/drugs/shelcal-hd-tablet-with-calcium-vitamin-d3-bone-joint-muscle-care-113885',
    regulatorySchedule: 'OTC',
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'm_montair_lc',
    brandName: 'Montair-LC Tablet',
    genericName: 'Montelukast + Levocetirizine',
    category: 'Respiratory / Anti-allergy',
    diseaseIds: ['d_asthma'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/wbcmitb6ibmotmsy9st6.jpg',
    dosageForm: 'Tablet',
    strength: '10 mg + 5 mg',
    usageInstructions: 'Take in the evening or at bedtime as prescribed for allergy and asthma-linked symptoms.',
    commonSideEffects: ['Sleepiness', 'Dry mouth', 'Headache', 'Fatigue'],
    warnings: ['May cause drowsiness', 'Report mood or behavior changes to doctor'],
    availability: 'In Stock',
    estimatedPrice: 218.00,
    originalPrice: 242.00,
    manufacturer: 'Cipla Limited',
    rating: 4.8,
    reviewsCount: 1380,
    prescriptionRequired: true,
    sourceUrl: 'https://www.1mg.com/drugs/montair-lc-tablet-565306',
    regulatorySchedule: 'Schedule H',
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'm_allegra_120',
    brandName: 'Allegra 120mg Tablet',
    genericName: 'Fexofenadine',
    category: 'Anti-allergy / Antihistamine',
    diseaseIds: ['d_asthma'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/fa7427131ec64163b5bbafb529df0736.jpg',
    dosageForm: 'Tablet',
    strength: '120 mg',
    usageInstructions: 'Take once daily with water; avoid taking with fruit juice.',
    commonSideEffects: ['Headache', 'Drowsiness in some users', 'Nausea'],
    warnings: ['Check with doctor before use in kidney disease', 'Do not exceed the recommended dose'],
    availability: 'In Stock',
    estimatedPrice: 178.00,
    originalPrice: 196.00,
    manufacturer: 'Sanofi India Ltd',
    rating: 4.8,
    reviewsCount: 1040,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/drugs/allegra-120mg-tablet-68763',
    regulatorySchedule: 'OTC',
    packSize: 'Strip of 10 tablets'
  },
  {
    id: 'm_combiflam',
    brandName: 'Combiflam Tablet',
    genericName: 'Ibuprofen + Paracetamol',
    category: 'Pain Relief / Fever',
    diseaseIds: ['d_migraine'],
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/niowfyzxquufm1i2zqgo.jpg',
    dosageForm: 'Tablet',
    strength: '400 mg + 325 mg',
    usageInstructions: 'Take after food for short-term pain or fever relief as advised.',
    commonSideEffects: ['Acidity', 'Nausea', 'Stomach pain', 'Heartburn'],
    warnings: ['Avoid in stomach ulcer or severe kidney disease unless doctor advises', 'Do not combine with other paracetamol products'],
    availability: 'In Stock',
    estimatedPrice: 42.00,
    originalPrice: 49.00,
    manufacturer: 'Sanofi India Ltd',
    rating: 4.7,
    reviewsCount: 1520,
    prescriptionRequired: false,
    sourceUrl: 'https://www.1mg.com/drugs/combiflam-tablet-325414',
    regulatorySchedule: 'OTC',
    packSize: 'Strip of 20 tablets'
  }
];

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: 'rec_blood_01',
    userId: 'demo_patient_123',
    title: 'Comprehensive Blood Panel & Lipid Profile',
    type: 'Blood Test',
    category: 'Laboratory',
    date: '2025-02-10',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Blood_Panel_Feb_2025.pdf',
    fileSize: '1.2 MB',
    aiSummary: 'Fasting Glucose is 98 mg/dL (Normal). Total Cholesterol is 185 mg/dL (Desirable). HbA1c is 5.4% (Normal). Serum Potassium is balanced at 4.2 mEq/L.',
    keyFindings: ['HbA1c: 5.4% (Healthy Range)', 'Fasting Glucose: 98 mg/dL', 'Lipid Panel: Triglycerides optimal'],
    tags: ['Blood Test', 'Fasting Glucose', 'Lipids'],
    doctorName: 'Dr. Rajesh Verma, MD (AIIMS Delhi)'
  },
  {
    id: 'rec_xray_02',
    userId: 'demo_patient_123',
    title: 'Chest X-Ray (PA View)',
    type: 'X-Ray',
    category: 'Radiology',
    date: '2024-11-04',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    fileName: 'Chest_XRay_PA_Nov2024.png',
    fileSize: '3.8 MB',
    aiSummary: 'Lungs are clear bilaterally with no active parenchymal infiltrates, consolidation, or pleural effusion. Cardiac silhouette is normal size.',
    keyFindings: ['No pulmonary infiltrates', 'Normal cardiothoracic ratio (< 0.5)', 'Bony thorax intact'],
    tags: ['Radiology', 'Chest X-Ray', 'Lungs'],
    doctorName: 'Dr. Sunita Rao, MD (Apollo Hospitals)'
  },
  {
    id: 'rec_presc_03',
    userId: 'demo_patient_123',
    title: 'Cardiology Follow-Up Prescription',
    type: 'Prescription',
    category: 'Prescription',
    date: '2025-01-20',
    fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    fileName: 'Cardio_Prescription_Jan2025.pdf',
    fileSize: '850 KB',
    aiSummary: 'Prescribed Amlokind 5mg OD for BP maintenance. Advised continuous BP monitoring twice weekly and low-salt diet compliance.',
    keyFindings: ['Amlokind 5mg Daily', 'Target Blood Pressure: < 125/80 mmHg'],
    tags: ['Prescription', 'Hypertension', 'Cardiology'],
    doctorName: 'Dr. Rajesh Verma, MD (AIIMS Delhi)'
  }
];

const monthVitalsSeed = [
  [128, 82, 72, 98, 96, 69.2], [126, 81, 71, 98, 95, 69.1], [129, 83, 74, 97, 99, 69.0],
  [125, 80, 70, 98, 94, 68.9], [124, 80, 68, 99, 94, 68.8], [127, 82, 73, 98, 97, 68.8],
  [123, 79, 69, 99, 93, 68.7], [122, 78, 70, 98, 92, 68.6], [121, 78, 71, 98, 94, 68.6],
  [124, 79, 72, 97, 96, 68.5], [122, 78, 70, 98, 92, 68.5], [120, 77, 68, 99, 91, 68.4],
  [119, 76, 69, 99, 90, 68.4], [123, 79, 72, 98, 95, 68.3], [120, 78, 71, 98, 95, 68.2],
  [118, 76, 69, 99, 91, 68.2], [117, 75, 68, 99, 90, 68.1], [121, 77, 70, 98, 93, 68.1],
  [119, 76, 69, 98, 91, 68.0], [118, 76, 69, 99, 91, 68.0], [122, 78, 72, 98, 94, 68.1],
  [120, 77, 70, 98, 92, 68.0], [119, 76, 69, 99, 91, 67.9], [118, 75, 68, 99, 90, 67.9],
  [121, 78, 71, 98, 93, 67.9], [119, 76, 70, 98, 92, 67.8], [118, 76, 69, 99, 91, 67.8],
  [117, 75, 68, 99, 90, 67.8], [120, 77, 70, 98, 92, 67.9], [119, 76, 69, 99, 91, 67.8],
  [118, 75, 68, 99, 90, 67.8]
];

export const MOCK_HEALTH_METRICS: HealthMetric[] = monthVitalsSeed.map((reading, index) => {
  const [systolic, diastolic, heartRate, oxygen, glucose, weight] = reading;
  return {
    id: `m${index + 1}`,
    userId: 'demo_patient_123',
    date: `2025-03-${String(index + 1).padStart(2, '0')}`,
    weightKg: weight,
    bloodPressureSystolic: systolic,
    bloodPressureDiastolic: diastolic,
    bloodGlucoseMgDl: glucose,
    heartRateBpm: heartRate,
    oxygenSaturationPct: oxygen,
    pulseRateBpm: heartRate,
    bmi: Number((weight / (1.72 * 1.72)).toFixed(1))
  };
});

export const MOCK_REMINDERS: Reminder[] = [
  { id: 'rem_1', userId: 'demo_patient_123', title: 'Amlokind 5mg Tablet', type: 'Medicine', time: '08:00 AM', frequency: 'Daily', active: true, dosageDetails: '1 Tablet with morning water' },
  { id: 'rem_2', userId: 'demo_patient_123', title: 'Hydration Intake (500ml Water)', type: 'Water', time: '11:00 AM', frequency: 'Daily', active: true, dosageDetails: '2 glasses of water' },
  { id: 'rem_3', userId: 'demo_patient_123', title: 'Evening Brisk Walk / Yoga', type: 'Exercise', time: '06:30 PM', frequency: 'Daily', active: true, dosageDetails: '30 minutes continuous walk' },
  { id: 'rem_4', userId: 'demo_patient_123', title: 'Multivitamin Capsule', type: 'Medicine', time: '09:00 PM', frequency: 'Daily', active: true, dosageDetails: '1 capsule after dinner' }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'app_1', userId: 'demo_patient_123', doctorName: 'Dr. Rajesh Verma', specialty: 'Cardiologist', date: '2025-03-05', time: '10:30 AM', mode: 'In-Person', locationOrLink: 'AIIMS OPD Block, Suite 304, New Delhi', status: 'Scheduled', notes: 'Routine 6-month BP checkup & prescription renewal' },
  { id: 'app_2', userId: 'demo_patient_123', doctorName: 'Dr. Ananya Sen', specialty: 'Dermatologist', date: '2025-03-18', time: '02:00 PM', mode: 'Video Consultation', locationOrLink: 'https://mediguide.ai/telehealth/sen-318', status: 'Scheduled', notes: 'Skin mole consultation' }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-IND-98421',
    userId: 'demo_patient_123',
    userName: 'Aarav Sharma',
    userPhone: '+91 98765 43210',
    items: [
      { medicine: MOCK_MEDICINES[1], quantity: 2 }, // Amlokind 5mg (₹28 * 2 = ₹56)
      { medicine: MOCK_MEDICINES[6], quantity: 1 }  // Dolo 650mg (₹32 * 1 = ₹32)
    ],
    subtotal: 88.00,
    shippingFee: 25.00,
    tax: 4.00,
    totalAmount: 117.00,
    deliveryAddress: 'Flat 402, Green Park Extension, Hauz Khas, New Delhi - 110016',
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    trackingNumber: 'TRK-IND-8839210',
    createdAt: '2025-02-22T14:30:00.000Z',
    estimatedDelivery: '2025-02-24',
    prescriptionRequired: true,
    prescriptionFileName: 'Cardio_Prescription_Jan2025.pdf',
    prescriptionUploadedAt: '2025-02-22T14:25:00.000Z'
  }
];
