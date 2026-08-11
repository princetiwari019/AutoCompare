import React from 'react';
import { Gauge, Zap, Fuel, Activity, Users, Shield, Settings } from 'lucide-react';

const Specifications = ({ vehicle }) => {
  if (!vehicle) return null;

  const isCar = (vehicle.type || vehicle.vehicleType) === 'car';

  const rawItems = [
    {
      label: 'Engine Displacement',
      value: vehicle.engine ? `${vehicle.engine} cc` : (vehicle.specs?.engineDisplacement ? `${vehicle.specs.engineDisplacement} cc` : null),
      icon: Gauge
    },
    {
      label: 'Max Power',
      value: vehicle.power ? `${vehicle.power} bhp` : (vehicle.specs?.maxPower ? `${vehicle.specs.maxPower} bhp` : null),
      icon: Zap
    },
    {
      label: 'Max Torque',
      value: vehicle.torque ? `${vehicle.torque} Nm` : (vehicle.specs?.maxTorque ? `${vehicle.specs.maxTorque} Nm` : null),
      icon: Activity
    },
    {
      label: 'Mileage / Range',
      value: vehicle.mileage ? `${vehicle.mileage} ${vehicle.fuelType === 'Electric' ? 'km (range)' : 'km/l'}` : null,
      icon: Fuel
    },
    {
      label: 'Fuel Type',
      value: vehicle.fuelType || vehicle.specs?.fuelType,
      icon: Fuel
    },
    {
      label: 'Transmission',
      value: vehicle.transmission || vehicle.specs?.transmission,
      icon: Settings
    },
    {
      label: 'Seating Capacity',
      value: vehicle.seatingCapacity ? `${vehicle.seatingCapacity} Persons` : null,
      icon: Users
    },
    {
      label: 'Safety Crash Rating',
      value: vehicle.safetyRating ? `${vehicle.safetyRating} / 5 Stars` : null,
      icon: Shield
    }
  ];

  // Filter out any items with null/undefined values
  const items = rawItems.filter((i) => i.value !== null && i.value !== undefined && i.value !== '');

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
      <h2 className="text-xl font-bold text-white">Key Specifications</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Specifications;
