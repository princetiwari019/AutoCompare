import React, { useState } from 'react';
import ComparisonVehicleHeader from './ComparisonVehicleHeader';
import { EyeOff, Eye, Award } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const ComparisonTable = ({ vehicles = [] }) => {
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  if (!vehicles || vehicles.length === 0) return null;

  // Define specifications with extraction function and best-value comparator
  const rows = [
    {
      key: 'price',
      label: 'Price (Ex-Showroom)',
      getValue: (v) => v.price,
      format: (v) => formatINR(v.price),
      bestCriterion: 'lowest' // Lowest price is best
    },
    {
      key: 'mileage',
      label: 'Mileage / Efficiency',
      getValue: (v) => v.mileage || v.specs?.mileage || 0,
      format: (v) => {
        const val = v.mileage || v.specs?.mileage;
        return val ? `${val} ${v.fuelType === 'Electric' ? 'km (range)' : 'km/l'}` : 'N/A';
      },
      bestCriterion: 'highest' // Highest mileage is best
    },
    {
      key: 'power',
      label: 'Max Power',
      getValue: (v) => v.power || v.specs?.maxPower || 0,
      format: (v) => {
        const val = v.power || v.specs?.maxPower;
        return val ? `${val} bhp` : 'N/A';
      },
      bestCriterion: 'highest' // Highest power is best
    },
    {
      key: 'torque',
      label: 'Max Torque',
      getValue: (v) => v.torque || v.specs?.maxTorque || 0,
      format: (v) => {
        const val = v.torque || v.specs?.maxTorque;
        return val ? `${val} Nm` : 'N/A';
      },
      bestCriterion: 'highest'
    },
    {
      key: 'engine',
      label: 'Engine Displacement',
      getValue: (v) => v.engine || v.specs?.engineDisplacement || 0,
      format: (v) => {
        const val = v.engine || v.specs?.engineDisplacement;
        return val ? `${val} cc` : (v.fuelType === 'Electric' ? 'Electric' : 'N/A');
      },
      bestCriterion: null
    },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      getValue: (v) => v.fuelType || v.specs?.fuelType,
      format: (v) => (v.fuelType || v.specs?.fuelType) || 'N/A',
      bestCriterion: null
    },
    {
      key: 'transmission',
      label: 'Transmission',
      getValue: (v) => v.transmission || v.specs?.transmission,
      format: (v) => (v.transmission || v.specs?.transmission) || 'N/A',
      bestCriterion: null
    },
    {
      key: 'seating',
      label: 'Seating Capacity',
      getValue: (v) => v.seatingCapacity || v.specs?.seatingCapacity || 0,
      format: (v) => {
        const val = v.seatingCapacity || v.specs?.seatingCapacity;
        return val ? `${val} Persons` : 'N/A';
      },
      bestCriterion: null
    },
    {
      key: 'safetyRating',
      label: 'Safety Crash Rating',
      getValue: (v) => v.safetyRating || 0,
      format: (v) => v.safetyRating ? `${v.safetyRating} / 5 Stars` : 'N/A',
      bestCriterion: 'highest' // Highest safety rating is best
    },
    {
      key: 'rating',
      label: 'Overall Rating',
      getValue: (v) => v.rating || 0,
      format: (v) => v.rating ? `${v.rating} / 5.0 ⭐` : 'N/A',
      bestCriterion: 'highest' // Highest user rating is best
    }
  ];

  // Helper to determine best numeric value for a row
  const getBestValue = (row) => {
    if (!row.bestCriterion || vehicles.length < 2) return null;
    const numericValues = vehicles
      .map((v) => Number(row.getValue(v)))
      .filter((val) => !isNaN(val) && val > 0);

    if (numericValues.length < 2) return null;

    if (row.bestCriterion === 'lowest') {
      return Math.min(...numericValues);
    }
    if (row.bestCriterion === 'highest') {
      return Math.max(...numericValues);
    }
    return null;
  };

  const isDifferent = (row) => {
    if (vehicles.length <= 1) return false;
    const firstVal = row.format(vehicles[0]);
    return vehicles.some((v) => row.format(v) !== firstVal);
  };

  const filteredRows = highlightDiffs ? rows.filter(isDifferent) : rows;

  return (
    <div className="space-y-4">
      
      {/* Table Controls */}
      <div className="flex items-center justify-between glass-panel px-5 py-3 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400 font-medium">
          Comparing <strong className="text-white">{vehicles.length}</strong> vehicles
        </span>

        <button
          onClick={() => setHighlightDiffs(!highlightDiffs)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            highlightDiffs
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          {highlightDiffs ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{highlightDiffs ? 'Showing Differences Only' : 'Highlight Differences'}</span>
        </button>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800 scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          {/* Header Row: Vehicle Column Cards */}
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90">
              <th className="p-4 w-1/5 text-xs font-bold uppercase tracking-wider text-slate-400 sticky left-0 bg-slate-950/95 z-20 shadow-md backdrop-blur-md">
                Specifications
              </th>
              {vehicles.map((v) => (
                <th key={v._id} className="p-4 align-top min-w-[200px]">
                  <ComparisonVehicleHeader vehicle={v} />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredRows.map((row) => {
              const diff = isDifferent(row);
              const bestVal = getBestValue(row);

              return (
                <tr
                  key={row.key}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    diff ? 'bg-cyan-950/15' : ''
                  }`}
                >
                  {/* Sticky Spec Title Column */}
                  <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-950/95 z-10 backdrop-blur-md border-r border-slate-800/80">
                    <div className="flex items-center gap-2">
                      {diff && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      <span>{row.label}</span>
                    </div>
                  </td>

                  {/* Vehicle Values */}
                  {vehicles.map((v) => {
                    const rawVal = Number(row.getValue(v));
                    const isBest = bestVal !== null && rawVal === bestVal;

                    return (
                      <td key={v._id} className="p-4 align-middle">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs ${
                            isBest
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                              : 'text-slate-200'
                          }`}
                        >
                          <span>{row.format(v)}</span>
                          {isBest && (
                            <span className="px-1 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded tracking-wider flex items-center gap-0.5">
                              <Award className="w-2.5 h-2.5" />
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ComparisonTable;
