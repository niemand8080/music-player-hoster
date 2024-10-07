"use client";
import { Check, X } from 'lucide-react';
import React from 'react';

interface ToggleSwitchProps {
  title?: string,
  children?: React.ReactNode,
  state: boolean,
  onClick?: () => void,
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ title, children, state, onClick }) => {
  return (
    <button 
      title={title}
      onClick={() => onClick && onClick()}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        state ? 'bg-indigo-600' : 'bg-gray-700'
      }`}
    >
      <span 
        className={`absolute inset-y-0.5 left-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
          state ? 'transform translate-x-5 rotate-[360deg]' : ''
        }`}
      >
        {children ? children : (
          <>
            <Check size={16} className={`${!state && "opacity-0"} text-indigo-600 transition-all absolute`} />
            <X size={16} className={`${state && "opacity-0"} text-gray-600 transition-all absolute`} />
          </>
        )}
      </span>
    </button>
  )
};

export default ToggleSwitch