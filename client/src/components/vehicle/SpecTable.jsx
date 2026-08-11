import React from 'react';
import { Gauge, Zap, Fuel, Activity, Users, Shield, Settings, Star } from 'lucide-react';

const SpecTable = ({ specs = {}, vehicle = {} }) => {
  const isCar = (vehicle.type || vehicle.vehicleType) === 'car';

  const items = [
    { 
      label: 'Engine Displacement', 
      value: (vehicle.engine || specs.engineDisplacement) ? `${vehicle.engine || specs.engineDisplacement} cc` : 'N/A (Electric)', 
      icon: Gauge 
    },
    { 
      label: 'Max Power Output', 
      value: (vehicle.power || specs.maxPower) ? `${vehicle.power || specs.maxPower} bhp` : 'N/A', 
      icon: Zap 
    },
    { 
      label: 'Max Torque', 
      value: (vehicle.torque || specs.maxTorque) ? `${vehicle.torque || specs.maxTorque} Nm` : 'N/A', 
      icon: Activity 
    },
    { 
      label: 'Mileage / Range', 
      value: `${vehicle.mileage || specs.mileage} ${vehicle.fuelType === 'Electric' ? 'km (range)' : 'km/l'}`, 
      icon: Fuel 
    },
    { 
      label: 'Fuel Type', 
      value: vehicle.fuelType || specs.fuelType || 'Petrol', 
      icon: Fuel 
    },
    { 
      label: 'Transmission', 
      value: vehicle.transmission || specs.transmission || 'Manual', 
      icon: Settings 
    },
    { 
      label: 'Seating Capacity', 
      value: `${vehicle.seatingCapacity || specs.seatingCapacity || 2} Persons`, 
      icon: Users 
    },
    { 
      label: 'Safety Crash Rating', 
      value: vehicle.safetyRating ? `${vehicle.safetyRating} / 5 Stars` : 'N/A', 
      icon: Shield 
    }
  ];

  return (
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
  );
};

export default SpecTable;
