import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VehicleHeader from '../components/vehicle/VehicleHeader';
import VehicleGallery from '../components/vehicle/VehicleGallery';
import Specifications from '../components/vehicle/Specifications';
import FeatureList from '../components/vehicle/FeatureList';
import ProsCons from '../components/vehicle/ProsCons';
import VehicleDescription from '../components/vehicle/VehicleDescription';
import VehicleCard from '../components/vehicle/VehicleCard';
import { fetchVehicleById } from '../services/vehicleService';
import { ArrowLeft, Box, AlertCircle, RotateCcw } from 'lucide-react';

const DetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVehicleDetails = () => {
    setLoading(true);
    setError(null);
    fetchVehicleById(id)
      .then((res) => {
        if (res.success) {
          setVehicle(res.data);
          setSimilar(res.similar || []);
        } else {
          setError(res.message || 'Vehicle not found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching vehicle details', err);
        setError('Could not load vehicle details. Please check the ID or network connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVehicleDetails();
  }, [id]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="h-6 bg-slate-900 rounded w-44" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-900 rounded-3xl" />
          <div className="h-80 bg-slate-900 rounded-3xl" />
        </div>
        <div className="h-48 bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  // Error / Not Found State
  if (error || !vehicle) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error || 'The vehicle document you are looking for does not exist in MongoDB.'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={loadVehicleDetails}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
          <Link
            to="/vehicles"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Vehicles</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCar = (vehicle.type || vehicle.vehicleType) === 'car';
  const backPath = isCar ? '/cars' : '/bikes';
  const backLabel = isCar ? 'Back to Cars' : 'Back to Bikes';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Dynamic Back Navigation */}
      <div>
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </Link>
      </div>

      {/* Hero Grid: Left (Gallery) & Right (Header Summary) on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <VehicleGallery
          type={vehicle.type}
          exteriorImages={vehicle.exteriorImages}
          interiorImages={vehicle.interiorImages}
          detailImages={vehicle.detailImages}
          thumbnail={vehicle.images?.thumbnail}
          name={vehicle.name}
        />
        <VehicleHeader vehicle={vehicle} />
      </div>

      {/* Vehicle Description Overview */}
      <VehicleDescription description={vehicle.description} />

      {/* Key Specifications Table */}
      <Specifications vehicle={vehicle} />

      {/* Features Checklist */}
      <FeatureList features={vehicle.features} />

      {/* Pros & Cons Advantages/Disadvantages */}
      <ProsCons pros={vehicle.pros} cons={vehicle.cons} />

      {/* 3D Model Placeholder Box (Conditioned on model3D existence) */}
      {vehicle.model3D !== undefined && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Box className="w-5 h-5 text-cyan-400" />
            <span>Interactive 3D View — Coming Soon</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            3D interactive glTF model rendering feature for {vehicle.name} will be introduced in an upcoming phase.
          </p>
        </div>
      )}

      {/* Similar Vehicles Carousel / Grid */}
      {similar.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Similar Vehicles</h2>
            <p className="text-xs text-slate-400">Selected from the same vehicle class</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similar.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default DetailsPage;
