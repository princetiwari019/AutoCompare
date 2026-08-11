import React, { useState } from 'react';
import { Sparkles, Bot, RotateCcw, ShieldAlert, Scale, Zap, Fuel, ShieldCheck, Tag } from 'lucide-react';
import { fetchComparisonSummary } from '../../services/aiService';

const AiComparisonSummary = ({ selectedIds = [] }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cachedIdsKey, setCachedIdsKey] = useState('');

  const currentKey = [...selectedIds].sort().join('_');

  const handleGenerateSummary = async () => {
    if (selectedIds.length < 2) return;

    // Check frontend cache
    if (summaryData && cachedIdsKey === currentKey) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchComparisonSummary({
        vehicleIds: selectedIds,
        language: 'hinglish'
      });

      if (res.success && res.summary) {
        setSummaryData(res);
        setCachedIdsKey(currentKey);
      } else {
        setError('AI comparison is temporarily unavailable.');
      }
    } catch (err) {
      console.error('Error fetching comparison summary', err);
      setError('AI comparison is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  // If fewer than 2 vehicles selected
  if (selectedIds.length < 2) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center space-y-2 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>✨ AI Comparison Summary</span>
        </div>
        <p className="text-xs text-slate-400">
          Select at least 2 vehicles to generate an AI comparison.
        </p>
      </div>
    );
  }

  // Markdown format helper for bold text
  const formatMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-cyan-300">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <React.Fragment key={lIdx}>
          {formattedLine}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-slate-950/80 space-y-6 shadow-2xl shadow-cyan-950/20">
      
      {/* Header & Trigger Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Multilingual Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            ✨ AI Comparison Summary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded strictly on MongoDB specification facts for your {selectedIds.length} selected vehicles.
          </p>
        </div>

        <button
          disabled={loading}
          onClick={handleGenerateSummary}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{loading ? 'Analyzing...' : cachedIdsKey === currentKey ? 'Refresh AI Summary' : 'Generate AI Comparison'}</span>
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-8 text-center glass-panel rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-cyan-300 font-semibold flex items-center justify-center gap-2">
            <Bot className="w-4 h-4" />
            <span>AutoCompare AI is analyzing the comparison...</span>
          </p>
        </div>
      )}

      {/* Error State Banner */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleGenerateSummary}
            className="px-3.5 py-1.5 bg-rose-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Generated Content Body */}
      {summaryData && !loading && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Executive Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800/80">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Comparative Spec Analysis</span>
            </div>
            <div>{formatMarkdown(summaryData.summary)}</div>
          </div>

          {/* "Best For" Insights Cards */}
          {summaryData.bestForInsights && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deterministic Best-For Category Champions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                
                {/* Best for Budget */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Best for Budget</span>
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    {summaryData.bestForInsights.bestForBudget}
                  </div>
                </div>

                {/* Best for Mileage */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Fuel className="w-3.5 h-3.5" />
                    <span>Best for Mileage</span>
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    {summaryData.bestForInsights.bestForMileage}
                  </div>
                </div>

                {/* Best for Safety */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Best for Safety</span>
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    {summaryData.bestForInsights.bestForSafety}
                  </div>
                </div>

                {/* Best for Performance */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Best for Performance</span>
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    {summaryData.bestForInsights.bestForPerformance}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Trade-Offs Section */}
          {summaryData.tradeOffs && (
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs text-amber-200 leading-relaxed font-medium space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Scale className="w-4 h-4" />
                <span>⚖️ Key Trade-Offs & Decision Insight</span>
              </div>
              <div>{formatMarkdown(summaryData.tradeOffs)}</div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AiComparisonSummary;
