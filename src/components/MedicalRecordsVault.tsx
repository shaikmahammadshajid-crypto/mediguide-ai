import React, { useState } from 'react';
import QRCode from 'qrcode';
import { 
  FolderHeart, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Stethoscope,
  LockKeyhole,
  QrCode,
  Copy
} from 'lucide-react';
import { MedicalRecord, UserProfile } from '../types';
import { analyzeReportWithAI } from '../services/api';

interface MedicalRecordsVaultProps {
  medicalRecords: MedicalRecord[];
  onAddRecord: (record: MedicalRecord) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
  userProfile: UserProfile;
}

export const MedicalRecordsVault: React.FC<MedicalRecordsVaultProps> = ({
  medicalRecords,
  onAddRecord,
  onDeleteRecord,
  userProfile
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MedicalRecord['type']>('Blood Test');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('Dr. Ananya Sen, MD (AIIMS New Delhi)');
  const [reportText, setReportText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<{ recordTitle: string; summary: string; findings: string[]; questions: string[] } | null>(null);
  const [encryptedShareUrl, setEncryptedShareUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [shareError, setShareError] = useState('');

  const toBase64Url = (bytes: Uint8Array) => {
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const handleGenerateEncryptedQr = async () => {
    setIsGeneratingShare(true);
    setShareError('');
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
      const rawKey = new Uint8Array(await crypto.subtle.exportKey('raw', key));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const sharePayload = {
        patientId: userProfile.uid,
        patientName: userProfile.fullName,
        generatedAt: new Date().toISOString(),
        expiresInDays: 30,
        records: medicalRecords
          .filter((record) => record.userId === userProfile.uid)
          .map((record) => ({
            i: record.id,
            t: record.title,
            y: record.type,
            d: record.date,
            doctor: record.doctorName,
            file: record.fileName,
            url: record.fileUrl,
            summary: record.aiSummary?.slice(0, 180)
          }))
      };
      const encrypted = new Uint8Array(await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(JSON.stringify(sharePayload))
      ));
      const origin = window.location.origin || 'https://mediguide.ai';
      const pathname = window.location.pathname || '/';
      const url = `${origin}${pathname}?patientShare=${toBase64Url(encrypted)}&iv=${toBase64Url(iv)}#key=${toBase64Url(rawKey)}`;
      const qr = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 220,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setEncryptedShareUrl(url);
      setQrDataUrl(qr);
    } catch (err) {
      console.error('Encrypted QR generation error:', err);
      setShareError('Could not generate the encrypted QR. Please try again.');
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MedicalRecord = {
      id: 'rec_' + Date.now(),
      userId: userProfile.uid,
      title: title || 'Medical Test Report',
      type,
      category: 'Diagnostic Vault',
      date,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: `${title.replace(/\s+/g, '_')}_${date}.pdf`,
      fileSize: '1.4 MB',
      aiSummary: reportText ? `User notes: ${reportText.slice(0, 100)}...` : 'Pending Gemini AI breakdown.',
      tags: [type, 'Vault Document'],
      doctorName
    };

    await onAddRecord(newRecord);
    setIsAddModalOpen(false);
    setTitle('');
    setReportText('');
  };

  const handleRunAiAnalysis = async (rec: MedicalRecord) => {
    setIsAnalyzing(rec.id);
    try {
      const res = await analyzeReportWithAI(rec.title, rec.type, rec.aiSummary || rec.title);
      setSelectedAnalysis({
        recordTitle: rec.title,
        summary: res.summary,
        findings: res.keyFindings,
        questions: res.questionsForDoctor
      });
    } catch (err) {
      console.error("AI report analysis error:", err);
    } finally {
      setIsAnalyzing(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderHeart className="w-4 h-4" />
            <span>Secure Medical Records Vault</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Health Documents & Lab Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload MRI, CT Scans, Blood Reports & Prescriptions for instant Gemini AI plain-language summaries.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Medical Report</span>
        </button>
      </div>

      {/* Encrypted Patient QR Share */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xs grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-4 items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <LockKeyhole className="w-4 h-4" />
            <span>AES-256 Encrypted Patient Report Share</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Share {userProfile.fullName}'s reports by QR code</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Generates a person-specific encrypted payload for {medicalRecords.filter((record) => record.userId === userProfile.uid).length} reports. The decrypt key is kept in the URL fragment for controlled sharing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleGenerateEncryptedQr}
              disabled={isGeneratingShare}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>{isGeneratingShare ? 'Encrypting...' : 'Generate Patient QR'}</span>
            </button>
            {encryptedShareUrl && (
              <button
                onClick={() => navigator.clipboard?.writeText(encryptedShareUrl)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 border border-white/15"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Secure Link</span>
              </button>
            )}
          </div>
          {encryptedShareUrl && (
            <p className="text-[10px] text-slate-400 break-all">
              {encryptedShareUrl}
            </p>
          )}
          {shareError && (
            <p className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {shareError}
            </p>
          )}
        </div>

        <div className="w-full min-h-40 rounded-xl bg-white p-3 flex items-center justify-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`Encrypted QR share for ${userProfile.fullName}`}
              className="w-36 h-36 sm:w-40 sm:h-40"
            />
          ) : (
            <QrCode className="w-16 h-16 text-slate-300" />
          )}
        </div>
      </div>

      {/* Records Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicalRecords.map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-400 transition"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {rec.type}
                </span>
                <button
                  onClick={() => onDeleteRecord(rec.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                {rec.title}
              </h3>

              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div>Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.date}</span></div>
                <div>Doctor: <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.doctorName || 'N/A'}</span></div>
              </div>

              {/* AI Summary preview box */}
              {rec.aiSummary && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-[10px] text-teal-600 dark:text-teal-400 block uppercase mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-500" /> AI Explainer:
                  </span>
                  <p className="line-clamp-3 text-[11px]">{rec.aiSummary}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleRunAiAnalysis(rec)}
                disabled={isAnalyzing === rec.id}
                className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[11px] hover:bg-teal-100 dark:hover:bg-teal-900 transition flex items-center gap-1 border border-teal-200 dark:border-teal-800"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span>{isAnalyzing === rec.id ? 'Analyzing...' : 'AI Breakdown'}</span>
              </button>

              <a
                href={rec.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-500" /> Upload Medical Record
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fasting Lipid Profile & HbA1c"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category / Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                  >
                    {['Blood Test', 'MRI', 'CT Scan', 'X-Ray', 'Prescription', 'Health Certificate', 'Lab Report', 'Other'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Report Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ordering Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Report Key Text / Values (Optional for AI)</label>
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste lab values e.g. Glucose 110 mg/dL, WBC 11.2, Cholesterol 190..."
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Detailed Analysis Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Gemini AI Medical Report Breakdown
                </h3>
              </div>
              <button onClick={() => setSelectedAnalysis(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedAnalysis.recordTitle}</h4>

              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                <span className="font-bold text-teal-900 dark:text-teal-200 block mb-1">Plain Language Summary:</span>
                <p className="leading-relaxed">{selectedAnalysis.summary}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Key Clinical Findings:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {selectedAnalysis.findings.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Suggested Questions for Your Doctor:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {selectedAnalysis.questions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
