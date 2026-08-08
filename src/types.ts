export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dob: string;
  heightCm: number;
  weightKg: number;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  allergies: string[];
  currentMedications: string[];
  lifestyleHabits: string;
  familyHistory: string;
  existingDiseases: string[];
  pastSurgeries: string[];
  vaccinationHistory: string[];
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecord {
  id: string;
  userId: string;
  title: string;
  type: 'Blood Test' | 'MRI' | 'CT Scan' | 'X-Ray' | 'Prescription' | 'Health Certificate' | 'Lab Report' | 'Other';
  category: string;
  date: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  uploadedAt?: string;
  encrypted?: boolean;
  aiSummary?: string;
  keyFindings?: string[];
  tags?: string[];
  doctorName?: string;
}

export interface Disease {
  id: string;
  name: string;
  category: 'Cardiology' | 'Endocrinology' | 'Neurology' | 'Respiratory' | 'Dermatology' | 'Gastrointestinal' | 'Infectious' | 'Orthopedic' | 'Mental Health' | 'General';
  overview: string;
  causes: string[];
  symptoms: string[];
  riskFactors: string[];
  complications: string[];
  diagnosisMethods: string[];
  generalTreatments: string[];
  evidenceBasedMeds: string[];
  sideEffects: string[];
  drugInteractions: string[];
  safetyPrecautions: string[];
  dietRecommendations: string[];
  exerciseRecommendations: string[];
  lifestyleChanges: string[];
  recoveryTips: string[];
  preventionMethods: string[];
  whenToSeeDoctor: string[];
  emergencyWarningSigns: string[];
  references: string[];
  relatedMedicineIds?: string[];
}

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  category: string;
  diseaseIds: string[];
  image: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Inhaler' | 'Drops';
  strength: string;
  usageInstructions: string;
  commonSideEffects: string[];
  warnings: string[];
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  estimatedPrice: number;
  originalPrice: number;
  manufacturer: string;
  rating: number;
  reviewsCount: number;
  prescriptionRequired: boolean;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: 'Credit/Debit Card' | 'UPI / NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  createdAt: string;
  estimatedDelivery: string;
  invoiceUrl?: string;
  prescriptionRequired?: boolean;
  prescriptionFileName?: string;
  prescriptionFileSize?: string;
  prescriptionFileDataUrl?: string;
  prescriptionUploadedAt?: string;
}

export interface HealthMetric {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodGlucoseMgDl: number;
  heartRateBpm: number;
  oxygenSaturationPct?: number;
  pulseRateBpm?: number;
  bmi: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  mode: 'In-Person' | 'Video Consultation';
  locationOrLink: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  type: 'Medicine' | 'Water' | 'Exercise' | 'Appointment' | 'Health Tip';
  time: string;
  frequency: 'Daily' | 'Twice Daily' | 'Weekly' | 'Custom';
  active: boolean;
  dosageDetails?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'order' | 'health_tip' | 'system';
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  emergencyWarning?: boolean;
  reportAnalysis?: boolean;
  suggestedActions?: string[];
}

export interface AdminStats {
  totalPatients: number;
  totalDiseases: number;
  totalMedicines: number;
  totalOrders: number;
  revenueTotal: number;
  pendingOrdersCount: number;
}
