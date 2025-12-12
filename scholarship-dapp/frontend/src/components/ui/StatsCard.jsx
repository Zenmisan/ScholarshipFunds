import React from 'react';

// You will likely use an icon library, but we keep the placeholders for now.
const EthIcon = () => (<span className="text-xl font-bold">Ξ</span>);
const StudentsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const StatCard = ({ title, value, unit, iconType, statusComponent }) => {
    
    let icon;
    let iconBg = 'bg-gray-50';
    let iconText = 'text-gray-600';

    if (iconType === 'ETH') {
        icon = <EthIcon />;
        iconBg = 'bg-blue-50';
        iconText = 'text-blue-600';
    } else if (iconType === 'STUDENTS') {
        icon = <StudentsIcon />;
        iconBg = 'bg-purple-50';
        iconText = 'text-purple-600';
    } else {
        // Fallback for custom icons (like the Status Card)
        icon = iconType;
    }

    // Determine the main value display
    const valueDisplay = statusComponent ? statusComponent : (
        <p className="text-4xl font-extrabold text-gray-900 mt-1">
            {value} <span className="text-lg text-gray-400 font-normal">{unit}</span>
        </p>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between transition-shadow hover:shadow-2xl">
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                {valueDisplay}
            </div>
            <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center text-xl font-bold ${iconText}`}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;