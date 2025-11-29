import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { SafetyPriority, CommunityStyle, UserProfile } from '../types';
import { generateSafetyIcebreaker } from '../services/geminiService';
import MultiSelect from './MultiSelect';
import { useAuth } from '../contexts/AuthContext';
import { Shield, MapPin, MessageSquare, Sparkles, Loader2, Search, Calendar, User } from 'lucide-react';

const MatchFinder: React.FC = () => {
  const { profile } = useAuth();
  // Navigation State
  const [step, setStep] = useState<'INPUT' | 'LOADING' | 'RESULTS'>('INPUT');

  // Form State
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    priorities: [SafetyPriority.SOLO_FEMALE] as SafetyPriority[],
    styles: [CommunityStyle.CULTURE_SEEKER] as CommunityStyle[]
  });

  const [useProfileData, setUseProfileData] = useState(false);

  // Action State
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [icebreaker, setIcebreaker] = useState<{ userId: string; text: string } | null>(null);

  // Update form data when profile data toggle changes
  React.useEffect(() => {
    if (useProfileData && profile) {
      if (profile.priorities && profile.priorities.length > 0) {
        setFormData(prev => ({ ...prev, priorities: profile.priorities }));
      }
      if (profile.style) {
        setFormData(prev => ({ ...prev, styles: [profile.style] }));
      }
    }
  }, [useProfileData, profile]);

  // Filter users based on form selection - match if user has ANY of the selected priorities or styles
  const filteredUsers = MOCK_USERS.filter(u => {
    const hasPriority = formData.priorities.some(p => u.priorities.includes(p));
    const hasStyle = formData.styles.includes(u.style);
    return hasPriority || hasStyle;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('LOADING');
    // Simulate network delay to make it feel like a real search
    setTimeout(() => {
      setStep('RESULTS');
    }, 1500);
  };

  const handlePrioritiesChange = (newPriorities: SafetyPriority[]) => {
    if (useProfileData) return;
    setFormData(prev => ({ ...prev, priorities: newPriorities }));
  };

  const handleStylesChange = (newStyles: CommunityStyle[]) => {
    if (useProfileData) return;
    setFormData(prev => ({ ...prev, styles: newStyles }));
  };

  const handleConnect = async (user: UserProfile) => {
    setGeneratingFor(user.id);
    setIcebreaker(null);
    try {
      // Use the first selected priority for the connection context
      const primaryPriority = formData.priorities[0] || SafetyPriority.SOLO_FEMALE;
      const result = await generateSafetyIcebreaker(user.name, primaryPriority, formData.destination || "our destination");
      setIcebreaker({ userId: user.id, text: result.message });
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingFor(null);
    }
  };

  const resetSearch = () => {
    setStep('INPUT');
    setIcebreaker(null);
  };

  // --- VIEW: INPUT FORM ---
  if (step === 'INPUT') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-3xl p-10 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Search className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">
              Find Your Travel Squad
            </h1>
          </div>
          <p className="text-brand-50 text-lg max-w-3xl leading-relaxed">
            Connect with travelers committed to safety, justice, and community impact.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          
          <form onSubmit={handleSearch} className="p-8 space-y-6">
            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Destination</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  placeholder="e.g. Mexico City, Kyoto"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            {/* Dates & Priority */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Travel Dates */}
               <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Travel Dates</label>
                <div className="flex items-center gap-3">
                  {/* Start Date */}
                  <div className="relative group flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Calendar className="text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                    </div>
                    <label className="absolute left-10 top-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider pointer-events-none">Depart</label>
                    <input
                      type="date"
                      required
                      className="w-full pl-10 pr-2 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none min-w-0 text-sm h-[60px]"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  
                  {/* End Date */}
                  <div className="relative group flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Calendar className="text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                    </div>
                    <label className="absolute left-10 top-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider pointer-events-none">Return</label>
                    <input
                      type="date"
                      required
                      className="w-full pl-10 pr-2 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none min-w-0 text-sm h-[60px]"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 ml-1">Safety Priorities</label>
                  {profile && profile.priorities && profile.priorities.length > 0 && (
                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-brand-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={useProfileData}
                        onChange={(e) => setUseProfileData(e.target.checked)}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      Use profile
                    </label>
                  )}
                </div>
                <MultiSelect<SafetyPriority>
                  options={Object.values(SafetyPriority)}
                  selected={formData.priorities}
                  onChange={handlePrioritiesChange}
                  placeholder="Select safety priorities..."
                  disabled={useProfileData}
                  icon={<Shield className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Community Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Community Styles</label>
              <MultiSelect<CommunityStyle>
                options={Object.values(CommunityStyle)}
                selected={formData.styles}
                onChange={handleStylesChange}
                placeholder="Select community styles..."
                disabled={useProfileData}
                icon={<User className="w-5 h-5 text-gray-400" />}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              Find Travel Matches
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: LOADING ---
  if (step === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6 p-6">
        <div className="bg-brand-50 p-6 rounded-full">
          <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vetting profiles for safety...</h2>
          <p className="text-gray-600">Looking for matches with your selected priorities and styles</p>
        </div>
      </div>
    );
  }

  // --- VIEW: RESULTS ---
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header Result Bar */}
      <div className="bg-gradient-to-r from-white to-brand-50/30 p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-2">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Found {filteredUsers.length} {filteredUsers.length === 1 ? 'match' : 'matches'}
          </h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.priorities.map(p => (
              <span key={p} className="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full font-medium">{p}</span>
            ))}
            {formData.styles.map(s => (
              <span key={s} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">{s}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{formData.destination}</span>
          </div>
        </div>
        <button 
          onClick={resetSearch}
          className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-brand-500 transition-all shadow-sm"
        >
          Modify Search
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col h-full hover:shadow-xl hover:border-brand-200 transition-all animate-in zoom-in duration-300">
            <div className="flex items-start gap-4 mb-4">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-200 shadow-sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{user.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{user.location}</span>
                </div>
                <span className="inline-block mt-2 text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">
                  {user.style}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {user.priorities.map(p => (
                <span key={p} className={`text-xs px-2.5 py-1 rounded-full ${
                  formData.priorities.includes(p) ? 'bg-brand-100 text-brand-800 font-semibold ring-1 ring-brand-200' : 'bg-gray-100 text-gray-600'
                }`}>
                  {p}
                </span>
              ))}
            </div>

            <p className="text-gray-600 text-sm flex-grow leading-relaxed italic">"{user.bio}"</p>

            <div className="mt-5 pt-5 border-t border-gray-100">
              {icebreaker?.userId === user.id ? (
                <div className="bg-gradient-to-br from-blue-50 to-brand-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">AI Safety Icebreaker</h4>
                      <p className="text-sm text-blue-900 leading-relaxed">"{icebreaker.text}"</p>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                    Send Message
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleConnect(user)}
                  disabled={generatingFor === user.id}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {generatingFor === user.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Connect Safely
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
            We couldn't find anyone matching your selected priorities and styles in this location yet. Try broadening your search criteria.
          </p>
          <button 
             onClick={resetSearch}
             className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Adjust Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchFinder;