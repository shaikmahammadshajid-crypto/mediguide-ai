import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Mic, 
  ChevronRight, 
  AlertTriangle, 
  Stethoscope, 
  Pill, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  FileText, 
  X,
  ExternalLink,
  Info,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import { Disease, Medicine } from '../types';

interface DiseaseLibraryProps {
  diseases: Disease[];
  medicines: Medicine[];
  onSelectDiseaseMeds: (diseaseId: string) => void;
  selectedDiseaseForModal?: Disease | null;
  onCloseModal?: () => void;
}

export const DiseaseLibrary: React.FC<DiseaseLibraryProps> = ({
  diseases,
  medicines,
  onSelectDiseaseMeds,
  selectedDiseaseForModal,
  onCloseModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalDisease, setActiveModalDisease] = useState<Disease | null>(selectedDiseaseForModal || null);
  const [modalTab, setModalTab] = useState<'overview' | 'diagnosis' | 'meds' | 'lifestyle' | 'emergency'>('overview');
  const [isListening, setIsListening] = useState(false);

  const categories = ['All', 'Cardiology', 'Endocrinology', 'Neurology', 'Respiratory', 'Gastrointestinal', 'Dermatology', 'Infectious'];

  const filteredDiseases = diseases.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Voice Search is supported in standard Chrome/Edge browsers.");
    }
  };

  const openDetail = (d: Disease) => {
    setActiveModalDisease(d);
    setModalTab('overview');
  };

  const closeDetail = () => {
    setActiveModalDisease(null);
    if (onCloseModal) onCloseModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Evidence-Based Medical Repository</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Disease & Health Conditions Database
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore causes, clinical features, evidence-based medication protocols, and emergency red flags.
            </p>
          </div>

          {/* Voice & Smart Search Inputs */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by disease name, symptom, or organ..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleVoiceSearch}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                isListening 
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => {
          return (
            <div
              key={disease.id}
              onClick={() => openDetail(disease)}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {disease.category}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                  {disease.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {disease.overview}
                </p>
              </div>

              {/* Key Symptoms preview tags */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Key Symptoms:</span>
                <div className="flex flex-wrap gap-1">
                  {disease.symptoms.slice(0, 3).map((sym, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 group-hover:underline">
                  <span>View Clinical Details</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDiseaseMeds(disease.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[10px] hover:bg-teal-100 dark:hover:bg-teal-900 flex items-center gap-1 border border-teal-200 dark:border-teal-800"
                >
                  <Pill className="w-3 h-3 text-teal-500" />
                  <span>Related Meds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDiseases.length === 0 && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No matching health conditions found</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or selecting "All" categories.</p>
        </div>
      )}

      {/* Comprehensive Disease Detail Modal */}
      {activeModalDisease && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800">
                  {activeModalDisease.category}
                </span>
                <h2 className="text-xl font-extrabold mt-1">{activeModalDisease.name}</h2>
              </div>
              <button onClick={closeDetail} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 overflow-x-auto">
              <button
                onClick={() => setModalTab('overview')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  modalTab === 'overview' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500'
                }`}
              >
                Overview & Causes
              </button>
              <button
                onClick={() => setModalTab('diagnosis')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  modalTab === 'diagnosis' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500'
                }`}
              >
                Diagnosis & Treatments
              </button>
              <button
                onClick={() => setModalTab('meds')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  modalTab === 'meds' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500'
                }`}
              >
                Medications & Precautions
              </button>
              <button
                onClick={() => setModalTab('lifestyle')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  modalTab === 'lifestyle' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500'
                }`}
              >
                Diet & Lifestyle
              </button>
              <button
                onClick={() => setModalTab('emergency')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  modalTab === 'emergency' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-slate-500'
                }`}
              >
                ⚠️ Emergency Signs
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
              
              {modalTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Clinical Overview</h4>
                    <p className="leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {activeModalDisease.overview}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-teal-500" /> Primary Causes
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {activeModalDisease.causes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-teal-500" /> Clinical Symptoms
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {activeModalDisease.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'diagnosis' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase">Diagnostic Testing Methods</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {activeModalDisease.diagnosisMethods.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase">General Treatment Protocols</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {activeModalDisease.generalTreatments.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {modalTab === 'meds' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
                    <h4 className="font-bold text-teal-900 dark:text-teal-200 text-xs uppercase flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-teal-600" /> Evidence-Based Medications
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-teal-900 dark:text-teal-200">
                      {activeModalDisease.evidenceBasedMeds.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          closeDetail();
                          onSelectDiseaseMeds(activeModalDisease.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition"
                      >
                        Order Related Medicines from Pharmacy
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                      <h5 className="font-bold text-slate-900 dark:text-white">Common Side Effects</h5>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                        {activeModalDisease.sideEffects.map((se, i) => <li key={i}>{se}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                      <h5 className="font-bold text-slate-900 dark:text-white">Safety Precautions</h5>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                        {activeModalDisease.safetyPrecautions.map((sp, i) => <li key={i}>{sp}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'lifestyle' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h5 className="font-bold text-slate-900 dark:text-white">🥗 Diet Recommendations</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {activeModalDisease.dietRecommendations.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h5 className="font-bold text-slate-900 dark:text-white">🏃 Exercise & Activity</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {activeModalDisease.exerciseRecommendations.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'emergency' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 space-y-2">
                    <h4 className="font-extrabold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600" /> Emergency Warning Signs
                    </h4>
                    <p className="font-medium">If you experience any of the following critical symptoms, call emergency services immediately:</p>
                    <ul className="list-disc list-inside space-y-1 font-semibold">
                      {activeModalDisease.emergencyWarningSigns.map((ew, i) => (
                        <li key={i}>{ew}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                    <h5 className="font-bold">When to Visit a Doctor</h5>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {activeModalDisease.whenToSeeDoctor.map((ws, i) => (
                        <li key={i}>{ws}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-500">
              <span>Academic References: {activeModalDisease.references.join(', ')}</span>
              <button onClick={closeDetail} className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
