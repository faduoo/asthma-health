import React, { useState, useEffect } from 'react';
import CompanyLogo from './CompanyLogo';
import lungsLogo from '../lungs.png';

interface DailyData {
    day: string;
    date: string;
    acitityLevel: number;
    rescueUses: number;
    nighttimeWakeups: number;
    symptomSeverity: 'none' | 'mild' | 'moderate' | 'severe';
    peakFlow: number;
    medicationAdherence: number; // 0-100%
}

export const WeeklyReportPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedMetric, setSelectedMetric] = useState<'rescue' | 'symptoms' | 'peak' | 'adherence'>('rescue');
    const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);

    useEffect(() => {
        // Build weekly data (last 7 days) from localStorage dbData when available
        try {
            const currentUserRaw = localStorage.getItem('currentUser');
            const user = currentUserRaw ? JSON.parse(currentUserRaw) : null;
            const userId = user?.id || 'unknown';

            const dbRaw = localStorage.getItem('dbData');
            const db = dbRaw ? JSON.parse(dbRaw) : {};

            const dailyLogs: any[] = db.dailySymptomLogs || [];
            const actResults: any[] = db.actResults || [];
            const medicationLogs: any[] = db.medicationLogs || [];

            const days: DailyData[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dateKey = d.toISOString().split('T')[0];

                const todayLog = dailyLogs.find(l => l.userId === userId && l.date === dateKey);

                const rescueUses = todayLog ? (todayLog.rescueInhalerUses || 0) : 0;
                const nighttimeWakeups = todayLog ? (todayLog.nighttimeSymptoms ? todayLog.nighttimeSymptoms.length : 0) : 0;
                const peakFlow = todayLog && todayLog.peakFlowReading ? Number(todayLog.peakFlowReading) : 0;

                // Derive symptomSeverity from overallQuality if present (1=worst,5=best)
                let symptomSeverity: DailyData['symptomSeverity'] = 'none';
                if (todayLog && typeof todayLog.overallQuality === 'number') {
                    const q = todayLog.overallQuality;
                    if (q >= 4) symptomSeverity = 'none';
                    else if (q === 3) symptomSeverity = 'mild';
                    else if (q === 2) symptomSeverity = 'moderate';
                    else symptomSeverity = 'severe';
                } else {
                    // fallback: use presence of daytime/nighttime symptoms
                    const daytimeCount = todayLog && todayLog.daytimeSymptoms ? todayLog.daytimeSymptoms.length : 0;
                    const nightCount = todayLog && todayLog.nighttimeSymptoms ? todayLog.nighttimeSymptoms.length : 0;
                    const total = daytimeCount + nightCount;
                    if (total === 0) symptomSeverity = 'none';
                    else if (total <= 2) symptomSeverity = 'mild';
                    else if (total <= 4) symptomSeverity = 'moderate';
                    else symptomSeverity = 'severe';
                }

                // Medication adherence: prefer stored numeric adherence, else infer from medicationLogs
                let medicationAdherence = 100;
                if (todayLog && typeof todayLog.medicationAdherence === 'number') {
                    medicationAdherence = todayLog.medicationAdherence;
                } else if (todayLog && typeof todayLog.medicationAdherence === 'string') {
                    // map string levels to percent
                    const map: any = { excellent: 100, good: 90, fair: 70, poor: 40 };
                    medicationAdherence = map[todayLog.medicationAdherence] || 80;
                } else {
                    // infer: count 'taken' medicationLogs for this user and date
                    const takenLogs = medicationLogs.filter(m => m.userId === userId && m.action === 'taken' && m.timestamp && m.timestamp.startsWith(dateKey));
                    // assume 2 doses expected per day for maintenance; cap at 100%
                    medicationAdherence = Math.min(100, Math.round((takenLogs.length / 2) * 100));
                }

                days.push({
                    day: dayLabel,
                    date: d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
                    acitityLevel: 0,
                    rescueUses,
                    nighttimeWakeups,
                    symptomSeverity,
                    peakFlow,
                    medicationAdherence,
                });
            }

            setWeeklyData(days);
        } catch (e) {
            console.error('Failed to build weekly report data:', e);
        }
    }, []);

    const weeklyStats = {
        totalRescueUses: weeklyData.reduce((sum, d) => sum + d.rescueUses, 0),
        averagePeakFlow: Math.round(weeklyData.reduce((sum, d) => sum + d.peakFlow, 0) / weeklyData.length),
        totalNighttimeWakeups: weeklyData.reduce((sum, d) => sum + d.nighttimeWakeups, 0),
        medicationAdherence: Math.round(weeklyData.reduce((sum, d) => sum + d.medicationAdherence, 0) / weeklyData.length),
        goodDays: weeklyData.filter(d => d.symptomSeverity === 'none').length,
        moderateDays: weeklyData.filter(d => d.symptomSeverity === 'mild').length,
        poorDays: weeklyData.filter(d => d.symptomSeverity === 'moderate' || d.symptomSeverity === 'severe').length,
    };

    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'none': return 'bg-green-100 text-green-800 border-green-300';
            case 'mild': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'moderate': return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'severe': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch(severity) {
            case 'none': return '✓';
            case 'mild': return '⊗';
            case 'moderate': return '⚠';
            case 'severe': return '✕';
            default: return '–';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={onBack}
                            className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                        <div className="flex items-center space-x-3">
                            <CompanyLogo src={lungsLogo} className="h-8 w-8" alt="Asthma Health" />
                            <h1 className="text-2xl font-bold text-slate-900">Weekly Report</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                {/* Week Range & Summary */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Week of November 8-14, 2025</h2>
                        <p className="text-slate-600">Your asthma health summary for this week</p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Rescue Inhaler Uses */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-700">Rescue Inhaler Uses</p>
                                <span className="text-2xl">💨</span>
                            </div>
                            <p className="text-4xl font-bold text-orange-600">{weeklyStats.totalRescueUses}</p>
                            <p className="text-xs text-slate-600 mt-2">times this week</p>
                            <div className="mt-3 flex gap-1">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${d.rescueUses === 0 ? 'bg-green-500' : d.rescueUses === 1 ? 'bg-blue-500' : d.rescueUses === 2 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${(d.rescueUses / 3) * 100}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Peak Flow */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-700">Average Peak Flow</p>
                                <span className="text-2xl">📊</span>
                            </div>
                            <p className="text-4xl font-bold text-blue-600">{weeklyStats.averagePeakFlow}</p>
                            <p className="text-xs text-slate-600 mt-2">L/min (Normal)</p>
                            <div className="mt-3 text-xs text-blue-700 font-semibold">Target: 350-450 L/min</div>
                        </div>

                        {/* Nighttime Wakeups */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-700">Nighttime Wakeups</p>
                                <span className="text-2xl">🌙</span>
                            </div>
                            <p className="text-4xl font-bold text-indigo-600">{weeklyStats.totalNighttimeWakeups}</p>
                            <p className="text-xs text-slate-600 mt-2">nights this week</p>
                            <div className="mt-3 text-xs text-indigo-700 font-semibold">Goal: 0 nights</div>
                        </div>

                        {/* Medication Adherence */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-700">Med Adherence</p>
                                <span className="text-2xl">💊</span>
                            </div>
                            <p className="text-4xl font-bold text-green-600">{weeklyStats.medicationAdherence}%</p>
                            <p className="text-xs text-slate-600 mt-2">consistent dosing</p>
                            <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${weeklyStats.medicationAdherence}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Breakdown */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Daily Breakdown</h2>
                    
                    {/* Metric Selector */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {[
                            { value: 'rescue', label: '💨 Rescue Uses', icon: '💨' },
                            { value: 'symptoms', label: '⚕️ Symptoms', icon: '⚕️' },
                            { value: 'peak', label: '📊 Peak Flow', icon: '📊' },
                            { value: 'adherence', label: '💊 Adherence', icon: '💊' }
                        ].map(metric => (
                            <button
                                key={metric.value}
                                onClick={() => setSelectedMetric(metric.value as any)}
                                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                                    selectedMetric === metric.value
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {metric.label}
                            </button>
                        ))}
                    </div>

                    {/* Daily Chart */}
                    <div className="space-y-4">
                        {selectedMetric === 'rescue' && (
                            <div className="space-y-3">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-bold text-slate-700">{d.day}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-slate-600">{d.rescueUses} uses</span>
                                            </div>
                                            <div className="h-8 bg-slate-200 rounded-lg overflow-hidden flex items-center">
                                                <div 
                                                    className={`h-full transition-all ${d.rescueUses === 0 ? 'bg-green-500' : d.rescueUses <= 1 ? 'bg-blue-500' : d.rescueUses <= 2 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${(d.rescueUses / 3) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedMetric === 'symptoms' && (
                            <div className="space-y-3">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-bold text-slate-700">{d.day}</div>
                                        <div className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold ${getSeverityColor(d.symptomSeverity)}`}>
                                            <span className="text-lg mr-2">{getSeverityIcon(d.symptomSeverity)}</span>
                                            {d.symptomSeverity.charAt(0).toUpperCase() + d.symptomSeverity.slice(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedMetric === 'peak' && (
                            <div className="space-y-3">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-bold text-slate-700">{d.day}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-slate-600">{d.peakFlow} L/min</span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${d.peakFlow >= 350 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                                    {d.peakFlow >= 350 ? 'Normal' : 'Low'}
                                                </span>
                                            </div>
                                            <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
                                                <div 
                                                    className={`h-full ${d.peakFlow >= 380 ? 'bg-green-500' : d.peakFlow >= 360 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${(d.peakFlow / 400) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedMetric === 'adherence' && (
                            <div className="space-y-3">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-bold text-slate-700">{d.day}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-slate-600">{d.medicationAdherence}%</span>
                                            </div>
                                            <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
                                                <div 
                                                    className="h-full bg-green-500 transition-all"
                                                    style={{ width: `${d.medicationAdherence}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Control Summary */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Symptom Control Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl text-green-500">✓</div>
                                <div>
                                    <p className="font-semibold text-slate-900">{weeklyStats.goodDays} Good Days</p>
                                    <p className="text-sm text-slate-600">No symptoms</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl text-blue-500">⊗</div>
                                <div>
                                    <p className="font-semibold text-slate-900">{weeklyStats.moderateDays} Fair Days</p>
                                    <p className="text-sm text-slate-600">Mild symptoms</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl text-amber-500">⚠</div>
                                <div>
                                    <p className="font-semibold text-slate-900">{weeklyStats.poorDays} Difficult Days</p>
                                    <p className="text-sm text-slate-600">Moderate+ symptoms</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="text-sm text-slate-600 mb-3">Overall Control:</p>
                                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                                        style={{ width: `${(weeklyStats.goodDays / 7) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm font-bold text-green-700 mt-2">Well Controlled ({Math.round((weeklyStats.goodDays / 7) * 100)}%)</p>
                            </div>
                        </div>
                    </div>

                    {/* Insights & Recommendations */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Insights & Tips</h3>
                        <div className="space-y-4 text-sm">
                            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                                <p className="font-semibold text-green-900 mb-1">✓ Excellent Adherence</p>
                                <p className="text-green-800">You took all doses on schedule this week. Keep up the great work!</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                                <p className="font-semibold text-blue-900 mb-1">💡 Peak Flow Trend</p>
                                <p className="text-blue-800">Your peak flow is stable and within normal range. This indicates good lung function.</p>
                            </div>
                            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                                <p className="font-semibold text-amber-900 mb-1">⚠ Action Item</p>
                                <p className="text-amber-800">Wednesday had increased symptoms. Review potential triggers (weather, allergens, activity).</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                    <button className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors">
                        📧 Email Report
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        📥 Export PDF
                    </button>
                </div>
            </div>
        </div>
    );
};
