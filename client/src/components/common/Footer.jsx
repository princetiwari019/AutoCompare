import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Bike, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-auto text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Auto<span className="text-cyan-400">Compare</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Next-generation vehicle discovery, side-by-side comparison, and weighted recommendation platform for cars and bikes.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5 text-cyan-400" /> Cars</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Bike className="w-3.5 h-3.5 text-cyan-400" /> Bikes</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/vehicles?type=car" className="hover:text-cyan-400 transition-colors">Explore Cars</Link></li>
              <li><Link to="/vehicles?type=bike" className="hover:text-cyan-400 transition-colors">Explore Bikes</Link></li>
              <li><Link to="/budget-finder" className="hover:text-cyan-400 transition-colors">Budget Explorer</Link></li>
              <li><Link to="/recommend" className="hover:text-cyan-400 transition-colors">Smart Recommendation</Link></li>
              <li><Link to="/compare" className="hover:text-cyan-400 transition-colors">Side-by-Side Compare</Link></li>
            </ul>
          </div>

          {/* Col 3: Architecture Highlights (Interview Ready) */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Technical Stack</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> Decoupled REST APIs</li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Weighted Recommendation Engine</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Express + Mongoose DB</li>
              <li className="flex items-center gap-2"><Car className="w-3.5 h-3.5 text-cyan-400" /> React 18 + Vite + Tailwind</li>
            </ul>
          </div>

          {/* Col 4: Note for Developer */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Architect Note</span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Built with modular React components, clean controller-service architecture, and pure mathematical recommendation algorithms.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoCompare Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed & Architected for Technical Excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
