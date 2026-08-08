import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Sparkles, 
  Key, 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { loginWithEmail, signUpWithEmail, loginWithGoogle, resetPassword } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  canClose?: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, canClose = true, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'phone' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      if (mode === 'login') {
        const profile = await loginWithEmail(email, password);
        onAuthSuccess(profile);
        onClose();
      } else if (mode === 'signup') {
        const profile = await signUpWithEmail(email, password, fullName || 'New Patient');
        onAuthSuccess(profile);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMsg('Password reset link sent to your email inbox.');
      } else if (mode === 'phone') {
        if (!otpSent) {
          setOtpSent(true);
          setMsg('SMS OTP Code sent to ' + phone + '. Enter 123456 to verify.');
        } else {
          if (otp !== '123456') {
            setMsg('Invalid OTP. Use 123456 for this demo verification.');
            return;
          }
          setMode('signup');
          setEmail('');
          setPassword('');
          setFullName('');
          setMsg('Phone verified. Complete registration with your name, email, and password.');
        }
      }
    } catch (err: any) {
      setMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const profile = await loginWithGoogle();
      onAuthSuccess(profile);
      onClose();
    } catch (err: any) {
      setMsg(err.message || 'Google Auth Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl relative">
        
        {canClose && (
          <button onClick={onClose} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' && 'MediGuide Patient Portal'}
            {mode === 'signup' && 'Create Health Account'}
            {mode === 'phone' && 'Phone OTP Authentication'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400">
            Sign in before accessing personal medical records, orders, and reports
          </p>
        </div>

        {msg && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-semibold border border-teal-200 dark:border-teal-800">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          {mode === 'signup' && (
            <div>
              <label className="font-bold block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label className="font-bold block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.sharma@mediguide.in"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <label className="font-bold block mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {mode === 'phone' && (
            <>
              <div>
                <label className="font-bold block mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="font-bold block mb-1">Enter 6-Digit Verification OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl font-mono text-center text-sm font-bold tracking-widest"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition"
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In to Portal' :
              mode === 'signup' ? 'Create Patient Account' :
              mode === 'phone' ? (otpSent ? 'Verify OTP & Enter' : 'Send SMS Verification') :
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Google Auth Button */}
        {mode !== 'forgot' && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200"
            >
              <span>Continue with Google Login</span>
            </button>

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              {mode === 'login' ? (
                <>
                  <button onClick={() => setMode('signup')} className="hover:underline font-bold text-teal-600">Create Account</button>
                  <button onClick={() => setMode('phone')} className="hover:underline">Phone OTP</button>
                  <button onClick={() => setMode('forgot')} className="hover:underline">Forgot Pass?</button>
                </>
              ) : (
                <button onClick={() => setMode('login')} className="hover:underline font-bold text-teal-600">Back to Sign In</button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
