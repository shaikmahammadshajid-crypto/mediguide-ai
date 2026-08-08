import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HealthDashboard } from './components/HealthDashboard';
import { AiAssistant } from './components/AiAssistant';
import { DiseaseLibrary } from './components/DiseaseLibrary';
import { MedicineStore } from './components/MedicineStore';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { PatientProfileView } from './components/PatientProfileView';
import { MedicalRecordsVault } from './components/MedicalRecordsVault';
import { RemindersManager } from './components/RemindersManager';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { SecureReportShare } from './components/SecureReportShare';

import { 
  UserProfile, 
  Disease, 
  Medicine, 
  CartItem, 
  Order, 
  MedicalRecord, 
  HealthMetric, 
  Reminder, 
  Appointment 
} from './types';

import { 
  getUserProfile, 
  saveUserProfile, 
  switchDemoRole, 
  fetchDiseases, 
  saveDisease, 
  deleteDisease, 
  fetchMedicines, 
  saveMedicine, 
  deleteMedicine, 
  fetchMedicalRecords, 
  addMedicalRecord, 
  deleteMedicalRecord, 
  fetchOrders, 
  fetchAllOrdersForAdmin, 
  createOrder, 
  updateOrderStatus, 
  fetchHealthMetrics, 
  fetchReminders, 
  saveReminder, 
  deleteReminder 
} from './lib/firebase';

import { INITIAL_PATIENT_PROFILE, MOCK_APPOINTMENTS } from './data/mockData';

export default function App() {
  const isSecureReportShare = typeof window !== 'undefined'
    && (new URLSearchParams(window.location.search).has('patientShare') || new URLSearchParams(window.location.search).has('shareToken'));

  if (isSecureReportShare) {
    return <SecureReportShare />;
  }

  return <MediGuideApp />;
}

function MediGuideApp() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PATIENT_PROFILE);
  
  // Data State
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // Cart & UI State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedDiseaseForModal, setSelectedDiseaseForModal] = useState<Disease | null>(null);
  const [selectedDiseaseFilterForPharmacy, setSelectedDiseaseFilterForPharmacy] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Dark Mode Class Management
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Data on Mount
  useEffect(() => {
    async function loadAllData() {
      try {
        const profile = await getUserProfile(userProfile.uid);
        if (profile) setUserProfile(profile);

        const dis = await fetchDiseases();
        setDiseases(dis);

        const meds = await fetchMedicines();
        setMedicines(meds);

        const recs = await fetchMedicalRecords(userProfile.uid);
        setMedicalRecords(recs);

        const ords = await fetchOrders(userProfile.uid);
        setOrders(ords);

        const metrics = await fetchHealthMetrics(userProfile.uid);
        setHealthMetrics(metrics);

        const rems = await fetchReminders(userProfile.uid);
        setReminders(rems);
      } catch (err) {
        console.warn("Initial data load error:", err);
      }
    }
    loadAllData();
  }, [userProfile.uid]);

  // Role Switcher Handler
  const handleSelectRole = async (role: 'patient' | 'doctor' | 'admin') => {
    const updated = await switchDemoRole(role);
    setUserProfile(updated);
    if (role === 'admin') {
      const allOrds = await fetchAllOrdersForAdmin();
      setOrders(allOrds);
      setCurrentTab('admin');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Cart Actions
  const handleAddToCart = (medicine: Medicine, quantity: number) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.medicine.id === medicine.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { medicine, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (medId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.medicine.id === medId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (medId: string) => {
    setCartItems(prev => prev.filter(i => i.medicine.id !== medId));
  };

  const handleBuyNow = (medicine: Medicine) => {
    handleAddToCart(medicine, 1);
    setIsCartOpen(true);
  };

  const handleOrderPlaced = async (newOrder: Order) => {
    await createOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
  };

  // Disease -> Pharmacy Filter Redirect
  const handleSelectDiseaseMeds = (diseaseId: string) => {
    setSelectedDiseaseFilterForPharmacy(diseaseId);
    setCurrentTab('pharmacy');
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedDiseaseForModal(null);
          setCurrentTab(tab);
        }}
        userProfile={userProfile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={cartTotalCount}
        openCart={() => setIsCartOpen(true)}
        onSelectRole={handleSelectRole}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'dashboard' && (
          <HealthDashboard
            userProfile={userProfile}
            healthMetrics={healthMetrics}
            reminders={reminders}
            medicalRecords={medicalRecords}
            diseases={diseases}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDiseaseDetail={(dis) => {
              setSelectedDiseaseForModal(dis);
              setCurrentTab('diseases');
            }}
          />
        )}

        {currentTab === 'ai-assistant' && (
          <AiAssistant userProfile={userProfile} />
        )}

        {currentTab === 'diseases' && (
          <DiseaseLibrary
            diseases={diseases}
            medicines={medicines}
            onSelectDiseaseMeds={handleSelectDiseaseMeds}
            selectedDiseaseForModal={selectedDiseaseForModal}
            onCloseModal={() => setSelectedDiseaseForModal(null)}
          />
        )}

        {currentTab === 'pharmacy' && (
          <MedicineStore
            medicines={medicines}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            selectedDiseaseFilter={selectedDiseaseFilterForPharmacy}
            clearDiseaseFilter={() => setSelectedDiseaseFilterForPharmacy(null)}
          />
        )}

        {currentTab === 'orders' && (
          <OrderTracker orders={orders} />
        )}

        {currentTab === 'records' && (
          <MedicalRecordsVault
            medicalRecords={medicalRecords}
            onAddRecord={async (rec) => {
              await addMedicalRecord(rec);
              setMedicalRecords(prev => [rec, ...prev]);
            }}
            onDeleteRecord={async (id) => {
              await deleteMedicalRecord(id);
              setMedicalRecords(prev => prev.filter(r => r.id !== id));
            }}
            userProfile={userProfile}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersManager
            reminders={reminders}
            appointments={appointments}
            onSaveReminder={async (rem) => {
              await saveReminder(rem);
              setReminders(await fetchReminders(userProfile.uid));
            }}
            onDeleteReminder={async (id) => {
              await deleteReminder(id);
              setReminders(await fetchReminders(userProfile.uid));
            }}
            userProfile={userProfile}
          />
        )}

        {currentTab === 'profile' && (
          <PatientProfileView
            userProfile={userProfile}
            onSaveProfile={async (updated) => {
              await saveUserProfile(updated);
              setUserProfile(updated);
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            diseases={diseases}
            medicines={medicines}
            orders={orders}
            onSaveDisease={async (dis) => {
              await saveDisease(dis);
              setDiseases(await fetchDiseases());
            }}
            onDeleteDisease={async (id) => {
              await deleteDisease(id);
              setDiseases(await fetchDiseases());
            }}
            onSaveMedicine={async (med) => {
              await saveMedicine(med);
              setMedicines(await fetchMedicines());
            }}
            onDeleteMedicine={async (id) => {
              await deleteMedicine(id);
              setMedicines(await fetchMedicines());
            }}
            onUpdateOrderStatus={async (orderId, status) => {
              await updateOrderStatus(orderId, status);
              setOrders(await fetchAllOrdersForAdmin());
            }}
          />
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        userProfile={userProfile}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
        }}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 MediGuide AI (India). All Rights Reserved. Enterprise Medical System.</p>
          <p className="italic text-[11px]">
            Educational Healthcare Assistant • Powered by Google Gemini AI & Firebase
          </p>
        </div>
      </footer>

    </div>
  );
}
