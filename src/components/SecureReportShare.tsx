import React, { useEffect, useState } from 'react';
import { FileText, LockKeyhole, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchSecureShare } from '../services/api';

interface SharedRecord {
  i: string;
  t: string;
  y: string;
  d: string;
  doctor?: string;
  file?: string;
  url?: string;
  summary?: string;
}

interface SharePayload {
  patientId: string;
  patientName: string;
  generatedAt: string;
  expiresInDays: number;
  records: SharedRecord[];
}

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const SecureReportShare: React.FC = () => {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function decryptShare() {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('shareToken');
        let encrypted = params.get('patientShare');
        let iv = params.get('iv');
        const keyParam = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('key');

        if (token) {
          const share = await fetchSecureShare(token);
          encrypted = share.encrypted;
          iv = share.iv;
        }

        if (!encrypted || !iv || !keyParam) {
          setError('This secure report link is missing encrypted share data.');
          return;
        }

        const key = await crypto.subtle.importKey(
          'raw',
          fromBase64Url(keyParam),
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: fromBase64Url(iv) },
          key,
          fromBase64Url(encrypted)
        );
        setPayload(JSON.parse(new TextDecoder().decode(decrypted)));
      } catch (err) {
        console.error('Secure report decrypt error:', err);
        setError('Unable to decrypt this report share. The QR link may be incomplete or expired.');
      }
    }

    decryptShare();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <LockKeyhole className="w-4 h-4" />
            <span>Encrypted MediGuide Report Share</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-2">
            {payload ? `${payload.patientName}'s Medical Reports` : 'Secure Medical Reports'}
          </h1>
          {payload && (
            <p className="text-xs text-slate-300 mt-1">
              Generated {new Date(payload.generatedAt).toLocaleString()} • Access window {payload.expiresInDays} days
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm font-semibold flex gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {payload && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payload.records.map((record) => (
              <div key={record.i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">{record.t}</h2>
                    <p className="text-[11px] text-slate-500">{record.y} • {record.d}</p>
                    <p className="text-[11px] text-slate-500">{record.doctor || 'Doctor not listed'}</p>
                  </div>
                </div>

                {record.summary && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                    {record.summary}
                  </p>
                )}

                {record.url && (
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:underline"
                  >
                    View shared document <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
