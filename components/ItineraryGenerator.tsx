import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SafetyPriority, ItineraryResult, ItineraryType } from '../types';
import { generateEthicalItinerary } from '../services/geminiService';
import ReportModal from './ReportModal';
import { Map, Loader2, AlertCircle, ExternalLink, Leaf, ShieldCheck, Flag, MapPin, Shield, Clock, ChevronDown, Compass } from 'lucide-react';

const ItineraryGenerator: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [priority, setPriority] = useState<SafetyPriority>(SafetyPriority.SOLO_FEMALE);
  const [days, setDays] = useState(3);
  const [itineraryType, setItineraryType] = useState<ItineraryType>(ItineraryType.SIGHTSEEING);
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [error, setError] = useState('');


  // Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const typeToUse = itineraryType === ItineraryType.CUSTOM ? customType : itineraryType;
      const data = await generateEthicalItinerary(destination, priority, days, typeToUse);
      setResult(data);
    } catch (err) {
      setError("We encountered an issue generating your safe passage. Please verify your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Map className="w-8 h-8" />
          Ethical Itinerary Generator
        </h2>
        <p className="mt-2 text-brand-100 max-w-2xl">
          Create travel plans that respect your safety needs and the local community.
          Our AI vets locations for accessibility, safety reputation, and ethical ownership.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">

          {/* Destination Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Destination</label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Mexico City, Kyoto"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Safety Priority Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Safety & Justice Priority</label>
            <div className="relative group">
              <Shield className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as SafetyPriority)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {Object.values(SafetyPriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Duration (Days)</label>
            <div className="relative group">
              <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value={1}>1 Day</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>7 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Itinerary Type Input */}
          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium text-gray-700 ml-1">Travel Style / Itinerary Type</label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative group">
                <Compass className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <select
                  value={itineraryType}
                  onChange={(e) => setItineraryType(e.target.value as ItineraryType)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {Object.values(ItineraryType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Custom Type Input (shown when Custom is selected) */}
              {itineraryType === ItineraryType.CUSTOM && (
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="e.g., Photography Tour, Wine Tasting, etc."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  required
                />
              )}
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || !destination}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Transparency / Ethics Badge */}
          <div className="flex flex-wrap gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">Vetted For:</span> {priority}
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span>Prioritizes Local/Ethical Businesses</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 prose prose-teal max-w-none">
              <ReactMarkdown>{result.markdown}</ReactMarkdown>
            </div>

            {/* Citations / Grounding */}
            {result.sources.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 p-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Verified Sources (Transparency)</h4>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {result.sources.map((source, idx) => (
                    <li key={idx}>
                      <a
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 hover:underline truncate"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Accountability Action */}
            <div className="bg-gray-100 p-4 flex justify-between items-center text-sm border-t border-gray-200">
              <span className="text-gray-500 italic">AI-generated content. Verify critical details independently.</span>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1 rounded transition-colors"
              >
                <Flag className="w-4 h-4" />
                Report Unsafe/Biased Content
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