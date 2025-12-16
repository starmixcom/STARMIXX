import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  pulse?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  pulse = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 group isolate";
  
  const variants = {
    primary: "bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-600 text-white shadow-xl shadow-lime-500/30 hover:shadow-lime-500/50 hover:-translate-y-1 border-b-0",
    secondary: "bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800",
    outline: "bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-50"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const pulseClass = pulse ? "animate-pulse-slow" : ""; // Custom pulse logic if needed, or standard

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${pulseClass} ${className}`}
      {...props}
    >
      {/* Shine effect overlay for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
      <span className="relative z-20 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};