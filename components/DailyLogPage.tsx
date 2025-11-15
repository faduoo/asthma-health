import React, { useState } from 'react';

export const DailyLogPage: React.FC = () => {
    const [wheezing, setWheezing] = useState(0);
    const [shortnessOfBreath, setShortnessOfBreath] = useState(0);
    const [peakFlow, setPeakFlow] = useState('');
    const [inhalerUses, setInhalerUses] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const symptomLevels = ['None', 'Mild', 'Moderate', 'Severe'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would send data to the backend.
        console.log({
            wheezing: symptomLevels[wheezing],
            shortnessOfBreath: symptomLevels[shortnessOfBreath],
            peakFlow,
            inhalerUses
        });
        
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto">
             <h1 className="text-3xl font-bold text-gray-800 mb-6">Log Your Daily Symptoms</h1>
             <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 space-y-8">
                
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                        Wheezing or Coughing
                    </label>
                    <div className="w-full">
                        <input
                            type="range"
                            min="0"
                            max="3"
                            value={wheezing}
                            onChange={(e) => setWheezing(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="flex justify-between text-xs text-gray-500 mt-2">
                            {symptomLevels.map((label, index) => <span key={index}>{label}</span>)}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                        Shortness of Breath
                    </label>
                    <div className="w-full">
                        <input
                            type="range"
                            min="0"
                            max="3"
                            value={shortnessOfBreath}
                            onChange={(e) => setShortnessOfBreath(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="flex justify-between text-xs text-gray-500 mt-2">
                             {symptomLevels.map((label, index) => <span key={index}>{label}</span>)}
                        </div>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="peakFlow" className="block text-lg font-medium text-gray-700 mb-2">
                            Peak Flow Reading
                        </label>
                        <div className="relative">
                           <input
                                id="peakFlow"
                                type="number"
                                value={peakFlow}
                                onChange={(e) => setPeakFlow(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 450"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">L/min</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="inhalerUses" className="block text-lg font-medium text-gray-700 mb-2">
                            Rescue Inhaler Uses
                        </label>
                         <input
                            id="inhalerUses"
                            type="number"
                            value={inhalerUses}
                            onChange={(e) => setInhalerUses(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 2"
                        />
                    </div>
                 </div>

                <div>
                    <button
                        type="submit"
                        disabled={submitted}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-green-500 transition-colors"
                    >
                       {submitted ? 'Log Submitted!' : 'Submit Today\'s Log'}
                    </button>
                </div>

             </form>
        </div>
    );
};
