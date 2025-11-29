import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SafetyPriority, ItineraryResult, ItineraryType } from '../types';
import { generateEthicalItinerary } from '../services/geminiService';
import ReportModal from './ReportModal';
import MultiSelect from './MultiSelect';
import { useAuth } from '../contexts/AuthContext';
import { Map, Loader2, AlertCircle, ExternalLink, Leaf, ShieldCheck, Flag, MapPin, Shield, Clock, ChevronDown, Compass } from 'lucide-react';

const ItineraryGenerator: React.FC = () => {
  const { profile } = useAuth();
  const [destination, setDestination] = useState('');
  const [priorities, setPriorities] = useState<SafetyPriority[]>([SafetyPriority.SOLO_FEMALE]);
  const [itineraryTypes, setItineraryTypes] = useState<ItineraryType[]>([ItineraryType.SIGHTSEEING]);
  const [useProfileData, setUseProfileData] = useState(false);
  const [days, setDays] = useState(3);
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [error, setError] = useState('');

  // Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Update priorities and itinerary types when profile data toggle changes
  React.useEffect(() => {
    if (useProfileData && profile) {
      if (profile.priorities && profile.priorities.length > 0) {
        setPriorities(profile.priorities);
      }
      if (profile.preferredItineraryTypes && profile.preferredItineraryTypes.length > 0) {
        setItineraryTypes(profile.preferredItineraryTypes);
      }
    }
  }, [useProfileData, profile]);

  const handlePrioritiesChange = (newPriorities: SafetyPriority[]) => {
    if (useProfileData) return; // Don't allow manual changes when using profile data
    setPriorities(newPriorities);
  };

  const handleItineraryTypesChange = (newTypes: ItineraryType[]) => {
    if (useProfileData) return;
    // Filter out CUSTOM from multi-select as it requires text input
    const filteredTypes = newTypes.filter(t => t !== ItineraryType.CUSTOM);
    setItineraryTypes(filteredTypes.length > 0 ? filteredTypes : [ItineraryType.SIGHTSEEING]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (priorities.length === 0) {
      setError('Please select at least one Safety & Justice Priority');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Use multiple itinerary types or custom type
      const typesToUse = customType ? customType : itineraryTypes.join(', ');
      const data = await generateEthicalItinerary(destination, priorities, days, typesToUse);
      setResult(data);
    } catch (err) {
      setError("We encountered an issue generating your safe passage. Please verify your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-3xl p-10 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
            <Map className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold">
            Ethical Itinerary Generator
          </h2>
        </div>
        <p className="mt-3 text-brand-50 text-lg max-w-3xl leading-relaxed">
          Create travel plans that respect your safety needs and the local community.
          Our AI vets locations for accessibility, safety reputation, and ethical ownership.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Destination & Duration Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Destination</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Mexico City, Kyoto"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Duration Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Duration</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Safety Priority Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 ml-1">Safety & Justice Priorities</label>
              {profile && profile.priorities && profile.priorities.length > 0 && (
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-brand-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={useProfileData}
                    onChange={(e) => setUseProfileData(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  Use my profile priorities
                </label>
              )}
            </div>
            <MultiSelect<SafetyPriority>
              options={Object.values(SafetyPriority)}
              selected={priorities}
              onChange={handlePrioritiesChange}
              placeholder="Select safety priorities..."
              disabled={useProfileData}
              icon={<Shield className="w-5 h-5 text-gray-400" />}
            />
            {priorities.length === 0 && (
              <p className="text-xs text-red-600 ml-1 mt-1">Select at least one priority</p>
            )}
          </div>

          {/* Itinerary Type Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 ml-1">Travel Styles</label>
              {profile && profile.preferredItineraryTypes && profile.preferredItineraryTypes.length > 0 && (
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-brand-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={useProfileData}
                    onChange={(e) => setUseProfileData(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  Use profile types
                </label>
              )}
            </div>
            <MultiSelect<ItineraryType>
              options={Object.values(ItineraryType).filter(t => t !== ItineraryType.CUSTOM)}
              selected={itineraryTypes}
              onChange={handleItineraryTypesChange}
              placeholder="Select travel styles..."
              disabled={useProfileData}
              icon={<Compass className="w-5 h-5 text-gray-400" />}
            />
            
            {/* Custom Type Input (optional) */}
            <div className="mt-3">
              <label className="text-xs font-medium text-gray-500 ml-1 mb-2 block">Or specify custom type (optional)</label>
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="e.g., Photography Tour, Wine Tasting"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !destination}
              className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3.5 px-10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Vetting Locations...
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5" />
                  Generate Safe Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Transparency / Ethics Badge */}
          <div className="flex flex-wrap gap-4 bg-gradient-to-r from-blue-50 to-brand-50 p-5 rounded-2xl border border-blue-100 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Vetted For:</span>
              <div className="flex flex-wrap gap-1.5">
                {priorities.map((p, idx) => (
                  <span key={p} className="bg-white px-2.5 py-1 rounded-full text-xs font-medium text-blue-700 shadow-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-medium">Prioritizes Local/Ethical Businesses</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-10 prose prose-teal max-w-none">
              <ReactMarkdown>{result.markdown}</ReactMarkdown>
            </div>

            {/* Citations / Grounding */}
            {result.sources.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-t border-gray-200 p-6">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Verified Sources
                </h4>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {result.sources.map((source, idx) => (
                    <li key={idx}>
                      <a
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 hover:underline truncate bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Accountability Action */}
            <div className="bg-gray-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm border-t border-gray-200">
              <span className="text-gray-600 italic text-xs">⚠️ AI-generated content. Verify critical details independently.</span>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-all border border-red-200 hover:border-red-300"
              >
                <Flag className="w-4 h-4" />
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contextData={result?.markdown || "No Content"}
      />
    </div>
  );
};

export default ItineraryGenerator;