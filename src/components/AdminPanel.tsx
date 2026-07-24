import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Pill, 
  PackageCheck, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { Disease, Medicine, Order, UserProfile } from '../types';

interface AdminPanelProps {
  diseases: Disease[];
  medicines: Medicine[];
  orders: Order[];
  onSaveDisease: (dis: Disease) => Promise<void>;
  onDeleteDisease: (id: string) => Promise<void>;
  onSaveMedicine: (med: Medicine) => Promise<void>;
  onDeleteMedicine: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  diseases,
  medicines,
  orders,
  onSaveDisease,
  onDeleteDisease,
  onSaveMedicine,
  onDeleteMedicine,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'diseases' | 'medicines' | 'orders'>('analytics');

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  // New Disease Modal State
  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);
  const [dName, setDName] = useState('');
  const [dCategory, setDCategory] = useState<Disease['category']>('Cardiology');
  const [dOverview, setDOverview] = useState('');

  // New Medicine Modal State
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [mBrand, setMBrand] = useState('');
  const [mGeneric, setMGeneric] = useState('');
  const [mCategory, setMCategory] = useState('Antidiabetic');
  const [mPrice, setMPrice] = useState('45.00');

  const handleDiseaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newD: Disease = {
      id: 'd_' + Date.now(),
      name: dName,
      category: dCategory,
      overview: dOverview,
      causes: ['Genetics', 'Environmental Factors'],
      symptoms: ['Persistent discomfort', 'Fatigue'],
      riskFactors: ['Family history'],
      complications: ['Severe chronic progression'],
      diagnosisMethods: ['Clinical evaluation', 'Blood biomarkers'],
      generalTreatments: ['First-line pharmacological intervention'],
      evidenceBasedMeds: ['Targeted therapeutic agents'],
      sideEffects: ['Mild gastrointestinal intolerance'],
      drugInteractions: ['Consult doctor before taking concurrent therapies'],
      safetyPrecautions: ['Adhere strictly to prescribed dosing schedule'],
      dietRecommendations: ['Nutrient-dense balanced meals'],
      exerciseRecommendations: ['30 minutes moderate daily exercise'],
      lifestyleChanges: ['Adequate sleep and stress management'],
      recoveryTips: ['Routine follow-up consultations'],
      preventionMethods: ['Annual preventive health screenings'],
      whenToSeeDoctor: ['Symptoms exceeding 48 hours'],
      emergencyWarningSigns: ['Severe acute distress'],
      references: ['MediGuide Clinical Guidelines 2026']
    };

    await onSaveDisease(newD);
    setIsDiseaseModalOpen(false);
    setDName('');
    setDOverview('');
  };

  const handleMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newM: Medicine = {
      id: 'm_' + Date.now(),
      brandName: mBrand,
      genericName: mGeneric,
      category: mCategory,
      diseaseIds: [],
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
      dosageForm: 'Tablet',
      strength: '500 mg',
      usageInstructions: 'Take 1 tablet daily with glass of water after meals.',
      commonSideEffects: ['Mild stomach upset'],
      warnings: ['Keep out of reach of children'],
      availability: 'In Stock',
      estimatedPrice: parseFloat(mPrice) || 15.00,
      originalPrice: (parseFloat(mPrice) || 15.00) + 4.00,
      manufacturer: 'Global Pharma Inc.',
      rating: 4.8,
      reviewsCount: 12,
      prescriptionRequired: true
    };

    await onSaveMedicine(newM);
    setIsMedModalOpen(false);
    setMBrand('');
    setMGeneric('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-xl">MediGuide Control Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage clinical disease databases, pharmaceutical inventory, and fulfillment orders.
            </p>
          </div>
        </div>

        <div className="flex space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('diseases')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'diseases' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Diseases ({diseases.length})
          </button>
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'medicines' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Medicines ({medicines.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
              <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1 block">
                ₹{totalRevenue.toFixed(2)}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold block">Pending Orders</span>
              <span className="text-2xl font-extrabold text-amber-500 mt-1 block">
                {pendingOrders}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold block">Diseases Indexed</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {diseases.length}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold block">Medicines Catalog</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {medicines.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Diseases Management */}
      {activeTab === 'diseases' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Disease Repository Management</h3>
            <button
              onClick={() => setIsDiseaseModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Disease Entry
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {diseases.map((d) => (
              <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{d.name}</span>
                  <span className="text-[10px] text-slate-400">{d.category} • {d.symptoms.length} symptoms registered</span>
                </div>

                <button onClick={() => onDeleteDisease(d.id)} className="text-rose-500 hover:text-rose-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medicines Management */}
      {activeTab === 'medicines' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Medicine Catalog Management</h3>
            <button
              onClick={() => setIsMedModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {medicines.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={m.image} alt={m.brandName} className="w-10 h-10 object-cover rounded-lg border" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{m.brandName} (₹{m.estimatedPrice.toFixed(2)})</span>
                    <span className="text-[10px] text-slate-400">{m.genericName} • {m.dosageForm}</span>
                  </div>
                </div>

                <button onClick={() => onDeleteMedicine(m.id)} className="text-rose-500 hover:text-rose-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Pharmacy Order Status Controls</h3>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {orders.map((o) => (
              <div key={o.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white block">{o.id} • {o.userName}</span>
                  <span className="text-[10px] text-slate-400">Total: ₹{o.totalAmount.toFixed(2)} • Payment: {o.paymentStatus}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-slate-500">Status:</span>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                    className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-teal-600"
                  >
                    {['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disease Modal */}
      {isDiseaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Disease to Database</h3>
            <form onSubmit={handleDiseaseSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={dName}
                onChange={(e) => setDName(e.target.value)}
                placeholder="Disease Name"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
              <select
                value={dCategory}
                onChange={(e) => setDCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              >
                {['Cardiology', 'Endocrinology', 'Neurology', 'Respiratory', 'Dermatology', 'Gastrointestinal', 'Infectious'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea
                rows={3}
                required
                value={dOverview}
                onChange={(e) => setDOverview(e.target.value)}
                placeholder="Overview description..."
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsDiseaseModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicine Modal */}
      {isMedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Medicine Item</h3>
            <form onSubmit={handleMedicineSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={mBrand}
                onChange={(e) => setMBrand(e.target.value)}
                placeholder="Brand Name (e.g. Lipitor)"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                required
                value={mGeneric}
                onChange={(e) => setMGeneric(e.target.value)}
                placeholder="Generic Compound"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
              <input
                type="number"
                step="0.01"
                required
                value={mPrice}
                onChange={(e) => setMPrice(e.target.value)}
                placeholder="Price (₹ INR)"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsMedModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
