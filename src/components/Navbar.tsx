import React, { useState } from 'react';
import { 
  HeartPulse, 
  Bot, 
  BookOpen, 
  Pill, 
  ShoppingCart, 
  FolderHeart, 
  User, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Search,
  PackageCheck,
  CalendarCheck,
  Sparkles,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userProfile: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cartCount: number;
  openCart: () => void;
  onSelectRole: (role: 'patient' | 'doctor' | 'admin') => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  darkMode,
  setDarkMode,
  cartCount,
  openCart,
  onSelectRole,
  openAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HeartPulse },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Gemini AI' },
    { id: 'diseases', label: 'Diseases DB', icon: BookOpen },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'orders', label: 'My Orders', icon: PackageCheck },
    { id: 'records', label: 'Medical Vault', icon: FolderHeart },
    { id: 'reminders', label: 'Reminders', icon: CalendarCheck },
  ];

  if (userProfile.role === 'admin' || userProfile.role === 'doctor') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Medi<span className="text-teal-600 dark:text-teal-400">Guide</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                Intelligent Healthcare Assistant
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5">
            
            {/* Quick Role Switcher for Demo / Testing */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] font-medium text-slate-400 px-1.5 flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-teal-500" /> Role:
              </span>
              <button
                onClick={() => onSelectRole('patient')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  userProfile.role === 'patient' 
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-2xs font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => onSelectRole('doctor')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  userProfile.role === 'doctor' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => onSelectRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  userProfile.role === 'admin' 
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">Health Alerts & Reminders</span>
                    <span className="text-[10px] bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full font-medium">
                      2 New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">💊 Time for Amlodipine 5mg</div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Take 1 tablet with morning water.</p>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 block">8:00 AM Today</span>
                    </div>
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">📦 Order Status Updated</div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Order #ORD-98421 is Out for Delivery!</p>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 block">10 minutes ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
              title="View Pharmacy Cart"
            >
              <ShoppingCart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Patient Profile Menu */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center space-x-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="View Patient Profile"
            >
              <img
                src={userProfile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                {userProfile.fullName.split(' ')[0]}
              </span>
            </button>

            {/* Login / Auth Button */}
            <button
              onClick={openAuthModal}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 transition shadow-xs"
            >
              Auth / Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">Switch Role:</span>
            <div className="flex gap-1">
              <button onClick={() => onSelectRole('patient')} className="px-2 py-1 text-[11px] bg-teal-100 text-teal-800 rounded font-semibold">Patient</button>
              <button onClick={() => onSelectRole('doctor')} className="px-2 py-1 text-[11px] bg-blue-100 text-blue-800 rounded font-semibold">Doctor</button>
              <button onClick={() => onSelectRole('admin')} className="px-2 py-1 text-[11px] bg-purple-100 text-purple-800 rounded font-semibold">Admin</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
