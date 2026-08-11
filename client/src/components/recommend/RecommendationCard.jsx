import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, Scale, Check, ExternalLink, Sparkles, Bot, ChevronDown, ChevronUp, RotateCcw, ShieldAlert } from 'lucide-react';
import ScoreBreakdown from './ScoreBreakdown';
import { useCompare } from '../../context/CompareContext';
import { formatINR, getImageUrl } from '../../utils/formatters';
import { fetchRecommendationExplanation } from '../../services/aiService';

const RecommendationCard = ({ recommendation, userPreferences }) => {
  const { toggleCompare, isInCompare } = useCompare();

  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  // In-memory cache key based on vehicle ID + final score
  const [cachedKey, setCachedKey] = useState('');

  if (!recommendation) return null;

  const { rank, vehicle, finalScore, scoreBreakdown, recommendationReason } = recommendation;
  const isBestMatch = rank === 1;
  const inCompare = isInCompare(vehicle._id);

  const getRankBadge = (r) => {
    if (r === 1) return { label: '🥇 #1 Best Match', style: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20' };
    if (r === 2) return { label: '🥈 #2 Match', style: 'bg-slate-300 text-slate-950 font-bold' };
    if (r === 3) return { label: '🥉 #3 Match', style: 'bg-amber-700 text-white font-bold' };
    return { label: `#${r} Match`, style: 'bg-slate-800 text-slate-300' };
  };

  const badge = getRankBadge(rank);
  const rawThumb = vehicle.images?.thumbnail || vehicle.exteriorImages?.[0];
  const resolvedThumb = getImageUrl(rawThumb) || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80';

  const currentKey = `${vehicle._id}_${finalScore}`;

  const handleFetchExplanation = async () => {
    // If already open, toggle hide
    if (showExplanation) {
      setShowExplanation(false);
      return;
    }

    // Check if we have cached explanation for this exact recommendation finalScore
    if (explanation && cachedKey === currentKey) {
      setShowExplanation(true);
      return;
    }

    setShowExplanation(true);
    setLoadingAi(true);
    setAiError(null);

    try {
      const res = await fetchRecommendationExplanation({
        vehicleId: vehicle._id,
        vehicle,
        recommendation: {
          rank,
          finalScore,
          scoreBreakdown,
          recommendationReason
        },
        userPreferences,
        language: 'hinglish'
      });

      if (res.success && res.explanation) {
        setExplanation(res.explanation);
        setCachedKey(currentKey);
      } else {
        setAiError('AI explanation is temporarily unavailable.');
      }
    } catch (err) {
      console.error('Error fetching recommendation explanation', err);
      setAiError('AI explanation is temporarily unavailable.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Markdown format helper for AI response
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
    <div className={`glass-card rounded-3xl p-6 transition-all duration-300 border space-y-5 relative ${
      isBestMatch
        ? 'border-cyan-500/50 bg-gradient-to-b from-cyan-950/20 via-slate-900 to-slate-900 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
        : 'border-slate-800 hover:border-slate-700 bg-slate-900/90'
    }`}>
      
      {/* Top Banner for Best Match */}
      {isBestMatch && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-extrabold w-max">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Top Recommendation • Based on your exact preference weights</span>
        </div>
      )}

      {/* Main Grid: Left Image & Details, Right Match Score */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Image Thumbnail */}
        <div className="md:col-span-4 relative group">
          <span className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-xs font-black uppercase z-10 backdrop-blur-md ${badge.style}`}>
            {badge.label}
          </span>

          <img
            src={resolvedThumb}
            alt={vehicle.name}
            className="w-full h-44 object-cover rounded-2xl border border-slate-800 bg-slate-950 group-hover:scale-102 transition-transform duration-300"
          />
        </div>

        {/* Vehicle Metadata & Reasons */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <span>{vehicle.brand}</span>
            <span>•</span>
            <span className="text-slate-400">{vehicle.type}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">{vehicle.name}</h3>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-lg font-black text-white">{formatINR(vehicle.price)}</span>
            {vehicle.mileage > 0 && (
              <span className="text-slate-300 font-semibold px-2.5 py-1 bg-slate-800 rounded-lg">
                {vehicle.mileage} {vehicle.fuelType === 'Electric' ? 'km (range)' : 'km/l'}
              </span>
            )}
            {vehicle.rating && (
              <span className="flex items-center gap-1 text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{vehicle.rating}</span>
              </span>
            )}
          </div>

          {/* Reason Explanation Box */}
          {recommendationReason && (
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed italic">
              "{recommendationReason}"
            </p>
          )}
        </div>

        {/* Match Score Badge */}
        <div className="md:col-span-3 text-center glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Overall Match Score
          </span>
          <div className="text-3xl font-black text-cyan-400">
            {finalScore}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Weighted Score Out of 100
          </span>
        </div>

      </div>

      {/* Score Breakdown Progress Bars */}
      {scoreBreakdown && <ScoreBreakdown breakdown={scoreBreakdown} />}

      {/* AI Explanation Trigger Button */}
      <div className="pt-2">
        <button
          onClick={handleFetchExplanation}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 hover:from-cyan-900/60 hover:to-slate-800 border border-cyan-500/30 rounded-2xl text-xs font-extrabold text-cyan-300 flex items-center justify-between transition-all group shadow-sm hover:shadow-cyan-950/30"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>✨ Why this match?</span>
          </div>
          {showExplanation ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Expandable AI Explanation Container */}
        {showExplanation && (
          <div className="mt-3 p-4 glass-panel rounded-2xl border border-cyan-500/40 bg-slate-950/90 text-xs leading-relaxed text-slate-200 space-y-2 animate-fadeIn shadow-xl">
            <div className="flex items-center gap-2 font-bold text-cyan-400 pb-2 border-b border-slate-800">
              <Bot className="w-4 h-4" />
              <span>AutoCompare AI Match Analysis</span>
            </div>

            {loadingAi ? (
              <div className="py-4 text-center text-cyan-300 font-semibold flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>AutoCompare AI is analyzing this match...</span>
              </div>
            ) : aiError ? (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{aiError}</span>
                </div>
                <button
                  onClick={handleFetchExplanation}
                  className="px-2.5 py-1 bg-rose-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : (
              <div className="whitespace-pre-line leading-relaxed font-medium">
                {formatMarkdown(explanation)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => toggleCompare(vehicle._id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            inCompare
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          {inCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
          <span>{inCompare ? 'Remove from Compare' : 'Add to Compare'}</span>
        </button>

        <Link
          to={`/vehicles/${vehicle._id}`}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

export default RecommendationCard;
