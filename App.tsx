import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import MatchFinder from './components/MatchFinder';
import ItineraryGenerator from './components/ItineraryGenerator';
import ProfilePage from './components/ProfilePage';
import NotificationModal, { NotificationType } from './components/NotificationModal';
import { AppView } from './types';
import { Compass, Users, UserCircle, Menu, X, LogOut, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.MATCH);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: NotificationType;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const showNotification = (title: string, message: string, type: NotificationType = 'info') => {
    setNotification({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading SafePassage Network...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user is not authenticated
  if (!user || !profile) {
    return <AuthPage />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      showNotification('Logout Failed', error.message || 'Failed to sign out. Please try again.', 'error');
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === view
          ? 'bg-brand-500 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-brand-600'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 text-white p-2 rounded-lg">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SafePassage<span className="text-brand-500">Network</span></h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavItem view={AppView.MATCH} icon={Users} label="Community Match" />
            <NavItem view={AppView.ITINERARY} icon={Compass} label="Ethical Itinerary" />
            <button
              onClick={() => setCurrentView(AppView.PROFILE)}
              className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === AppView.PROFILE
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-brand-600'
                }`}
            >
              <UserCircle className="w-5 h-5" />
              <span>{profile.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-4 flex flex-col gap-2 shadow-lg absolute w-full z-50">
            <NavItem view={AppView.MATCH} icon={Users} label="Community Match" />
            <NavItem view={AppView.ITINERARY} icon={Compass} label="Ethical Itinerary" />
            <button
              onClick={() => {
                setCurrentView(AppView.PROFILE);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === AppView.PROFILE
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-brand-600'
                }`}
            >
              <UserCircle className="w-5 h-5" />
              <span>Profile ({profile.name})</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {currentView === AppView.MATCH && <MatchFinder />}
          {currentView === AppView.ITINERARY && <ItineraryGenerator />}
          {currentView === AppView.PROFILE && <ProfilePage />}
          {currentView === AppView.HOME && <MatchFinder />} {/* Default */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 SafePassage Network. Built with Responsible AI Principles.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
            <span>Privacy Policy</span>
            <span>Community Guidelines</span>
            <span>Report Issue</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;