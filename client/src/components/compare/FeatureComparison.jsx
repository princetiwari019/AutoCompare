import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';

const FeatureComparison = ({ vehicles = [] }) => {
  if (!vehicles || vehicles.length === 0) return null;

  // Collect all unique features from all selected vehicles
  const allFeatures = Array.from(
    new Set(
      vehicles.flatMap((v) => v.features || [])
    )
  ).sort();

  if (allFeatures.length === 0) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Feature & Equipment Comparison</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Comparing {allFeatures.length} equipment features verified from MongoDB specifications
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
                Feature
              </th>
              {vehicles.map((v) => (
                <th key={v._id} className="p-3 text-xs font-bold text-slate-200">
                  {v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {allFeatures.map((feature, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-semibold text-slate-300">
                  {feature}
                </td>
                {vehicles.map((v) => {
                  const hasFeature = v.features && v.features.includes(feature);
                  return (
                    <td key={v._id} className="p-3">
                      {hasFeature ? (
                        <div className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                          <Check className="w-4 h-4" />
                          <span>Included</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-500 bg-slate-900/40 px-2 py-0.5 rounded-lg border border-slate-800">
                          <X className="w-3.5 h-3.5 text-slate-600" />
                          <span>Not Included</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureComparison;
