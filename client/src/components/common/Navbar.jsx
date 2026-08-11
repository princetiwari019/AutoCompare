import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Bike, Scale, Sparkles, SlidersHorizontal, Menu, X, Layers, ShieldCheck, Bot } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const location = useLocation();
  const { selectedIds } = useCompare();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: null },
    { path: '/cars', label: 'Cars', icon: Car },
    { path: '/bikes', label: 'Bikes', icon: Bike },
    { path: '/vehicles', label: 'Catalog', icon: Layers },
    { path: '/budget-finder', label: 'Budget Explorer', icon: SlidersHorizontal },
    { path: '/recommend', label: 'Smart Match', icon: Sparkles, badge: 'Score' },
    { path: '/ai-advisor', label: 'AI Advisor', icon: Bot, badge: 'Hinglish' },
    { path: '/compare', label: 'Compare', icon: Scale, count: selectedIds.length },
    { path: '/admin', label: 'Admin Portal', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              Auto<span className="text-cyan-400">Compare</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 -mt-1">
              Cars & Bikes Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />}
                <span>{link.label}</span>

                {link.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-cyan-500 text-slate-950 rounded-full animate-pulse">
                    {link.count}
                  </span>
                )}

                {link.badge && !active && (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Theme Selector Widget */}
          <div className="ml-2 pl-2 border-l border-slate-800">
            <ThemeSelector />
          </div>
        </nav>

        {/* Mobile Menu Toggle & Theme Selector */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSelector />
          
          {selectedIds.length > 0 && (
            <Link
              to="/compare"
              className="px-2.5 py-1.5 text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{selectedIds.length}</span>
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                  active
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{link.label}</span>
                </div>
                {link.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-full">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
