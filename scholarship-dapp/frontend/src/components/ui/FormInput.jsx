import React from 'react';

const FormInput = ({ label, placeholder, value, onChange, type = "text", step = "", required = true, isMono = false }) => {

    const monoClass = isMono ? 'font-mono text-sm' : '';

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                type={type}
                step={step}
                className={`w-full border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all duration-200 text-gray-800 ${monoClass}`} 
                required={required} 
            />
        </div>
    );
};

export default FormInput;