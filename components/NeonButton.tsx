import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ label, isLoading, className = '', ...props }) => {
  return (
    <button
      className={`
        relative overflow-hidden group
        w-full py-4 px-6
        bg-black border border-[#00ff41]
        text-[#00ff41] font-bold text-xl tracking-widest
        uppercase
        transition-all duration-300 ease-in-out
        hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_#00ff41]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-3">
        {isLoading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading ? 'ANALYZING...' : label}
      </span>
      
      {/* Glitch effect overlay on hover could go here, keeping it simple for now */}
    </button>
  );
};