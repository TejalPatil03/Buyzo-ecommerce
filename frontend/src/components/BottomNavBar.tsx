import React from 'react';
import { AppView } from '../types';

interface BottomNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-50 h-[72px] shadow-[0px_-4px_12px_rgba(37,99,235,0.08)] bg-[#f8f9ff] pb-safe flex justify-around items-center md:hidden border-t border-[#c3c6d7]/30"
    >
      {/* Home Tab */}
      <button
        id="bottom-nav-home"
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-200 w-16 h-full cursor-pointer ${
          currentView === 'home' ? 'text-[#004ac6] font-bold' : 'text-[#434655] hover:bg-[#eff4ff]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] mb-1 ${
            currentView === 'home' ? 'fill' : ''
          }`}
        >
          home
        </span>
        <span className="font-['Inter'] text-[10px] font-semibold">Home</span>
      </button>

      {/* Categories / Search Tab */}
      <button
        id="bottom-nav-search"
        onClick={() => setCurrentView('search')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-200 w-16 h-full cursor-pointer ${
          currentView === 'search' ? 'text-[#004ac6] font-bold' : 'text-[#434655] hover:bg-[#eff4ff]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] mb-1 ${
            currentView === 'search' ? 'fill' : ''
          }`}
        >
          search
        </span>
        <span className="font-['Inter'] text-[10px] font-semibold">Search</span>
      </button>

      {/* Center AI Assistant Bubble */}
      <button
        id="bottom-nav-assistant"
        onClick={() => setCurrentView('assistant')}
        className="flex flex-col items-center justify-center transition-all active:scale-95 duration-200 w-16 h-full relative -top-3 cursor-pointer group"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
            currentView === 'assistant'
              ? 'bg-[#004ac6] text-white ring-4 ring-[#dce9ff] scale-105'
              : 'bg-[#004ac6] text-white group-hover:bg-[#2563eb]'
          }`}
        >
          <span className="material-symbols-outlined text-[28px] fill">auto_awesome</span>
        </div>
        <span
          className={`font-['Inter'] text-[10px] font-semibold mt-1 ${
            currentView === 'assistant' ? 'text-[#004ac6]' : 'text-[#434655]'
          }`}
        >
          Assistant
        </span>
      </button>

      {/* Orders Tab */}
      <button
        id="bottom-nav-orders"
        onClick={() => setCurrentView('orders')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-200 w-16 h-full cursor-pointer ${
          currentView === 'orders' || currentView === 'order-detail'
            ? 'text-[#004ac6] font-bold'
            : 'text-[#434655] hover:bg-[#eff4ff]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] mb-1 ${
            currentView === 'orders' || currentView === 'order-detail' ? 'fill' : ''
          }`}
        >
          receipt_long
        </span>
        <span className="font-['Inter'] text-[10px] font-semibold">Orders</span>
      </button>

      {/* Profile Tab */}
      <button
        id="bottom-nav-profile"
        onClick={() => setCurrentView('profile')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-200 w-16 h-full cursor-pointer ${
          currentView === 'profile' ? 'text-[#004ac6] font-bold' : 'text-[#434655] hover:bg-[#eff4ff]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] mb-1 ${
            currentView === 'profile' ? 'fill' : ''
          }`}
        >
          person
        </span>
        <span className="font-['Inter'] text-[10px] font-semibold">Profile</span>
      </button>
    </nav>
  );
};
