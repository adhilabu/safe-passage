import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { SafetyPriority, CommunityStyle, UserProfile } from '../types';
import { generateSafetyIcebreaker } from '../services/geminiService';
import { Shield, MapPin, MessageSquare, Sparkles, Loader2, Search, Calendar, User, ChevronDown } from 'lucide-react';

const MatchFinder: React.FC = () => {
  // Navigation State
  const [step, setStep] = useState<'INPUT' | 'LOADING' | 'RESULTS'>('INPUT');

  // Form State
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    priority: SafetyPriority.SOLO_FEMALE,
    style: CommunityStyle.CULTURE_SEEKER
  });

  // Action State
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [icebreaker, setIcebreaker] = useState<{ userId: string; text: string } | null>(null);

  // Filter users based on form selection
  const filteredUsers = MOCK_USERS.filter(u => 
    u.priorities.includes(formData.priority)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('LOADING');
    // Simulate network delay to make it feel like a real search
    setTimeout(() => {
      setStep('RESULTS');
    }, 1500);
  };

  const handleConnect = async (user: UserProfile) => {
    setGeneratingFor(user.id);
    setIcebreaker(null);
    try {
      // Use the selected priority for the connection context
      const result = await generateSafetyIcebreaker(user.name, formData.priority, formData.destination || "our destination");
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
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center py-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Find your <span className="text-brand-600">ethical travel squad</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Connect with travelers committed to safety, justice, and community impact.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-brand-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Search className="w-5 h-5" /> 
              Define your journey
            </h3>
          </div>
          
          <form onSubmit={handleSearch} className="p-8 space-y-8">
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all h-[60px]"
                  placeholder="e.g. Mexico City, Kyoto"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            {/* Dates & Priority */}
            <div className="grid md:grid-cols-2 gap-8">
               {/* Travel Dates */}
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Safety & Justice Priority</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
                  <select
                    className="w-full pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer h-[60px]"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as SafetyPriority})}
                  >
                    {Object.values(SafetyPriority).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Community Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Community Style</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <select
                  className="w-full pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer h-[60px]"
                  value={formData.style}
                  onChange={(e) => setFormData({...formData, style: e.target.value as CommunityStyle})}
                >
                  {Object.values(CommunityStyle).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find Ethical Mates
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: LOADING ---
  if (step === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
        <h2 className="text-xl font-semibold text-gray-900">Vetting profiles for safety...</h2>
        <p className="text-gray-500">Looking for matches who prioritize {formData.priority}</p>
      </div>
    );
  }

  // --- VIEW: RESULTS ---
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Result Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Found {filteredUsers.length} matches for <span className="text-brand-600">{formData.priority}</span>
          </h2>
          <p className="text-sm text-gray-500">Destination: {formData.destination}</p>
        </div>
        <button 
          onClick={resetSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Modify Search
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow animate-in zoom-in duration-300">
            <div className="flex items-start gap-4">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-100" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full font-medium">
                    {user.style}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {user.location}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {user.priorities.map(p => (
                <span key={p} className={`text-xs px-2 py-1 rounded-md ${p === formData.priority ? 'bg-brand-100 text-brand-800 font-medium' : 'bg-gray-100 text-gray-700'}`}>
                  {p}
                </span>
              ))}
            </div>

            <p className="mt-4 text-gray-600 text-sm flex-grow">"{user.bio}"</p>

            <div className="mt-6 pt-4 border-t border-gray-100">
              {icebreaker?.userId === user.id ? (
                <div className="bg-blue-50 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">AI Safety Icebreaker</h4>
                      <p className="text-sm text-blue-900 italic">"{icebreaker.text}"</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors">
                    Send Message
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleConnect(user)}
                  disabled={generatingFor === user.id}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {generatingFor === user.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Safety Check...
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
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No exact matches found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-1">
            We couldn't find anyone with the exact priority "{formData.priority}" in this location yet. Try broadening your search or prioritizing a different safety need.
          </p>
          <button 
             onClick={resetSearch}
             className="mt-4 text-brand-600 font-medium hover:underline"
          >
            Adjust Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchFinder;