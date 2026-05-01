import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const MobileMenu = ({ children, title, icon: Icon, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-transparent">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-brand-900/80 border-b border-brand-700/50 p-4 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={24} className="text-accent-gold" />}
          <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-brand-800 rounded-lg transition text-brand-300 hover:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-950/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative md:flex w-64 md:w-72 h-[calc(100vh-64px)] md:h-screen bg-brand-900/60 backdrop-blur-sm border-r border-brand-700/50 p-4 md:p-8 flex flex-col shadow-md z-40 overflow-y-auto transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {children({ closeMenu: () => setIsOpen(false) })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden md:flex md:flex-col" />
    </div>
  );
};

export default MobileMenu;
