import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { UserProfile, Disease, Medicine, MedicalRecord, Order, Reminder, HealthMetric, AdminStats } from '../types';
import { INITIAL_PATIENT_PROFILE, MOCK_DISEASES, MOCK_MEDICINES, MOCK_RECORDS, MOCK_HEALTH_METRICS, MOCK_REMINDERS, MOCK_ORDERS } from '../data/mockData';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfigJson);
  } else {
    app = getApp();
  }
  
  auth = getAuth(app);
  
  // Use custom firestore database ID if specified in config
  if (firebaseConfigJson.firestoreDatabaseId) {
    db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }

  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization warning (falling back to client mock state):", error);
}

export { app, auth, db, storage };

// Local persistence cache key for preview fallback
const LOCAL_STORAGE_USER = 'mediguide_current_user_profile';
const LOCAL_STORAGE_DISEASES = 'mediguide_diseases_db';
const LOCAL_STORAGE_MEDICINES = 'mediguide_medicines_db';
const LOCAL_STORAGE_RECORDS = 'mediguide_records_db';
const LOCAL_STORAGE_ORDERS = 'mediguide_orders_db';
const LOCAL_STORAGE_METRICS = 'mediguide_metrics_db';
const LOCAL_STORAGE_REMINDERS = 'mediguide_reminders_db';

// Initialize LocalStorage Defaults if empty
export function initLocalData() {
  if (!localStorage.getItem(LOCAL_STORAGE_USER)) {
    localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(INITIAL_PATIENT_PROFILE));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_DISEASES)) {
    localStorage.setItem(LOCAL_STORAGE_DISEASES, JSON.stringify(MOCK_DISEASES));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_MEDICINES)) {
    localStorage.setItem(LOCAL_STORAGE_MEDICINES, JSON.stringify(MOCK_MEDICINES));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_RECORDS)) {
    localStorage.setItem(LOCAL_STORAGE_RECORDS, JSON.stringify(MOCK_RECORDS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_ORDERS)) {
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(MOCK_ORDERS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_METRICS)) {
    localStorage.setItem(LOCAL_STORAGE_METRICS, JSON.stringify(MOCK_HEALTH_METRICS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_REMINDERS)) {
    localStorage.setItem(LOCAL_STORAGE_REMINDERS, JSON.stringify(MOCK_REMINDERS));
  }
}

// Ensure init on module load
initLocalData();

// --- AUTH FUNCTIONS ---
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  try {
    if (auth) {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await getUserProfile(res.user.uid);
      if (profile) return profile;
    }
  } catch (err) {
    console.warn("Firebase email auth fallback:", err);
  }

  // Fallback demo auth
  const saved = localStorage.getItem(LOCAL_STORAGE_USER);
  const current: UserProfile = saved ? JSON.parse(saved) : INITIAL_PATIENT_PROFILE;
  current.email = email;
  localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(current));
  return current;
}

export async function signUpWithEmail(email: string, pass: string, fullName: string): Promise<UserProfile> {
  let uid = 'user_' + Date.now();
  try {
    if (auth) {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      uid = res.user.uid;
    }
  } catch (err) {
    console.warn("Firebase signup fallback:", err);
  }

  const newProfile: UserProfile = {
    ...INITIAL_PATIENT_PROFILE,
    uid,
    fullName,
    email,
    role: 'patient',
    createdAt: new Date().toISOString()
  };

  await saveUserProfile(newProfile);
  return newProfile;
}

export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    if (auth) {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      let profile = await getUserProfile(res.user.uid);
      if (!profile) {
        profile = {
          ...INITIAL_PATIENT_PROFILE,
          uid: res.user.uid,
          fullName: res.user.displayName || 'Google User',
          email: res.user.email || 'google.user@mediguide.ai',
          avatarUrl: res.user.photoURL || undefined
        };
        await saveUserProfile(profile);
      }
      return profile;
    }
  } catch (err) {
    console.warn("Google login popup fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_USER);
  const current: UserProfile = saved ? JSON.parse(saved) : INITIAL_PATIENT_PROFILE;
  current.fullName = 'Google Demo User';
  localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(current));
  return current;
}

export async function resetPassword(email: string): Promise<void> {
  try {
    if (auth) {
      await sendPasswordResetEmail(auth, email);
    }
  } catch (err) {
    console.warn("Reset password fallback:", err);
  }
}

export async function switchDemoRole(role: 'patient' | 'doctor' | 'admin'): Promise<UserProfile> {
  const saved = localStorage.getItem(LOCAL_STORAGE_USER);
  let current: UserProfile = saved ? JSON.parse(saved) : INITIAL_PATIENT_PROFILE;
  
  if (role === 'admin') {
    current = {
      ...current,
      uid: 'demo_admin_999',
      fullName: 'Dr. Ananya Sen (Chief Admin)',
      email: 'admin.ananya@mediguide.ai',
      role: 'admin'
    };
  } else if (role === 'doctor') {
    current = {
      ...current,
      uid: 'demo_doctor_888',
      fullName: 'Dr. Rajesh Verma, MD (AIIMS Delhi)',
      email: 'rajesh.verma@mediguide.ai',
      role: 'doctor'
    };
  } else {
    current = {
      ...INITIAL_PATIENT_PROFILE
    };
  }

  localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(current));
  if (db && current.uid) {
    try {
      await setDoc(doc(db, 'users', current.uid), current, { merge: true });
    } catch (e) {
      // ignore
    }
  }
  return current;
}

export async function logoutUser(): Promise<void> {
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (err) {
    console.warn("Signout error:", err);
  }
}

// --- USER PROFILE FIRESTORE ---
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (db) {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    }
  } catch (err) {
    console.warn("Firestore getUserProfile fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_USER);
  return saved ? JSON.parse(saved) : INITIAL_PATIENT_PROFILE;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(profile));

  try {
    if (db && profile.uid) {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore saveUserProfile error:", err);
  }
}

// --- DISEASES FIRESTORE ---
export async function fetchDiseases(): Promise<Disease[]> {
  try {
    if (db) {
      const snap = await getDocs(collection(db, 'diseases'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Disease));
      }
    }
  } catch (err) {
    console.warn("Firestore fetchDiseases fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_DISEASES);
  return saved ? JSON.parse(saved) : MOCK_DISEASES;
}

export async function saveDisease(disease: Disease): Promise<void> {
  const current = await fetchDiseases();
  const idx = current.findIndex(d => d.id === disease.id);
  if (idx >= 0) {
    current[idx] = disease;
  } else {
    current.push(disease);
  }
  localStorage.setItem(LOCAL_STORAGE_DISEASES, JSON.stringify(current));

  try {
    if (db) {
      await setDoc(doc(db, 'diseases', disease.id), disease, { merge: true });
    }
  } catch (e) {
    console.warn("Firestore saveDisease error:", e);
  }
}

export async function deleteDisease(id: string): Promise<void> {
  let current = await fetchDiseases();
  current = current.filter(d => d.id !== id);
  localStorage.setItem(LOCAL_STORAGE_DISEASES, JSON.stringify(current));

  try {
    if (db) {
      await deleteDoc(doc(db, 'diseases', id));
    }
  } catch (e) {
    console.warn("Firestore deleteDisease error:", e);
  }
}

// --- MEDICINES FIRESTORE ---
export async function fetchMedicines(): Promise<Medicine[]> {
  try {
    if (db) {
      const snap = await getDocs(collection(db, 'medicines'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Medicine));
      }
    }
  } catch (err) {
    console.warn("Firestore fetchMedicines fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_MEDICINES);
  return saved ? JSON.parse(saved) : MOCK_MEDICINES;
}

export async function saveMedicine(medicine: Medicine): Promise<void> {
  const current = await fetchMedicines();
  const idx = current.findIndex(m => m.id === medicine.id);
  if (idx >= 0) {
    current[idx] = medicine;
  } else {
    current.push(medicine);
  }
  localStorage.setItem(LOCAL_STORAGE_MEDICINES, JSON.stringify(current));

  try {
    if (db) {
      await setDoc(doc(db, 'medicines', medicine.id), medicine, { merge: true });
    }
  } catch (e) {
    console.warn("Firestore saveMedicine error:", e);
  }
}

export async function deleteMedicine(id: string): Promise<void> {
  let current = await fetchMedicines();
  current = current.filter(m => m.id !== id);
  localStorage.setItem(LOCAL_STORAGE_MEDICINES, JSON.stringify(current));

  try {
    if (db) {
      await deleteDoc(doc(db, 'medicines', id));
    }
  } catch (e) {
    console.warn("Firestore deleteMedicine error:", e);
  }
}

// --- MEDICAL RECORDS FIRESTORE ---
export async function fetchMedicalRecords(userId: string): Promise<MedicalRecord[]> {
  try {
    if (db) {
      const q = query(collection(db, 'medical_records'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as MedicalRecord));
      }
    }
  } catch (err) {
    console.warn("Firestore fetchMedicalRecords fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_RECORDS);
  const records: MedicalRecord[] = saved ? JSON.parse(saved) : MOCK_RECORDS;
  return records.filter(r => r.userId === userId || userId === 'demo_patient_123');
}

export async function addMedicalRecord(record: MedicalRecord): Promise<void> {
  const saved = localStorage.getItem(LOCAL_STORAGE_RECORDS);
  const current: MedicalRecord[] = saved ? JSON.parse(saved) : MOCK_RECORDS;
  current.unshift(record);
  localStorage.setItem(LOCAL_STORAGE_RECORDS, JSON.stringify(current));

  try {
    if (db) {
      await setDoc(doc(db, 'medical_records', record.id), record);
    }
  } catch (e) {
    console.warn("Firestore addMedicalRecord error:", e);
  }
}

export async function deleteMedicalRecord(id: string): Promise<void> {
  const saved = localStorage.getItem(LOCAL_STORAGE_RECORDS);
  let current: MedicalRecord[] = saved ? JSON.parse(saved) : MOCK_RECORDS;
  current = current.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_STORAGE_RECORDS, JSON.stringify(current));

  try {
    if (db) {
      await deleteDoc(doc(db, 'medical_records', id));
    }
  } catch (e) {
    console.warn("Firestore deleteMedicalRecord error:", e);
  }
}

// --- ORDERS FIRESTORE ---
export async function fetchOrders(userId: string): Promise<Order[]> {
  try {
    if (db) {
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      }
    }
  } catch (err) {
    console.warn("Firestore fetchOrders fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
  const orders: Order[] = saved ? JSON.parse(saved) : MOCK_ORDERS;
  return orders;
}

export async function fetchAllOrdersForAdmin(): Promise<Order[]> {
  try {
    if (db) {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      }
    }
  } catch (err) {
    console.warn("Firestore fetchAllOrdersForAdmin fallback:", err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
  return saved ? JSON.parse(saved) : MOCK_ORDERS;
}

export async function createOrder(order: Order): Promise<void> {
  const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
  const current: Order[] = saved ? JSON.parse(saved) : MOCK_ORDERS;
  current.unshift(order);
  localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(current));

  try {
    if (db) {
      await setDoc(doc(db, 'orders', order.id), order);
    }
  } catch (e) {
    console.warn("Firestore createOrder error:", e);
  }
}

export async function updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<void> {
  const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
  const current: Order[] = saved ? JSON.parse(saved) : MOCK_ORDERS;
  const target = current.find(o => o.id === orderId);
  if (target) {
    target.orderStatus = status;
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(current));
  }

  try {
    if (db) {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: status });
    }
  } catch (e) {
    console.warn("Firestore updateOrderStatus error:", e);
  }
}

// --- HEALTH METRICS FIRESTORE ---
export async function fetchHealthMetrics(userId: string): Promise<HealthMetric[]> {
  const saved = localStorage.getItem(LOCAL_STORAGE_METRICS);
  if (!saved) return MOCK_HEALTH_METRICS;

  const current: HealthMetric[] = JSON.parse(saved);
  const currentUserMetrics = current.filter((metric) => metric.userId === userId);
  if (currentUserMetrics.length >= 31) return current;

  const existingDates = new Set(current.map((metric) => `${metric.userId}:${metric.date}`));
  const backfilled = [
    ...current,
    ...MOCK_HEALTH_METRICS.filter((metric) => !existingDates.has(`${metric.userId}:${metric.date}`))
  ];
  localStorage.setItem(LOCAL_STORAGE_METRICS, JSON.stringify(backfilled));
  return backfilled;
}

export async function saveHealthMetric(metric: HealthMetric): Promise<void> {
  const current = await fetchHealthMetrics(metric.userId);
  current.push(metric);
  localStorage.setItem(LOCAL_STORAGE_METRICS, JSON.stringify(current));
}

// --- REMINDERS ---
export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const saved = localStorage.getItem(LOCAL_STORAGE_REMINDERS);
  return saved ? JSON.parse(saved) : MOCK_REMINDERS;
}

export async function saveReminder(reminder: Reminder): Promise<void> {
  const current = await fetchReminders(reminder.userId);
  const idx = current.findIndex(r => r.id === reminder.id);
  if (idx >= 0) {
    current[idx] = reminder;
  } else {
    current.push(reminder);
  }
  localStorage.setItem(LOCAL_STORAGE_REMINDERS, JSON.stringify(current));
}

export async function deleteReminder(id: string): Promise<void> {
  let current = await fetchReminders('demo');
  current = current.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_STORAGE_REMINDERS, JSON.stringify(current));
}
