import React, { useState, useEffect } from 'react';

interface SymptomEntry {
    id: string;
    symptom: string;
    severity: 1 | 2 | 3 | 4 | 5;
    time: string;
    trigger?: string;
    notes?: string;
}

interface DailySymptomLog {
    id: string;
    date: string;
    daytimeSymptoms: SymptomEntry[];
    nighttimeSymptoms: SymptomEntry[];
    rescueInhalerUses: number;
    peakFlowReading?: number;
    medicationAdherence: 'excellent' | 'good' | 'fair' | 'poor';
    overallQuality: 1 | 2 | 3 | 4 | 5;
    notes?: string;
    createdAt: string;
}

const commonSymptoms = [
    'Shortness of Breath',
    'Chest Tightness',
    'Wheezing',
    'Coughing',
    'Throat Discomfort',
    'Fatigue',
    'Difficulty Sleeping',
    'Rapid Breathing',
    'Anxiety',
    'Weakness',
];

const commonTriggers = [
    'Exercise',
    'Cold Air',
    'Allergens',
    'Stress',
    'Pollution',
    'Weather Change',
    'Pollen',
    'Pet Dander',
    'Dust',
    'Strong Odors',
];

interface DailySymptomLogPageProps {
    onBack: () => void;
}

export const DailySymptomLogPage: React.FC<DailySymptomLogPageProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'daytime' | 'nighttime' | 'summary'>('daytime');
    const [daytimeSymptoms, setDaytimeSymptoms] = useState<SymptomEntry[]>([]);
    const [nighttimeSymptoms, setNighttimeSymptoms] = useState<SymptomEntry[]>([]);
    const [rescueInhalerUses, setRescueInhalerUses] = useState(0);
    const [peakFlowReading, setPeakFlowReading] = useState('');
    const [medicationAdherence, setMedicationAdherence] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
    const [overallQuality, setOverallQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [notes, setNotes] = useState('');
    const [showAddSymptom, setShowAddSymptom] = useState(false);
    const [addingTo, setAddingTo] = useState<'daytime' | 'nighttime'>('daytime');
    const [newSymptom, setNewSymptom] = useState('');
    const [newSeverity, setNewSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [newTime, setNewTime] = useState('');
    const [newTrigger, setNewTrigger] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState('');

    // Load today's log from dbData on mount (use local userId variable to avoid async setState timing)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('currentUser');
            const currentUser = stored ? JSON.parse(stored) : null;
            const localUserId = currentUser?.id || '';
            if (localUserId) setUserId(localUserId);

            const dbDataRaw = localStorage.getItem('dbData');
            if (!dbDataRaw) return;
            const db = JSON.parse(dbDataRaw);

            // Support multiple possible collections but prefer `dailySymptomsLog` (matches db.json)
            const dailyKey = db.dailySymptomsLog ? 'dailySymptomsLog' : (db.dailySymptomLogs ? 'dailySymptomLogs' : (db.dailyLogs ? 'dailyLogs' : null));
            if (!dailyKey) return;

            const today = new Date().toISOString().split('T')[0];

            if (dailyKey === 'dailyLogs') {
                // dailyLogs is a summary table in db.json - find matching entry
                const todaySummary = (db.dailyLogs || []).find((log: any) => String(log.userId) === String(localUserId) && log.date === today);
                if (todaySummary) {
                    setPeakFlowReading(todaySummary.peakFlow?.toString() || '');
                    setNotes(todaySummary.notes || '');
                }
            } else {
                const todayLog = (db[dailyKey] || []).find((log: any) => String(log.userId) === String(localUserId) && log.date === today);
                if (todayLog) {
                    setDaytimeSymptoms(todayLog.daytimeSymptoms || []);
                    setNighttimeSymptoms(todayLog.nighttimeSymptoms || []);
                    setRescueInhalerUses(Number(todayLog.rescueInhalerUses) || 0);
                    setPeakFlowReading((todayLog.peakFlowReading ?? todayLog.peakFlow ?? '')?.toString() || '');
                    setMedicationAdherence(todayLog.medicationAdherence || 'good');
                    setOverallQuality(todayLog.overallQuality || 3);
                    setNotes(todayLog.notes || '');
                }
            }
        } catch (e) {
            console.error('Failed to load symptom log:', e);
        }
        // run once on mount
    }, []);

    const saveLogToDatabase = () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const dbDataRaw = localStorage.getItem('dbData');
            const db = dbDataRaw ? JSON.parse(dbDataRaw) : {};

            // Ensure collection exists and prefer `dailySymptomsLog` (matches db.json)
            if (!db.dailySymptomsLog) db.dailySymptomsLog = db.dailySymptomLogs || [];

            const logIndex = (db.dailySymptomsLog || []).findIndex(
                (log: any) => String(log.date) === today && String(log.userId) === String(userId)
            );

            // Basic validation/normalization
            const normalizedPeak = peakFlowReading ? Math.max(0, Math.min(1500, parseInt(peakFlowReading || '0'))) : undefined;
            const normalizedRescueUses = Math.max(0, Number(rescueInhalerUses || 0));

            const newLog: DailySymptomLog = {
                id: logIndex >= 0 ? db.dailySymptomsLog[logIndex].id : `symptom-${Date.now()}`,
                date: today,
                daytimeSymptoms,
                nighttimeSymptoms,
                rescueInhalerUses: normalizedRescueUses,
                peakFlowReading: normalizedPeak,
                medicationAdherence,
                overallQuality,
                notes,
                createdAt: logIndex >= 0 ? db.dailySymptomsLog[logIndex].createdAt : new Date().toISOString(),
            };

            if (logIndex >= 0) {
                db.dailySymptomsLog[logIndex] = { ...db.dailySymptomsLog[logIndex], ...newLog, userId };
            } else {
                db.dailySymptomsLog.push({ userId, ...newLog });
            }

            // Also update a summary table `dailyLogs` (backwards compatible with db.json)
            if (!db.dailyLogs) db.dailyLogs = [];
            const summaryIndex = db.dailyLogs.findIndex((s: any) => String(s.userId) === String(userId) && s.date === today);
            const summary = {
                id: summaryIndex >= 0 ? db.dailyLogs[summaryIndex].id : Date.now().toString(),
                userId,
                date: today,
                peakFlow: normalizedPeak,
                symptoms: [...new Set([...(daytimeSymptoms || []).map((d:any)=> typeof d==='string'?d:d.symptom), ...(nighttimeSymptoms || []).map((d:any)=> typeof d==='string'?d:d.symptom)])].join(', '),
                triggers: [],
                medicineUsed: [],
                notes,
                createdAt: summaryIndex >= 0 ? db.dailyLogs[summaryIndex].createdAt : new Date().toISOString(),
            };
            if (summaryIndex >= 0) {
                db.dailyLogs[summaryIndex] = { ...db.dailyLogs[summaryIndex], ...summary };
            } else {
                db.dailyLogs.push(summary);
            }

            localStorage.setItem('dbData', JSON.stringify(db));
            setSuccessMessage('✓ Symptoms saved successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            console.log('Symptom log saved:', newLog);
        } catch (e) {
            console.error('Failed to save symptom log:', e);
        }
    };

    // Autosave when relevant fields change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            // only save if we have a user
            try {
                if (userId) saveLogToDatabase();
            } catch (e) {
                console.error('Auto-save failed:', e);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [daytimeSymptoms, nighttimeSymptoms, rescueInhalerUses, peakFlowReading, medicationAdherence, overallQuality, notes, userId]);

    const addSymptom = () => {
        if (!newSymptom || !newTime) return;

        const symptomEntry: SymptomEntry = {
            id: Date.now().toString(),
            symptom: newSymptom,
            severity: newSeverity,
            time: newTime,
            trigger: newTrigger || undefined,
            notes: newNotes || undefined,
        };

        if (addingTo === 'daytime') {
            setDaytimeSymptoms([...daytimeSymptoms, symptomEntry]);
        } else {
            setNighttimeSymptoms([...nighttimeSymptoms, symptomEntry]);
        }

        // Reset form
        setNewSymptom('');
        setNewSeverity(3);
        setNewTime('');
        setNewTrigger('');
        setNewNotes('');
        setShowAddSymptom(false);

        // Auto-save
        setTimeout(saveLogToDatabase, 100);
    };

    const removeSymptom = (id: string, type: 'daytime' | 'nighttime') => {
        if (type === 'daytime') {
            setDaytimeSymptoms(daytimeSymptoms.filter(s => s.id !== id));
        } else {
            setNighttimeSymptoms(nighttimeSymptoms.filter(s => s.id !== id));
        }
        setTimeout(saveLogToDatabase, 100);
    };

    const getSeverityColor = (severity: number) => {
        switch (severity) {
            case 1:
                return 'bg-green-100 text-green-800';
            case 2:
                return 'bg-blue-100 text-blue-800';
            case 3:
                return 'bg-yellow-100 text-yellow-800';
            case 4:
                return 'bg-orange-100 text-orange-800';
            case 5:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const getSeverityLabel = (severity: number) => {
        const labels = ['', 'Minimal', 'Mild', 'Moderate', 'Severe', 'Very Severe'];
        return labels[severity];
    };

    const getQualityColor = (quality: number) => {
        switch (quality) {
            case 1:
                return 'bg-red-100 border-red-300';
            case 2:
                return 'bg-orange-100 border-orange-300';
            case 3:
                return 'bg-yellow-100 border-yellow-300';
            case 4:
                return 'bg-blue-100 border-blue-300';
            case 5:
                return 'bg-green-100 border-green-300';
            default:
                return 'bg-slate-100 border-slate-300';
        }
    };

    const getQualityEmoji = (quality: number) => {
        const emojis = ['', '😩', '😞', '😐', '🙂', '😄'];
        return emojis[quality];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="mb-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">📝 Log Today's Symptoms</h1>
                    <p className="text-slate-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('daytime')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'daytime'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        ☀️ Daytime Symptoms
                    </button>
                    <button
                        onClick={() => setActiveTab('nighttime')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'nighttime'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        🌙 Nighttime Symptoms
                    </button>
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'summary'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        📊 Daily Summary
                    </button>
                </div>

                {/* Daytime Symptoms Tab */}
                {activeTab === 'daytime' && (
                    <div className="space-y-6">
                        {/* Symptoms List */}
                        {daytimeSymptoms.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Logged Symptoms</h2>
                                <div className="space-y-3">
                                    {daytimeSymptoms.map((symptom) => (
                                        <div key={symptom.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-semibold text-slate-900">{symptom.symptom}</span>
                                                    <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                                                        {getSeverityLabel(symptom.severity)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 space-y-1">
                                                    <p>🕐 <strong>Time:</strong> {symptom.time}</p>
                                                    {symptom.trigger && <p>⚡ <strong>Trigger:</strong> {symptom.trigger}</p>}
                                                    {symptom.notes && <p>📌 <strong>Notes:</strong> {symptom.notes}</p>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeSymptom(symptom.id, 'daytime')}
                                                className="ml-4 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add Symptom Form */}
                        {!showAddSymptom ? (
                            <button
                                onClick={() => {
                                    setShowAddSymptom(true);
                                    setAddingTo('daytime');
                                }}
                                className="w-full px-6 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                + Add Daytime Symptom
                            </button>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Add Daytime Symptom</h2>
                                <div className="space-y-4">
                                    {/* Symptom Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Symptom *</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {commonSymptoms.map((sym) => (
                                                <button
                                                    key={sym}
                                                    onClick={() => setNewSymptom(sym)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        newSymptom === sym
                                                            ? 'bg-teal-600 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {sym}
                                                </button>
                                            ))}
                                        </div>
                                        {newSymptom && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    value={newSymptom}
                                                    onChange={(e) => setNewSymptom(e.target.value)}
                                                    placeholder="Or type custom symptom"
                                                    className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
                                        <input
                                            type="time"
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>

                                    {/* Severity */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Severity: <strong>{getSeverityLabel(newSeverity)}</strong></label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setNewSeverity(level as 1 | 2 | 3 | 4 | 5)}
                                                    className={`flex-1 px-3 py-2 rounded-lg font-semibold transition ${
                                                        newSeverity === level
                                                            ? getSeverityColor(level)
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trigger */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Trigger (Optional)</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                                            {commonTriggers.map((trigger) => (
                                                <button
                                                    key={trigger}
                                                    onClick={() => setNewTrigger(newTrigger === trigger ? '' : trigger)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        newTrigger === trigger
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {trigger}
                                                </button>
                                            ))}
                                        </div>
                                        {newTrigger && (
                                            <input
                                                type="text"
                                                value={newTrigger}
                                                onChange={(e) => setNewTrigger(e.target.value)}
                                                placeholder="Or type custom trigger"
                                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                                            />
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                                        <textarea
                                            value={newNotes}
                                            onChange={(e) => setNewNotes(e.target.value)}
                                            placeholder="Any other details about this symptom..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={addSymptom}
                                            disabled={!newSymptom || !newTime}
                                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Add Symptom
                                        </button>
                                        <button
                                            onClick={() => setShowAddSymptom(false)}
                                            className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Nighttime Symptoms Tab */}
                {activeTab === 'nighttime' && (
                    <div className="space-y-6">
                        {nighttimeSymptoms.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Logged Symptoms</h2>
                                <div className="space-y-3">
                                    {nighttimeSymptoms.map((symptom) => (
                                        <div key={symptom.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-semibold text-slate-900">{symptom.symptom}</span>
                                                    <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                                                        {getSeverityLabel(symptom.severity)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 space-y-1">
                                                    <p>🕐 <strong>Time:</strong> {symptom.time}</p>
                                                    {symptom.trigger && <p>⚡ <strong>Trigger:</strong> {symptom.trigger}</p>}
                                                    {symptom.notes && <p>📌 <strong>Notes:</strong> {symptom.notes}</p>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeSymptom(symptom.id, 'nighttime')}
                                                className="ml-4 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!showAddSymptom ? (
                            <button
                                onClick={() => {
                                    setShowAddSymptom(true);
                                    setAddingTo('nighttime');
                                }}
                                className="w-full px-6 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                + Add Nighttime Symptom
                            </button>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Add Nighttime Symptom</h2>
                                <div className="space-y-4">
                                    {/* Symptom Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Symptom *</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {commonSymptoms.map((sym) => (
                                                <button
                                                    key={sym}
                                                    onClick={() => setNewSymptom(sym)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        newSymptom === sym
                                                            ? 'bg-teal-600 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {sym}
                                                </button>
                                            ))}
                                        </div>
                                        {newSymptom && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    value={newSymptom}
                                                    onChange={(e) => setNewSymptom(e.target.value)}
                                                    placeholder="Or type custom symptom"
                                                    className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
                                        <input
                                            type="time"
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>

                                    {/* Severity */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Severity: <strong>{getSeverityLabel(newSeverity)}</strong></label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setNewSeverity(level as 1 | 2 | 3 | 4 | 5)}
                                                    className={`flex-1 px-3 py-2 rounded-lg font-semibold transition ${
                                                        newSeverity === level
                                                            ? getSeverityColor(level)
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trigger */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Trigger (Optional)</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                                            {commonTriggers.map((trigger) => (
                                                <button
                                                    key={trigger}
                                                    onClick={() => setNewTrigger(newTrigger === trigger ? '' : trigger)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        newTrigger === trigger
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {trigger}
                                                </button>
                                            ))}
                                        </div>
                                        {newTrigger && (
                                            <input
                                                type="text"
                                                value={newTrigger}
                                                onChange={(e) => setNewTrigger(e.target.value)}
                                                placeholder="Or type custom trigger"
                                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                                            />
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                                        <textarea
                                            value={newNotes}
                                            onChange={(e) => setNewNotes(e.target.value)}
                                            placeholder="Any other details about this symptom..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={addSymptom}
                                            disabled={!newSymptom || !newTime}
                                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Add Symptom
                                        </button>
                                        <button
                                            onClick={() => setShowAddSymptom(false)}
                                            className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Daily Summary Tab */}
                {activeTab === 'summary' && (
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">Daily Summary</h2>

                        {/* Overall Quality */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                How was your day overall? {getQualityEmoji(overallQuality)}
                            </label>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((quality) => (
                                    <button
                                        key={quality}
                                        onClick={() => setOverallQuality(quality as 1 | 2 | 3 | 4 | 5)}
                                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition border-2 ${
                                            overallQuality === quality
                                                ? `${getQualityColor(quality)} border-current`
                                                : 'bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400'
                                        }`}
                                    >
                                        {getQualityEmoji(quality)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rescue Inhaler Uses */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Rescue Inhaler Uses</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setRescueInhalerUses(Math.max(0, rescueInhalerUses - 1))}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xl font-bold"
                                >
                                    −
                                </button>
                                <div className="text-4xl font-bold text-slate-900 w-20 text-center">{rescueInhalerUses}</div>
                                <button
                                    onClick={() => setRescueInhalerUses(rescueInhalerUses + 1)}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Peak Flow */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Peak Flow Reading (Optional)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={peakFlowReading}
                                    onChange={(e) => setPeakFlowReading(e.target.value)}
                                    placeholder="Enter peak flow value (L/min)"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                                />
                                <span className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 font-medium">L/min</span>
                            </div>
                        </div>

                        {/* Medication Adherence */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Medication Adherence</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {(['excellent', 'good', 'fair', 'poor'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setMedicationAdherence(level)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                                            medicationAdherence === level
                                                ? 'bg-teal-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any additional notes about your asthma management today..."
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-blue-600">{daytimeSymptoms.length}</div>
                                <div className="text-sm text-blue-700">Daytime Symptoms</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">{nighttimeSymptoms.length}</div>
                                <div className="text-sm text-purple-700">Nighttime Symptoms</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-orange-600">{rescueInhalerUses}</div>
                                <div className="text-sm text-orange-700">Rescue Uses</div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={saveLogToDatabase}
                            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                        >
                            💾 Save Daily Log
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
