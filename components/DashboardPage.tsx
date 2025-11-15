import React, { useEffect, useState } from 'react';
import { StatusCard } from './StatusCard';
import CompanyLogo from './CompanyLogo';
import { ExpertDoctorsPage } from './ExpertDoctorsPage';
import { AsthmaControlTestPage } from './AsthmaControlTestPage';
import { WeeklyReportPage } from './WeeklyReportPage';
import { RecordsPage } from './RecordsPage';
import { UserDetailsEditPage } from './UserDetailsEditPage';
import { ExerciseMeditationPage } from './ExerciseMeditationPage';
import { DailySymptomLogPage } from './DailySymptomLogPage';
import { RefillModal } from './RefillModal';
import { MedicineTracker } from './MedicineTracker';
import lungsLogo from '../lungs.png';

export const DashboardPage: React.FC = () => {
    const [name, setName] = useState('Alex');
    const [userId, setUserId] = useState('');
    const [dob, setDob] = useState<string | null>(null);
    const [showSymptomTracker, setShowSymptomTracker] = useState(false);
    const [showDoctorsPage, setShowDoctorsPage] = useState(false);
    const [showACTPage, setShowACTPage] = useState(false);
    const [showWeeklyReport, setShowWeeklyReport] = useState(false);
    const [showRecordsPage, setShowRecordsPage] = useState(false);
    const [showUserDetailsPage, setShowUserDetailsPage] = useState(false);
    const [showExerciseMeditationPage, setShowExerciseMeditationPage] = useState(false);
    const [showDailySymptomLogPage, setShowDailySymptomLogPage] = useState(false);
    const [showRefillModal, setShowRefillModal] = useState(false);
    const [selectedInhalerForRefill, setSelectedInhalerForRefill] = useState<any>(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    
    interface QuickLog {
        id: string;
        userId?: string;
        symptom: string;
        severity: 'Mild' | 'Moderate' | 'Severe';
        createdAt: string;
        resolved?: boolean;
        notes?: string;
    }

    const [quickLogs, setQuickLogs] = useState<QuickLog[]>([]);
    const [newQuickSymptom, setNewQuickSymptom] = useState('');
    const [newQuickSeverity, setNewQuickSeverity] = useState<'Mild'|'Moderate'|'Severe'>('Mild');
    const [newQuickNotes, setNewQuickNotes] = useState('');
    const [exerciseSessionsCount, setExerciseSessionsCount] = useState<number>(0);
    const [latestACTScore, setLatestACTScore] = useState<{ score: number; controlLevel: string; date: string } | null>(null);
    const [daytimeSymptoms, setDaytimeSymptoms] = useState<string[]>([]);
    const [nighttimeSymptoms, setNighttimeSymptoms] = useState<string[]>([]);
    const [rescueInhalerUses, setRescueInhalerUses] = useState(2);
    const [inhalers, setInhalers] = useState([
        { id: 1, name: 'Albuterol (Rescue)', dosesLeft: 85, refillDate: '2025-02-15', expiryDate: '2025-12-31', status: 'good' },
        { id: 2, name: 'Fluticasone (Maintenance)', dosesLeft: 45, refillDate: '2025-03-10', expiryDate: '2026-01-15', status: 'caution' },
    ]);
    const [symptoms, setSymptoms] = useState([
        { id: 1, name: 'Shortness of Breath', severity: 'moderate', timestamp: '2 hours ago', solution: 'Use rescue inhaler and rest in a cool area. Avoid strenuous activities.' },
        { id: 2, name: 'Chest Tightness', severity: 'mild', timestamp: '4 hours ago', solution: 'Deep breathing exercises recommended. Monitor for worsening symptoms.' },
        { id: 3, name: 'Wheezing', severity: 'mild', timestamp: '6 hours ago', solution: 'Take maintenance inhaler as scheduled. Increase fluid intake.' },
    ]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                const user = JSON.parse(stored);
                if (user && user.name) setName(user.name);
                if (user && user.id) setUserId(user.id);
                if (user && (user.dateOfBirth || user.dob)) setDob(user.dateOfBirth || user.dob);
            }

            // Load completed exercise sessions count for banner
            try {
                const completedRaw = localStorage.getItem('completedExerciseSessions');
                if (completedRaw) {
                    const completed = JSON.parse(completedRaw) as any[];
                    setExerciseSessionsCount(completed.length || 0);
                }
            } catch (e) {
                console.error('Failed to load completedExerciseSessions:', e);
            }

            // Load ACT results from db.json via localStorage
            const dbData = localStorage.getItem('dbData');
            if (dbData) {
                const db = JSON.parse(dbData);
                if (db.actResults && db.actResults.length > 0) {
                    const userACT = db.actResults.filter((r: any) => r.userId === userId);
                    if (userACT.length > 0) {
                        const latest = userACT[userACT.length - 1];
                        setLatestACTScore({
                            score: latest.score,
                            controlLevel: latest.controlLevel,
                            date: new Date(latest.date).toLocaleDateString()
                        });
                    }
                }

                // Load daily symptoms from db.json
                if (db.dailySymptomsLog && db.dailySymptomsLog.length > 0) {
                    const today = new Date().toISOString().split('T')[0];
                    const todayLog = db.dailySymptomsLog.find((log: any) => log.userId === userId && log.date === today);
                    if (todayLog) {
                        setDaytimeSymptoms(todayLog.daytimeSymptoms || []);
                        setNighttimeSymptoms(todayLog.nighttimeSymptoms || []);
                        setRescueInhalerUses(todayLog.rescueInhalerUses || 0);
                    }
                }

                // Load notifications (messages + refill requests)
                try {
                    const msgs = (db.messages || []).filter((m: any) => String(m.userId) === String(userId));
                    const refills = (db.refillRequests || []).filter((r: any) => String(r.userId) === String(userId));
                    const notifList: any[] = [];
                    msgs.forEach((m: any) => notifList.push({ id: `msg-${m.id}`, type: 'message', text: m.text, timestamp: m.timestamp || m.createdAt, read: !!m.read }));
                    refills.forEach((r: any) => notifList.push({ id: `refill-${r.id}`, type: 'refill', text: `Refill request for ${r.inhalerName || ''}`, timestamp: r.createdAt, status: r.status || 'pending', read: r.status !== 'pending' }));
                    notifList.sort((a,b)=> new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    setNotifications(notifList);
                    const unread = notifList.filter(n => !n.read).length;
                    setUnreadCount(unread);
                } catch (e) {
                    // ignore
                }

                // Load quick logs for this user (if present)
                try {
                    const q = (db.quickLogs || []).filter((qq: any) => String(qq.userId) === String(userId));
                    if (q.length) setQuickLogs(q.slice().reverse());
                } catch (e) {
                    // ignore
                }
            }
        } catch (e) {
            // ignore parse errors
        }
    }, [userId]);

    const computeAgeYears = (dateString?: string | null) => {
        if (!dateString) return null;
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return null;
            const now = new Date();
            let years = now.getFullYear() - d.getFullYear();
            const m = now.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < d.getDate())) years--;
            return years;
        } catch (e) {
            return null;
        }
    };
    
    // Icons as React Components
    const AqiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 003 0m0 0V14m0-2.5v-6a1.5 1.5 0 013 0m0 0V14m0-2.5v-6a1.5 1.5 0 00-3 0m-3-6a1.5 1.5 0 00-3 0v6a1.5 1.5 0 003 0m6 0v6a1.5 1.5 0 003 0m0 0v-6a1.5 1.5 0 00-3 0" /></svg>;
    const PollenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>; // Simple representation
    const PeakFlowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    const InhalerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>; // Abstract representation
    const RefillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
    const ExpiryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    const SymptomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const SolutionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    
    // Save daily symptoms to db.json
    const saveDailySymptomsToDb = () => {
        try {
            const dbData = JSON.parse(localStorage.getItem('dbData') || '{}');
            const today = new Date().toISOString().split('T')[0];
            const logIndex = dbData.dailySymptomsLog?.findIndex((log: any) => log.userId === userId && log.date === today) ?? -1;

            const newLog = {
                id: `symptom-${Date.now()}`,
                userId: userId,
                date: today,
                daytimeSymptoms: daytimeSymptoms,
                nighttimeSymptoms: nighttimeSymptoms,
                rescueInhalerUses: rescueInhalerUses,
                createdAt: new Date().toISOString()
            };

            if (!dbData.dailySymptomsLog) dbData.dailySymptomsLog = [];
            
            if (logIndex >= 0) {
                dbData.dailySymptomsLog[logIndex] = newLog;
            } else {
                dbData.dailySymptomsLog.push(newLog);
            }

            localStorage.setItem('dbData', JSON.stringify(dbData));
            console.log('Daily symptoms saved:', newLog);
        } catch (e) {
            console.error('Failed to save symptoms:', e);
        }
    };

    const handleDaytimeToggle = (symptom: string) => {
        if (daytimeSymptoms.includes(symptom)) {
            setDaytimeSymptoms(daytimeSymptoms.filter(s => s !== symptom));
        } else {
            setDaytimeSymptoms([...daytimeSymptoms, symptom]);
        }
        // Auto-save after toggle
        setTimeout(saveDailySymptomsToDb, 100);
    };

    const handleNighttimeToggle = (symptom: string) => {
        if (nighttimeSymptoms.includes(symptom)) {
            setNighttimeSymptoms(nighttimeSymptoms.filter(s => s !== symptom));
        } else {
            setNighttimeSymptoms([...nighttimeSymptoms, symptom]);
        }
        // Auto-save after toggle
        setTimeout(saveDailySymptomsToDb, 100);
    };

    // Quick Log persistence helpers
    const saveQuickLogToDb = (entry: QuickLog) => {
        try {
            const dbRaw = localStorage.getItem('dbData');
            const db = dbRaw ? JSON.parse(dbRaw) : {};
            if (!db.quickLogs) db.quickLogs = [];
            db.quickLogs.push({ ...entry, userId });
            localStorage.setItem('dbData', JSON.stringify(db));
        } catch (e) {
            console.error('Failed to save quick log', e);
        }
    };

    const addQuickLog = () => {
        if (!newQuickSymptom.trim()) return;
        const entry: QuickLog = {
            id: Date.now().toString(),
            userId,
            symptom: newQuickSymptom.trim(),
            severity: newQuickSeverity,
            notes: newQuickNotes.trim() || undefined,
            createdAt: new Date().toISOString(),
            resolved: false,
        };
        setQuickLogs(prev => [entry, ...prev].slice(0, 50));
        saveQuickLogToDb(entry);
        setNewQuickSymptom('');
        setNewQuickSeverity('Mild');
        setNewQuickNotes('');
        setShowSymptomTracker(false);
    };

    const toggleResolveQuickLog = (id: string) => {
        setQuickLogs(prev => prev.map(q => q.id === id ? { ...q, resolved: !q.resolved } : q));
        try {
            const dbRaw = localStorage.getItem('dbData');
            const db = dbRaw ? JSON.parse(dbRaw) : {};
            const idx = (db.quickLogs || []).findIndex((x:any)=>String(x.id)===String(id));
            if (idx>=0) db.quickLogs[idx].resolved = !db.quickLogs[idx].resolved;
            localStorage.setItem('dbData', JSON.stringify(db));
        } catch (e) { console.error(e); }
    };

    const deleteQuickLog = (id: string) => {
        setQuickLogs(prev => prev.filter(q => q.id !== id));
        try {
            const dbRaw = localStorage.getItem('dbData');
            const db = dbRaw ? JSON.parse(dbRaw) : {};
            db.quickLogs = (db.quickLogs || []).filter((x:any)=>String(x.id)!==String(id));
            localStorage.setItem('dbData', JSON.stringify(db));
        } catch (e) { console.error(e); }
    };
    
    if (showDoctorsPage) {
        return <ExpertDoctorsPage onBack={() => setShowDoctorsPage(false)} />;
    }

    if (showACTPage) {
        return <AsthmaControlTestPage onBack={() => setShowACTPage(false)} />;
    }

    if (showWeeklyReport) {
        return <WeeklyReportPage onBack={() => setShowWeeklyReport(false)} />;
    }

    if (showRecordsPage) {
        return <RecordsPage onBack={() => setShowRecordsPage(false)} />;
    }

    if (showUserDetailsPage) {
        return <UserDetailsEditPage onBack={() => setShowUserDetailsPage(false)} />;
    }

    if (showExerciseMeditationPage) {
        return <ExerciseMeditationPage onBack={() => setShowExerciseMeditationPage(false)} />;
    }

    if (showDailySymptomLogPage) {
        return <DailySymptomLogPage onBack={() => setShowDailySymptomLogPage(false)} />;
    }

    if (showRefillModal) {
        return <RefillModal inhaler={selectedInhalerForRefill} userId={userId} onClose={() => { setShowRefillModal(false); setSelectedInhalerForRefill(null); }} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50">
            {/* Top Header - Patient Info & Quick Actions */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg">
                                <CompanyLogo src={lungsLogo} className="h-8 w-8" alt="Asthma Health" />
                                <div>
                                    <p className="text-sm font-semibold">{name}</p>
                                    <p className="text-xs text-white/80">Patient ID: ASM-2025-001</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 relative">
                                    🔔
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unreadCount}</span>
                                    )}
                                </button>
                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                                        <div className="p-3 border-b border-slate-100 font-semibold">Notifications</div>
                                        <div className="max-h-64 overflow-auto p-3 space-y-2">
                                            {notifications.length === 0 ? (
                                                <div className="text-xs text-slate-500">No notifications</div>
                                            ) : (
                                                notifications.slice(0,8).map(n => (
                                                    <div key={n.id} className={`p-2 rounded-md ${n.read ? 'bg-white' : 'bg-slate-50'}`}>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="text-sm font-semibold text-slate-800">{n.type === 'message' ? 'Message' : 'Refill Request'}</div>
                                                                <div className="text-xs text-slate-500">{new Date(n.timestamp).toLocaleString()}</div>
                                                            </div>
                                                            <div className="text-xs text-slate-400">{n.read ? '' : '●'}</div>
                                                        </div>
                                                        <div className="mt-1 text-sm text-slate-700">{n.text}</div>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            {!n.read && <button onClick={() => {
                                                                // mark read in local state and persist
                                                                try {
                                                                    const dbRaw = localStorage.getItem('dbData');
                                                                    const db = dbRaw ? JSON.parse(dbRaw) : {};
                                                                    if (n.type === 'message') {
                                                                        const id = n.id.replace('msg-','');
                                                                        const msg = (db.messages || []).find((m:any)=>String(m.id)===String(id));
                                                                        if (msg) msg.read = true;
                                                                    } else if (n.type === 'refill') {
                                                                        const id = n.id.replace('refill-','');
                                                                        const req = (db.refillRequests || []).find((r:any)=>String(r.id)===String(id));
                                                                        if (req) req.status = req.status || 'pending'; // keep status, but mark read via a flag
                                                                        // add a read flag
                                                                        if (req) req._read = true;
                                                                    }
                                                                    localStorage.setItem('dbData', JSON.stringify(db));
                                                                } catch (e) { console.error(e); }
                                                                setNotifications(prev => prev.map(p => p.id === n.id ? { ...p, read: true } : p));
                                                                setUnreadCount(c => Math.max(0, c-1));
                                                            }} className="px-2 py-1 text-xs rounded bg-slate-100">Mark read</button>}
                                                            {n.type === 'refill' && <button onClick={()=>{
                                                                // open refill modal for that request's inhaler if possible
                                                                try {
                                                                    const id = n.id.replace('refill-','');
                                                                    const dbRaw = localStorage.getItem('dbData');
                                                                    const db = dbRaw ? JSON.parse(dbRaw) : {};
                                                                    const req = (db.refillRequests || []).find((r:any)=>String(r.id)===String(id));
                                                                    if (req) {
                                                                        setSelectedInhalerForRefill({ id: req.inhalerId, name: req.inhalerName });
                                                                        setShowRefillModal(true);
                                                                        setNotificationsOpen(false);
                                                                    }
                                                                } catch (e) { console.error(e); }
                                                            }} className="px-2 py-1 text-xs rounded bg-teal-600 text-white">View</button>}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-slate-100 text-right">
                                            <button onClick={() => { setNotifications([]); setUnreadCount(0); const dbRaw = localStorage.getItem('dbData'); const db = dbRaw ? JSON.parse(dbRaw) : {}; if (db.messages) db.messages.forEach((m:any)=>{ if (String(m.userId)===String(userId)) m.read = true}); if (db.refillRequests) db.refillRequests.forEach((r:any)=>{ if (String(r.userId)===String(userId)) r._read = true}); localStorage.setItem('dbData', JSON.stringify(db)); }} className="text-xs text-slate-600">Mark all read</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => setShowDoctorsPage(true)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                            >
                                📞 Call Doctors
                            </button>
                            <button 
                                onClick={() => setShowWeeklyReport(true)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                            >
                                📊 Report
                            </button>
                            <button 
                                onClick={() => setShowRecordsPage(true)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                            >
                                📋 Records
                            </button>
                            <button 
                                onClick={() => setShowUserDetailsPage(true)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                            >
                                👤 Profile
                            </button>
                            <button 
                                onClick={() => setShowExerciseMeditationPage(true)}
                                className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
                            >
                                🏋️ Exercise
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Clinical Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                                <p className="text-sm text-slate-600">Patient ID: ASM-2025-001</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Last Visit</p>
                            <p className="text-sm font-bold text-slate-800">November 13, 2025</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                        <div className="text-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Date of Birth</p>
                            <p className="text-slate-900 font-semibold mt-1">
                                {dob ? (
                                    (() => {
                                        const age = computeAgeYears(dob);
                                        try {
                                            const d = new Date(dob);
                                            const dateStr = isNaN(d.getTime()) ? dob : d.toLocaleDateString();
                                            return `${dateStr}${age !== null ? ` • ${age} years` : ''}`;
                                        } catch (e) {
                                            return dob;
                                        }
                                    })()
                                ) : (
                                    'Not set'
                                )}
                            </p>
                        </div>
                        <div className="text-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Asthma Type</p>
                            <p className="text-slate-900 font-semibold mt-1">Persistent</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Severity Level</p>
                            <p className="text-amber-700 font-semibold mt-1">Moderate</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Last Assessment</p>
                            <p className="text-green-700 font-semibold mt-1">Stable</p>
                        </div>
                    </div>
                </div>

                    {/* Exercise Banner (prominent CTA) */}
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl p-6 flex items-center justify-between shadow-lg">
                        <div>
                            <h2 className="text-2xl font-bold">Exercise & Meditation</h2>
                            <p className="text-sm opacity-90 mt-1">Guided breathing, gentle yoga, and low-impact exercise to help manage asthma symptoms.</p>
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => setShowExerciseMeditationPage(true)} className="px-6 py-3 bg-white text-teal-600 rounded-lg font-bold hover:bg-white/90">Start Session</button>
                                <button onClick={() => setShowExerciseMeditationPage(true)} className="px-4 py-3 border border-white/30 text-white rounded-lg">Explore Library</button>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm opacity-90">Sessions Completed</div>
                            <div className="text-4xl font-bold mt-2">{exerciseSessionsCount}</div>
                        </div>
                    </div>

                    {/* Clinical Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-700 uppercase">Asthma Control</h3>
                            <span className="text-2xl">✓</span>
                        </div>
                        <p className="text-2xl font-black text-emerald-700">Good</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-2">Symptoms well managed</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-700 uppercase">FEV1 Score</h3>
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-2xl font-black text-blue-700">84%</p>
                        <p className="text-xs text-blue-600 font-semibold mt-2">Normal lung function</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-700 uppercase">Rescue Uses</h3>
                            <span className="text-2xl">💊</span>
                        </div>
                        <p className="text-2xl font-black text-amber-700">1</p>
                        <p className="text-xs text-amber-600 font-semibold mt-2">In last 24 hours</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-700 uppercase">Compliance</h3>
                            <span className="text-2xl">📋</span>
                        </div>
                        <p className="text-2xl font-black text-purple-700">95%</p>
                        <p className="text-xs text-purple-600 font-semibold mt-2">Excellent adherence</p>
                    </div>
                </div>

                {/* Primary Section: Asthma Control Test & Symptom Tracking */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 px-6 py-5">
                        <h2 className="text-2xl font-bold text-white">Your Asthma Control</h2>
                        <p className="text-sm text-slate-300 mt-1">Track your daily symptoms and manage your condition effectively</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Asthma Control Test (ACT) Score */}
                        {/*
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Asthma Control Test (ACT)</h3>
                                    <p className="text-sm text-slate-600 mt-1">{latestACTScore ? `Last taken: ${latestACTScore.date}` : 'Based on your last assessment'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black text-blue-700">{latestACTScore?.score || 22}</p>
                                    <p className="text-xs text-blue-600 font-semibold mt-1">/25 Points</p>
                                </div>
                            </div>
                            <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-gradient-to-r from-green-500 to-blue-600" style={{ width: `${((latestACTScore?.score || 22) / 25) * 100}%` }}></div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">{latestACTScore?.controlLevel === 'Well Controlled' ? '✓' : latestACTScore?.controlLevel === 'Not Well Controlled' ? '⚠' : '✕'}</span>
                                <p className={`text-sm font-semibold ${latestACTScore?.controlLevel === 'Well Controlled' ? 'text-green-700' : latestACTScore?.controlLevel === 'Not Well Controlled' ? 'text-amber-700' : 'text-red-700'}`}>{latestACTScore?.controlLevel || 'Well Controlled'} - {latestACTScore?.controlLevel === 'Well Controlled' ? 'Your asthma is well managed' : latestACTScore?.controlLevel === 'Not Well Controlled' ? 'Your asthma needs improvement' : 'Immediate attention required'}</p>
                            </div>
                            <button 
                                onClick={() => setShowACTPage(true)}
                                className="mt-4 w-full px-4 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                Retake ACT Quiz
                            </button>
                        </div> 
                        */}
                        {/* Daily Symptom Tracking */}
                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Daily Symptom Tracker</h3>
                                <button
                                    onClick={() => setShowDailySymptomLogPage(true)}
                                    className="px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
                                >
                                    📝 Log Symptoms
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Daytime Symptoms */}
                                <div className="border border-slate-300 rounded-lg p-4 bg-yellow-50">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="text-xl">☀️</span>
                                        <h4 className="font-bold text-slate-900">Daytime Symptoms</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={daytimeSymptoms.includes('shortness-of-breath')}
                                                onChange={() => handleDaytimeToggle('shortness-of-breath')}
                                                className="w-4 h-4 text-teal-600 rounded" 
                                            />
                                            <label className="ml-2 text-sm text-slate-700">Shortness of breath during daily activities</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox"
                                                checked={daytimeSymptoms.includes('wheezing-chest-tightness')}
                                                onChange={() => handleDaytimeToggle('wheezing-chest-tightness')}
                                                className="w-4 h-4 text-teal-600 rounded" 
                                            />
                                            <label className="ml-2 text-sm text-slate-700">Wheezing or chest tightness</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox"
                                                checked={daytimeSymptoms.includes('trouble-keeping-up')}
                                                onChange={() => handleDaytimeToggle('trouble-keeping-up')}
                                                className="w-4 h-4 text-teal-600 rounded" 
                                            />
                                            <label className="ml-2 text-sm text-slate-700">Trouble keeping up with activities</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Nighttime Symptoms */}
                                <div className="border border-slate-300 rounded-lg p-4 bg-indigo-50">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="text-xl">🌙</span>
                                        <h4 className="font-bold text-slate-900">Nighttime Symptoms</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox"
                                                checked={nighttimeSymptoms.includes('woke-up-asthma')}
                                                onChange={() => handleNighttimeToggle('woke-up-asthma')}
                                                className="w-4 h-4 text-teal-600 rounded" 
                                            />
                                            <label className="ml-2 text-sm text-slate-700">Woke up due to asthma symptoms</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox"
                                                checked={nighttimeSymptoms.includes('coughing-wheezing')}
                                                onChange={() => handleNighttimeToggle('coughing-wheezing')}
                                                className="w-4 h-4 text-teal-600 rounded" 
                                            />
                                            <label className="ml-2 text-sm text-slate-700">Coughing or wheezing at night</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" 
                                                checked={nighttimeSymptoms.includes('difficulty-sleeping')}
                                                onChange={() => handleNighttimeToggle('difficulty-sleeping')}
                                                className="w-4 h-4 text-teal-600 rounded" 
                                            />
                                            <label className="ml-2 text-sm text-slate-700">Difficulty sleeping due to asthma</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Medications / Medicine Tracker */}
                        <MedicineTracker userId={userId} />
                        {symptoms.filter(s => s.severity !== 'mild').length > 0 && (
                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="font-bold text-slate-900 mb-4">Active Symptoms Reported</h4>
                                <div className="space-y-3">
                                    {symptoms.filter(s => s.severity !== 'mild').sort((a, b) => {
                                        const severityOrder = { severe: 0, moderate: 1, mild: 2 };
                                        return severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
                                    }).map((symptom) => (
                                        <div key={symptom.id} className={`rounded-lg p-4 border-l-4 ${
                                            symptom.severity === 'severe'
                                                ? 'bg-red-50 border-red-500'
                                                : 'bg-amber-50 border-amber-500'
                                        }`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-slate-900">{symptom.name}</h5>
                                                    <p className="text-xs text-slate-600 mt-1">Reported {symptom.timestamp}</p>
                                                    <p className="text-sm text-slate-700 mt-2">{symptom.solution}</p>
                                                </div>
                                                <span className={`ml-4 px-3 py-1 rounded text-xs font-bold whitespace-nowrap ${
                                                    symptom.severity === 'severe'
                                                        ? 'bg-red-200 text-red-900'
                                                        : 'bg-amber-200 text-amber-900'
                                                }`}>
                                                    {symptom.severity.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="border-t border-slate-200 pt-6 flex gap-3">
                            <button className="flex-1 px-4 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors">
                                📝 Log Today's Symptoms
                            </button>
                            <button className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                📊 View Weekly Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two-Column Layout: Medications & Quick Log */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Medications */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">💊</span>
                                <h2 className="text-xl font-bold text-white">Current Medications</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {inhalers.sort((a, b) => {
                                const statusOrder = { critical: 0, caution: 1, good: 2 };
                                return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
                            }).map(inhaler => (
                                <div key={inhaler.id} className={`border-2 rounded-lg p-4 ${
                                    inhaler.status === 'good' ? 'border-green-300 bg-green-50' :
                                    inhaler.status === 'caution' ? 'border-amber-300 bg-amber-50' :
                                    'border-red-300 bg-red-50'
                                }`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{inhaler.name}</h3>
                                            <p className={`text-xs font-semibold mt-1 ${
                                                inhaler.status === 'good' ? 'text-green-700' :
                                                inhaler.status === 'caution' ? 'text-amber-700' :
                                                'text-red-700'
                                            }`}>
                                                {inhaler.status === 'good' ? '✓ Adequate Supply' :
                                                 inhaler.status === 'caution' ? '⚠ Low Supply' :
                                                 '✕ Critical'}
                                            </p>
                                        </div>
                                        <p className="text-2xl font-black">{inhaler.dosesLeft}</p>
                                    </div>
                                    <div className="w-full h-2 bg-slate-300 rounded-full overflow-hidden mb-3">
                                        <div className={`h-full rounded-full ${
                                            inhaler.dosesLeft > 60 ? 'bg-green-500' :
                                            inhaler.dosesLeft > 30 ? 'bg-amber-500' :
                                            'bg-red-500'
                                        }`} style={{ width: `${(inhaler.dosesLeft / 120) * 100}%` }}></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-slate-600">
                                        <div><strong>Refill:</strong> {new Date(inhaler.refillDate).toLocaleDateString()}</div>
                                        <div><strong>Expires:</strong> {new Date(inhaler.expiryDate).toLocaleDateString()}</div>
                                    </div>
                                    <button 
                                        onClick={() => { setSelectedInhalerForRefill(inhaler); setShowRefillModal(true); }}
                                        className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                                    >
                                        Request Refill
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Log / Add Symptom */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                                <span>📝</span>
                                <span>Quick Log</span>
                            </h2>
                        </div>
                        <div className="p-6">
                            {showSymptomTracker ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Symptom</label>
                                        <input value={newQuickSymptom} onChange={(e)=>setNewQuickSymptom(e.target.value)} type="text" placeholder="e.g., Coughing..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Severity</label>
                                        <select value={newQuickSeverity} onChange={(e)=>setNewQuickSeverity(e.target.value as any)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                                            <option>Mild</option>
                                            <option>Moderate</option>
                                            <option>Severe</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Notes (optional)</label>
                                        <textarea value={newQuickNotes} onChange={(e)=>setNewQuickNotes(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" rows={3} />
                                    </div>
                                    <button onClick={addQuickLog} className="w-full px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors">
                                        Submit Report
                                    </button>
                                    <button onClick={() => setShowSymptomTracker(false)} className="w-full px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600">Record a new symptom or concern</p>
                                        <button onClick={() => setShowSymptomTracker(true)} className="mt-3 w-full px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors">
                                            + Log Symptom
                                        </button>
                                    </div>
                                    {quickLogs.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-bold text-slate-800 mb-2">Recent Quick Logs</h4>
                                            <div className="space-y-2">
                                                {quickLogs.slice(0,6).map(q => (
                                                    <div key={q.id} className="p-2 border rounded-lg flex items-start justify-between bg-slate-50">
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-900">{q.symptom} <span className="text-xs text-slate-500">• {q.severity}</span></div>
                                                            <div className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleString()}</div>
                                                            {q.notes && <div className="text-xs text-slate-700 mt-1">{q.notes}</div>}
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2 ml-4">
                                                            <button onClick={() => toggleResolveQuickLog(q.id)} className={`text-xs px-2 py-1 rounded ${q.resolved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{q.resolved ? 'Resolved' : 'Resolve'}</button>
                                                            <button onClick={() => deleteQuickLog(q.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Environmental & Health Metrics */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🌍</span>
                                <h2 className="text-xl font-bold text-white">Air Quality in Your Area</h2>
                            </div>
                            <button className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors">
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Main AQI Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800 text-sm uppercase">Air Quality Index</h3>
                                    <span className="text-3xl">🌫️</span>
                                </div>
                                <p className="text-4xl font-black text-red-700 mb-2">185</p>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-red-700">🔴 UNHEALTHY</p>
                                    <p className="text-xs text-red-600">All members of the general public are likely to be affected.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-red-200">
                                    <p className="text-xs text-slate-600"><strong>Recommendation:</strong> Stay indoors. Keep windows closed.</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800 text-sm uppercase">Pollen Level</h3>
                                    <span className="text-3xl">🌸</span>
                                </div>
                                <p className="text-4xl font-black text-amber-700 mb-2">High</p>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-amber-700">⚠️ HIGH ALLERGENS</p>
                                    <p className="text-xs text-amber-600">Grass and tree pollen detected.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-amber-200">
                                    <p className="text-xs text-slate-600"><strong>Recommendation:</strong> Use antihistamines. Avoid outdoor activities.</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800 text-sm uppercase">Peak Flow</h3>
                                    <span className="text-3xl">📈</span>
                                </div>
                                <p className="text-4xl font-black text-emerald-700 mb-2">350</p>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-emerald-700">✓ NORMAL RANGE</p>
                                    <p className="text-xs text-emerald-600">Your lung function is optimal.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-emerald-200">
                                    <p className="text-xs text-slate-600"><strong>Status:</strong> Continue regular monitoring.</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Air Quality Components */}
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="font-bold text-slate-900 mb-4">Air Quality Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-600 font-semibold uppercase mb-2">PM2.5 (Fine Particles)</p>
                                    <p className="text-2xl font-black text-red-700">92.4</p>
                                    <p className="text-xs text-red-600 mt-1">Unhealthy levels</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-600 font-semibold uppercase mb-2">PM10 (Coarse Particles)</p>
                                    <p className="text-2xl font-black text-amber-700">156</p>
                                    <p className="text-xs text-amber-600 mt-1">Moderate concern</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-600 font-semibold uppercase mb-2">O3 (Ozone)</p>
                                    <p className="text-2xl font-black text-orange-700">78</p>
                                    <p className="text-xs text-orange-600 mt-1">Moderate levels</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-600 font-semibold uppercase mb-2">NO2 (Nitrogen Dioxide)</p>
                                    <p className="text-2xl font-black text-yellow-700">45</p>
                                    <p className="text-xs text-yellow-600 mt-1">Good quality</p>
                                </div>
                            </div>
                        </div>

                        {/* Location & Real-time Data */}
                        <div className="border-t border-slate-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 className="font-bold text-slate-900 mb-3">📍 Your Location</h4>
                                    <p className="text-sm text-slate-800 font-semibold">Kozhinoor,Thenjipalam</p>
                                    <p className="text-xs text-slate-600 mt-1">Last updated: 2 minutes ago</p>
                                    <button className="mt-3 text-xs text-blue-600 font-bold hover:text-blue-700">
                                        Change Location →
                                    </button>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                                    <h4 className="font-bold text-slate-900 mb-3">🌤️ Weather Conditions</h4>
                                    <p className="text-sm text-slate-800 font-semibold">Partly Cloudy • 72°F</p>
                                    <p className="text-xs text-slate-600 mt-1">Humidity: 65% • Wind: 8 mph</p>
                                    <button className="mt-3 text-xs text-emerald-600 font-bold hover:text-emerald-700">
                                        View Forecast →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Health Impact Advisory */}
                        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                            <h4 className="font-bold text-red-900 mb-2">⚠️ Health Advisory</h4>
                            <p className="text-sm text-red-800">Current air quality is unhealthy for your asthma. We recommend:</p>
                            <ul className="mt-2 space-y-1 text-xs text-red-700 list-disc list-inside">
                                <li>Stay indoors and limit outdoor activities</li>
                                <li>Use air purifier if available</li>
                                <li>Keep rescue inhaler nearby at all times</li>
                                <li>Avoid strenuous exercise</li>
                                <li>Monitor symptoms closely</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Symptom History */}
                {symptoms.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                                <span>📊</span>
                                <span>Symptom History</span>
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {symptoms.map(symptom => (
                                    <div key={symptom.id} className={`border-l-4 p-4 rounded-lg ${
                                        symptom.severity === 'mild' ? 'border-blue-400 bg-blue-50' :
                                        symptom.severity === 'moderate' ? 'border-amber-400 bg-amber-50' :
                                        'border-red-400 bg-red-50'
                                    }`}>
                                        <h4 className="font-bold text-slate-900">{symptom.name}</h4>
                                        <p className="text-xs text-slate-600 mt-1">{symptom.timestamp}</p>
                                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
                                            symptom.severity === 'mild' ? 'bg-blue-200 text-blue-800' :
                                            symptom.severity === 'moderate' ? 'bg-amber-200 text-amber-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {symptom.severity.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600">
                    <p>Last synced: {new Date().toLocaleTimeString()} | For medical emergencies, call 911</p>
                </div>
            </div>
        </div>
    );
};