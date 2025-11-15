import React from 'react';

interface StatusCardProps {
    title: string;
    value: string;
    unit?: string;
    icon: React.ReactElement;
    color: 'red' | 'yellow' | 'blue' | 'green';
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, unit, icon, color }) => {
    const colors = {
        red: { text: 'text-red-700', iconBg: 'bg-red-50', iconText: 'text-red-600' },
        yellow: { text: 'text-amber-700', iconBg: 'bg-amber-50', iconText: 'text-amber-600' },
        blue: { text: 'text-sky-700', iconBg: 'bg-sky-50', iconText: 'text-sky-600' },
        green: { text: 'text-emerald-700', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
    };
    const selectedColor = colors[color] || colors.blue;

    return (
        <div className={`p-5 rounded-2xl shadow-md border border-slate-100 bg-white`}> 
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    <div className="flex items-baseline mt-2">
                        <p className={`text-3xl font-extrabold ${selectedColor.text}`}>{value}</p>
                        {unit && <p className="text-sm text-slate-500 ml-2">{unit}</p>}
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${selectedColor.iconBg} ${selectedColor.iconText} shadow-sm`}> 
                    {icon}
                </div>
            </div>
        </div>
    );
};