import React, { useState } from 'react';
import { Camera, Armchair, Info, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { getImageUrl } from '../../utils/formatters';

const VehicleGallery = ({
  exteriorImages = [],
  interiorImages = [],
  detailImages = [],
  thumbnail,
  name = 'Vehicle',
  type = 'car'
}) => {
  const [activeTab, setActiveTab] = useState('exterior'); // 'exterior', 'interior', 'detail'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isBike = type === 'bike';
  const exteriorList = exteriorImages.length > 0 ? exteriorImages : (thumbnail ? [thumbnail] : []);
  const interiorList = interiorImages.length > 0 ? interiorImages : [];
  const detailList = detailImages.length > 0 ? detailImages : [];

  const hasInteriorTab = !isBike && interiorList.length > 0;
  const hasDetailTab = isBike && detailList.length > 0;

  const currentList =
    activeTab === 'exterior'
      ? exteriorList
      : activeTab === 'interior'
      ? interiorList
      : detailList;

  const currentRawImage = currentList[selectedIndex] || currentList[0];
  const currentImage = getImageUrl(currentRawImage);

  const handleNext = () => {
    if (currentList.length > 0) {
      setImageError(false);
      setSelectedIndex((prev) => (prev + 1) % currentList.length);
    }
  };

  const handlePrev = () => {
    if (currentList.length > 0) {
      setImageError(false);
      setSelectedIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedIndex(0);
    setImageError(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Category Tabs: Exterior / Interior / Cockpit Details */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => handleTabChange('exterior')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'exterior'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Exterior ({exteriorList.length})</span>
        </button>

        {hasInteriorTab && (
          <button
            onClick={() => handleTabChange('interior')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'interior'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span>Interior ({interiorList.length})</span>
          </button>
        )}

        {hasDetailTab && (
          <button
            onClick={() => handleTabChange('detail')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'detail'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Cockpit & Details ({detailList.length})</span>
          </button>
        )}
      </div>

      {/* Main Image Viewer Container */}
      <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden glass-panel border border-slate-800 group bg-slate-900 flex items-center justify-center">
        {currentImage && !imageError ? (
          <>
            <img
              src={currentImage}
              alt={`${name} - ${activeTab} ${selectedIndex + 1}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />

            {/* Prev / Next Arrows */}
            {currentList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 text-white backdrop-blur-md border border-slate-700/80 hover:bg-slate-900 transition-colors"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 text-white backdrop-blur-md border border-slate-700/80 hover:bg-slate-900 transition-colors"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter Badge */}
            {currentList.length > 1 && (
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-bold rounded-lg">
                {selectedIndex + 1} / {currentList.length}
              </div>
            )}
          </>
        ) : (
          /* Graceful Placeholder state if image fails or is missing */
          <div className="text-center p-8 space-y-2 text-slate-500">
            <ImageOff className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-xs font-semibold text-slate-400">
              {activeTab === 'exterior'
                ? 'Exterior images unavailable'
                : activeTab === 'interior'
                ? 'Interior images unavailable'
                : 'Detail images unavailable'}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {currentList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {currentList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setImageError(false);
              }}
              className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-slate-900 ${
                selectedIndex === idx
                  ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={getImageUrl(imgUrl)}
                alt="thumbnail"
                onError={(e) => { e.target.style.display = 'none'; }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default VehicleGallery;
