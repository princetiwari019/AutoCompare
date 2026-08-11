import React, { useState } from 'react';
import { Camera, Armchair, Maximize2, X } from 'lucide-react';

const ImageGallery = ({ images = {}, name = 'Vehicle' }) => {
  const [activeTab, setActiveTab] = useState('exterior'); // 'exterior' or 'interior'
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const exteriorList = images.exterior?.length > 0 ? images.exterior : [images.thumbnail];
  const interiorList = images.interior?.length > 0 ? images.interior : [];

  const currentList = activeTab === 'exterior' ? exteriorList : interiorList;
  const currentImage = selectedImage || currentList[0] || images.thumbnail;

  return (
    <div className="space-y-4">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            setActiveTab('exterior');
            setSelectedImage(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'exterior'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Exterior ({exteriorList.length})</span>
        </button>

        {interiorList.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('interior');
              setSelectedImage(null);
            }}
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
      </div>

      {/* Main Image Viewer */}
      <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden glass-panel border border-slate-800 group">
        <img
          src={currentImage}
          alt={`${name} ${activeTab}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/70 text-white backdrop-blur-md border border-slate-700/80 hover:bg-slate-900 transition-colors"
          title="Fullscreen view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails Row */}
      {currentList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {currentList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(imgUrl)}
              className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                currentImage === imgUrl
                  ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage}
            alt={name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
          />
        </div>
      )}

    </div>
  );
};

export default ImageGallery;
