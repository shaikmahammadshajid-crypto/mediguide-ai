import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Info, 
  X,
  Check,
  Building,
  FileCheck
} from 'lucide-react';
import { Medicine } from '../types';

interface MedicineStoreProps {
  medicines: Medicine[];
  onAddToCart: (med: Medicine, quantity: number) => void;
  onBuyNow: (med: Medicine) => void;
  selectedDiseaseFilter?: string | null;
  clearDiseaseFilter?: () => void;
}

export const MedicineStore: React.FC<MedicineStoreProps> = ({
  medicines,
  onAddToCart,
  onBuyNow,
  selectedDiseaseFilter,
  clearDiseaseFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMedModal, setSelectedMedModal] = useState<Medicine | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const categories = [
    'All',
    ...Array.from(
      new Set(medicines.map((med) => med.category.split('/')[0].trim()))
    ).sort()
  ];

  const filteredMeds = medicines.filter(m => {
    const matchesSearch = m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesDisease = !selectedDiseaseFilter || m.diseaseIds.includes(selectedDiseaseFilter);
    return matchesSearch && matchesCat && matchesDisease;
  });

  const handleAdd = (med: Medicine, qty: number = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onAddToCart(med, qty);
    setAddedSuccessId(med.id);
    setTimeout(() => setAddedSuccessId(null), 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Top Banner & Search */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Pill className="w-4 h-4" />
              <span>Licensed Pharmacy Workflow & Medicine Catalog</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Order Prescription & OTC Medicines
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real product references, prescription upload for Rx items, doorstep tracking, and digital invoice generation.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand name or generic compound..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Selected Disease Banner Filter if active */}
        {selectedDiseaseFilter && (
          <div className="bg-teal-50 dark:bg-teal-950 p-3 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Showing medicines specifically formulated for selected disease protocol.</span>
            </div>
            {clearDiseaseFilter && (
              <button onClick={clearDiseaseFilter} className="font-bold underline text-teal-700 hover:text-teal-900">
                Show All Medicines
              </button>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMeds.map((med) => {
          return (
            <div
              key={med.id}
              onClick={() => {
                setSelectedMedModal(med);
                setModalQuantity(1);
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Image Header */}
              <div className="relative h-44 bg-white dark:bg-slate-900 overflow-hidden">
                <img
                  src={med.image}
                  alt={med.brandName}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {med.prescriptionRequired && (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs flex items-center gap-1">
                      <FileCheck className="w-2.5 h-2.5" /> Rx Required
                    </span>
                  )}
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                    {med.dosageForm}
                  </span>
                  {med.regulatorySchedule && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs">
                      {med.regulatorySchedule}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 text-slate-800 dark:text-slate-200">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{med.rating} ({med.reviewsCount})</span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 block truncate">
                    {med.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition truncate">
                    {med.brandName}
                  </h3>
                  <p className="text-[11px] text-slate-400 italic truncate">
                    {med.genericName} • {med.strength}
                  </p>
                  {med.packSize && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                      {med.packSize}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      ₹{med.estimatedPrice.toFixed(2)}
                    </span>
                    {med.originalPrice > med.estimatedPrice && (
                      <span className="text-[11px] text-slate-400 line-through ml-1.5">
                        ₹{med.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    med.availability === 'In Stock' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {med.availability}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={(e) => handleAdd(med, 1, e)}
                    className="w-full py-2 rounded-xl border border-teal-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    {addedSuccessId === med.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow(med);
                    }}
                    className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMeds.length === 0 && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
          <Pill className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No medicines found matching criteria</h3>
          <p className="text-xs text-slate-500">Try searching for a different compound or clearing filters.</p>
        </div>
      )}

      {/* Medicine Detail Modal */}
      {selectedMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden my-auto">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-sm">Pharmaceutical Drug Specification</span>
              </div>
              <button onClick={() => setSelectedMedModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={selectedMedModal.image}
                  alt={selectedMedModal.brandName}
                  className="w-full sm:w-40 h-40 object-contain bg-white rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 p-2"
                />
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                    {selectedMedModal.category}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedMedModal.brandName}
                  </h2>
                  <p className="text-slate-500 font-medium italic">
                    Generic: {selectedMedModal.genericName} ({selectedMedModal.strength})
                  </p>
                  <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Manufacturer: {selectedMedModal.manufacturer}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedMedModal.regulatorySchedule && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {selectedMedModal.regulatorySchedule}
                      </span>
                    )}
                    {selectedMedModal.packSize && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {selectedMedModal.packSize}
                      </span>
                    )}
                    {selectedMedModal.sourceUrl && (
                      <a
                        href={selectedMedModal.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
                      >
                        Product reference
                      </a>
                    )}
                  </div>

                  <div className="pt-2 flex items-center space-x-3">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ₹{selectedMedModal.estimatedPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      {selectedMedModal.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Usage & Administration Instructions:</h4>
                <p className="text-slate-600 dark:text-slate-300">{selectedMedModal.usageInstructions}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">Common Side Effects:</h4>
                  <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                    {selectedMedModal.commonSideEffects.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1 text-rose-950 dark:text-rose-200">
                  <h4 className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Warnings & Precautions:
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedMedModal.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>

              {/* Quantity Picker & Add Cart */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-bold">{modalQuantity}</span>
                    <button 
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleAdd(selectedMedModal, modalQuantity);
                      setSelectedMedModal(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                  >
                    Add {modalQuantity} to Cart (₹{(selectedMedModal.estimatedPrice * modalQuantity).toFixed(2)})
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
