import React from 'react';

const baseStyles = "relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg";

const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200/50",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/50",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200/50",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/50",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200/50",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner hover:!translate-y-0",
    
    // For your Connect Wallet button on the dark background
    glass: "bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 backdrop-blur-md text-white shadow-none hover:shadow-purple-500/25 !rounded-full !py-2 !px-6",
};

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
    
    const styleClass = disabled ? variants.disabled : variants[variant] || variants.primary;
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${styleClass} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;