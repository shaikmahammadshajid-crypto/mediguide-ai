import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  Droplet, 
  Scale, 
  ArrowUpRight, 
  Sparkles, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PhoneCall, 
  FileText, 
  Pill,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { UserProfile, HealthMetric, Reminder, MedicalRecord, Disease } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface HealthDashboardProps {
  userProfile: UserProfile;
  healthMetrics: HealthMetric[];
  reminders: Reminder[];
  medicalRecords: MedicalRecord[];
  diseases: Disease[];
  onNavigate: (tab: string) => void;
  onOpenDiseaseDetail: (disease: Disease) => void;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({
  userProfile,
  healthMetrics,
  reminders,
  medicalRecords,
  diseases,
  onNavigate,
  onOpenDiseaseDetail
}) => {
  const [waterGlasses, setWaterGlasses] = useState(5);
  const targetGlasses = 8;

  // Calculate BMI
  const heightMeters = userProfile.heightCm / 100;
  const bmi = heightMeters > 0 ? (userProfile.weightKg / (heightMeters * heightMeters)).toFixed(1) : '22.5';
  const bmiNum = parseFloat(bmi);

  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400';
  if (bmiNum < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400';
  } else if (bmiNum >= 30) {
    bmiCategory = 'Obesity Class';
    bmiColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400';
  }

  // Chart Data Preparation
  const dates = healthMetrics.map(m => m.date.slice(5));
  const systolicData = healthMetrics.map(m => m.bloodPressureSystolic);
  const diastolicData = healthMetrics.map(m => m.bloodPressureDiastolic);
  const glucoseData = healthMetrics.map(m => m.bloodGlucoseMgDl);

  const bpChartData = {
    labels: dates.length ? dates : ['Feb 01', 'Feb 05', 'Feb 10', 'Feb 15', 'Feb 20'],
    datasets: [
      {
        label: 'Systolic (mmHg)',
        data: systolicData.length ? systolicData : [128, 124, 122, 120, 118],
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: 'Diastolic (mmHg)',
        data: diastolicData.length ? diastolicData : [82, 80, 78, 78, 76],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: { cornerRadius: 8, padding: 10 }
    },
    scales: {
      y: { min: 60, max: 150, grid: { color: 'rgba(226, 232, 240, 0.5)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Welcome & Emergency Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-100 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Personalized AI Health Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userProfile.fullName}!
            </h1>
            <p className="text-teal-50 text-xs sm:text-sm mt-1 max-w-2xl opacity-90">
              Your overall vitals are looking steady. Blood pressure is within normal control. MediGuide AI has analyzed 3 medical reports in your vault.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Ask MediGuide AI</span>
            </button>
            <a
              href="tel:112"
              className="px-3.5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 border border-rose-400/40"
              title="Emergency Helpline India (112)"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">SOS 112</span>
            </a>
          </div>
        </div>
      </div>

      {/* Vitals & Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* BMI Card */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Body Mass Index</span>
            <Scale className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{bmi}</span>
              <span className="text-xs font-medium text-slate-400">kg/m²</span>
            </div>
            <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${bmiColor}`}>
              {bmiCategory}
            </div>
          </div>
        </div>

        {/* Blood Pressure Card */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Blood Pressure</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">120/78</span>
              <span className="text-xs font-medium text-slate-400">mmHg</span>
            </div>
            <div className="mt-2 inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Optimal BP Range
            </div>
          </div>
        </div>

        {/* Fasting Glucose Card */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Fasting Blood Sugar</span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">95</span>
              <span className="text-xs font-medium text-slate-400">mg/dL</span>
            </div>
            <div className="mt-2 inline-flex items-center text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              Normal Fasting
            </div>
          </div>
        </div>

        {/* Blood Group & Weight Card */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Blood Group & Weight</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{userProfile.bloodGroup}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ {userProfile.weightKg} kg</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Height: {userProfile.heightCm} cm
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts & Reminders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Blood Pressure & Vitals Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                <span>Blood Pressure & Health Trends</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tracking systolic and diastolic readings over time</p>
            </div>
            <button 
              onClick={() => onNavigate('records')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <Line data={bpChartData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Avg Heart Rate</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">70 BPM</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Oxygen Saturation</span>
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400">99% SpO2</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Health Risk Index</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Low Risk</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Reminders & Water Tracker */}
        <div className="space-y-6">
          
          {/* Today's Medicine Reminders */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span>Today's Reminders</span>
              </h3>
              <button 
                onClick={() => onNavigate('reminders')}
                className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.slice(0, 3).map((rem) => (
                <div 
                  key={rem.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                      {rem.type === 'Medicine' ? '💊' : rem.type === 'Water' ? '💧' : '🏃'}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate max-w-[140px]">
                        {rem.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {rem.time} • {rem.dosageDetails || rem.frequency}
                      </span>
                    </div>
                  </div>

                  <button className="text-emerald-600 hover:text-emerald-700 p-1" title="Mark Taken">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Water Intake Widget */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-cyan-100 animate-pulse" />
                <span className="font-bold text-sm">Daily Hydration Goal</span>
              </div>
              <span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                {waterGlasses}/{targetGlasses} Glasses
              </span>
            </div>

            <p className="text-xs text-cyan-50">
              Hydration keeps blood pressure stable and aids kidney clearance.
            </p>

            <div className="w-full bg-cyan-900/40 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-white h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterGlasses / targetGlasses) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button 
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition"
              >
                - 1 Glass
              </button>
              <button 
                onClick={() => setWaterGlasses(waterGlasses + 1)}
                className="px-3 py-1 rounded-lg bg-white text-blue-800 hover:bg-cyan-50 text-xs font-bold transition shadow-2xs"
              >
                + Drink Glass
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Featured Diseases & Recent Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Featured Disease Information */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-500" />
              <span>Evidence-Based Disease Library</span>
            </h3>
            <button 
              onClick={() => onNavigate('diseases')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Explore All ({diseases.length})
            </button>
          </div>

          <div className="space-y-3">
            {diseases.slice(0, 3).map((dis) => (
              <div 
                key={dis.id}
                onClick={() => onOpenDiseaseDetail(dis)}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-800 transition cursor-pointer flex justify-between items-center group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      {dis.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {dis.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md">
                    {dis.overview}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Medical Vault Records */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-500" />
              <span>Recent Medical Records</span>
            </h3>
            <button 
              onClick={() => onNavigate('records')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Vault ({medicalRecords.length})
            </button>
          </div>

          <div className="space-y-3">
            {medicalRecords.slice(0, 3).map((rec) => (
              <div 
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white block truncate max-w-[200px]">
                      {rec.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {rec.type} • {rec.date}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate('records')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
