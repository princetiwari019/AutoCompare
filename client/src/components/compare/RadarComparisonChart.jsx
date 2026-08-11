import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const RadarComparisonChart = ({ vehicles = [] }) => {
  if (!vehicles || vehicles.length === 0) return null;

  // Prepare radar chart payload structure
  const dataKeys = [
    { key: 'fuelEfficiency', label: 'Fuel Economy' },
    { key: 'performance', label: 'Performance' },
    { key: 'comfort', label: 'Comfort' },
    { key: 'safety', label: 'Safety' },
    { key: 'techAndFeatures', label: 'Tech & Features' },
    { key: 'valueForMoney', label: 'Value' }
  ];

  const chartData = dataKeys.map((item) => {
    const entry = { subject: item.label };
    vehicles.forEach((v) => {
      entry[v.name] = v.scores?.[item.key] || 5;
    });
    return entry;
  });

  const colors = ['#3b82f6', '#06b6d4', '#f59e0b'];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white">Visual Score Comparison</h3>
        <p className="text-xs text-slate-400">Radar score analysis across key performance dimensions (0 - 10 scale)</p>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#475569" />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
            />

            {vehicles.map((v, idx) => (
              <Radar
                key={v._id}
                name={v.name}
                dataKey={v.name}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.35}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarComparisonChart;
