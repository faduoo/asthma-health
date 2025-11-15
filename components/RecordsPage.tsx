import React, { useState, useEffect } from 'react';
import CompanyLogo from './CompanyLogo';
import lungsLogo from '../lungs.png';

interface MedicalRecord {
    id: string;
    type: string;
    title: string;
    date: string;
    description: string;
    doctor?: string;
    status?: string;
}

interface Prescription {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    prescribedBy: string;
}

interface LabResult {
    id: string;
    testName: string;
    date: string;
    result: string;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'pending';
}

export const RecordsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'labs' | 'visits' | 'documents'>('overview');
    const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [labResults, setLabResults] = useState<LabResult[]>([]);

    useEffect(() => {
        try {
            const dbRaw = localStorage.getItem('dbData');
            const db = dbRaw ? JSON.parse(dbRaw) : {};

            // Load visits/records
            if (db.records && Array.isArray(db.records)) {
                setMedicalRecords(db.records);
            } else if (db.visits && Array.isArray(db.visits)) {
                setMedicalRecords(db.visits);
            } else {
                // fallback mock
                setMedicalRecords([
                    {
                        id: 'rec-001', type: 'visit', title: 'Routine Check-up', date: '2025-11-14',
                        description: 'Regular asthma assessment and medication review', doctor: 'Dr. Sarah Mitchell', status: 'completed'
                    }
                ]);
            }

            if (db.prescriptions && Array.isArray(db.prescriptions)) {
                setPrescriptions(db.prescriptions);
            } else {
                setPrescriptions([
                    { id: 'rx-001', medication: 'Albuterol (Rescue)', dosage: '90 mcg', frequency: 'As needed', startDate: '2025-11-08', endDate: '2026-02-08', prescribedBy: 'Dr. Maria Rodriguez' }
                ]);
            }

            if (db.labResults && Array.isArray(db.labResults)) {
                setLabResults(db.labResults);
            } else {
                setLabResults([
                    { id: 'lab-001', testName: 'FEV1 (Forced Expiratory Volume)', date: '2025-11-10', result: '84%', normalRange: '>80%', status: 'normal' }
                ]);
            }
        } catch (e) {
            console.error('Failed to load medical records from dbData', e);
        }
    }, []);

    const getStatusColor = (type: string) => {
        switch(type) {
            case 'visit': return 'bg-blue-100 text-blue-800';
            case 'lab': return 'bg-green-100 text-green-800';
            case 'prescription': return 'bg-purple-100 text-purple-800';
            case 'document': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'visit': return '👨‍⚕️';
            case 'lab': return '🔬';
            case 'prescription': return '💊';
            case 'document': return '📄';
            default: return '📋';
        }
    };

    const getLabStatusColor = (status: string) => {
        switch(status) {
            case 'normal': return 'bg-green-50 border-green-300';
            case 'abnormal': return 'bg-red-50 border-red-300';
            case 'pending': return 'bg-amber-50 border-amber-300';
            default: return 'bg-slate-50 border-slate-300';
        }
    };

    const getLabStatusBadge = (status: string) => {
        switch(status) {
            case 'normal': return 'bg-green-100 text-green-800';
            case 'abnormal': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-800';
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
                            <h1 className="text-2xl font-bold text-slate-900">Medical Records</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
                {/* Patient Info Card */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Patient Name</p>
                            <p className="text-lg font-bold text-slate-900">Mufeed</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Patient ID</p>
                            <p className="text-lg font-bold text-slate-900">ASM-2025-001</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Date of Birth</p>
                            <p className="text-lg font-bold text-slate-900">March 15, 1990</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Asthma Type</p>
                            <p className="text-lg font-bold text-slate-900">Persistent (Moderate)</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200 overflow-x-auto">
                        {[
                            { id: 'overview', label: '📋 Overview' },
                            { id: 'prescriptions', label: '💊 Prescriptions' },
                            { id: 'labs', label: '🔬 Lab Results' },
                            { id: 'visits', label: '👨‍⚕️ Visit History' },
                            { id: 'documents', label: '📄 Documents' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                                        : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Medical Records</h2>
                                {medicalRecords.map(record => (
                                    <div key={record.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div 
                                            className="bg-slate-50 p-4 cursor-pointer flex items-center justify-between"
                                            onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                                        >
                                            <div className="flex items-center space-x-4 flex-1">
                                                <span className="text-3xl">{getTypeIcon(record.type)}</span>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900">{record.title}</h3>
                                                    <p className="text-sm text-slate-600">{new Date(record.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.type)}`}>
                                                {record.type.toUpperCase()}
                                            </span>
                                        </div>
                                        {expandedRecord === record.id && (
                                            <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                                                <p className="text-slate-700">{record.description}</p>
                                                {record.doctor && (
                                                    <p className="text-sm text-slate-600"><strong>Doctor:</strong> {record.doctor}</p>
                                                )}
                                                {record.status && (
                                                    <p className="text-sm text-slate-600"><strong>Status:</strong> <span className="capitalize">{record.status}</span></p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Prescriptions Tab */}
                        {activeTab === 'prescriptions' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Current Prescriptions</h2>
                                {prescriptions.map(rx => (
                                    <div key={rx.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{rx.medication}</h3>
                                                <p className="text-sm text-slate-600">Prescribed by {rx.prescribedBy}</p>
                                            </div>
                                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                ACTIVE
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-purple-200">
                                            <div>
                                                <p className="text-xs text-slate-600 font-semibold uppercase">Dosage</p>
                                                <p className="text-sm font-bold text-slate-900">{rx.dosage}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-600 font-semibold uppercase">Frequency</p>
                                                <p className="text-sm font-bold text-slate-900">{rx.frequency}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-600 font-semibold uppercase">Start Date</p>
                                                <p className="text-sm font-bold text-slate-900">{new Date(rx.startDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-600 font-semibold uppercase">End Date</p>
                                                <p className="text-sm font-bold text-slate-900">{new Date(rx.endDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button className="mt-4 w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                                            📄 View Full Prescription
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Lab Results Tab */}
                        {activeTab === 'labs' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Lab Results</h2>
                                <div className="space-y-4">
                                    {labResults.map(lab => (
                                        <div key={lab.id} className={`border-2 rounded-lg p-4 ${getLabStatusColor(lab.status)}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{lab.testName}</h3>
                                                    <p className="text-sm text-slate-600">{new Date(lab.date).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLabStatusBadge(lab.status)}`}>
                                                    {lab.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Result</p>
                                                    <p className="text-lg font-bold text-slate-900">{lab.result}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Normal Range</p>
                                                    <p className="text-lg font-bold text-slate-900">{lab.normalRange}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Visit History Tab */}
                        {activeTab === 'visits' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Visit History</h2>
                                <div className="space-y-3">
                                    {medicalRecords.filter(r => r.type === 'visit').map(visit => (
                                        <div key={visit.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{visit.title}</h3>
                                                    <p className="text-sm text-slate-600 mt-1">{visit.description}</p>
                                                    <p className="text-xs text-slate-600 mt-2">
                                                        <strong>Doctor:</strong> {visit.doctor}
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        <strong>Date:</strong> {new Date(visit.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Medical Documents</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Asthma Action Plan', date: '2025-11-10', type: 'PDF' },
                                        { name: 'Allergy Test Results', date: '2025-10-15', type: 'PDF' },
                                        { name: 'Vaccination Record', date: '2025-09-20', type: 'PDF' },
                                        { name: 'Medication Refill History', date: '2025-11-14', type: 'PDF' }
                                    ].map((doc, idx) => (
                                        <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-3xl">📄</span>
                                                <div>
                                                    <p className="font-bold text-slate-900">{doc.name}</p>
                                                    <p className="text-xs text-slate-600">{new Date(doc.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                                                ⬇️ Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Emergency Contact */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Emergency Information</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Emergency Contact</p>
                                <p className="text-slate-900 font-semibold">John Thompson (Father)</p>
                                <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Allergies</p>
                                <p className="text-slate-900">Tree Pollen, Grass Pollen, Dust Mites</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Insurance Provider</p>
                                <p className="text-slate-900">HealthCare Plus</p>
                                <p className="text-sm text-slate-600">Policy #: HC-2025-ABC123</p>
                            </div>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Medical History</h3>
                        <ul className="space-y-2 text-slate-700">
                            <li className="flex items-center space-x-2">
                                <span className="text-teal-600">✓</span>
                                <span>Persistent Asthma (diagnosed 2015)</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-teal-600">✓</span>
                                <span>Allergic Rhinitis</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-teal-600">✓</span>
                                <span>Environmental Allergies</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-teal-600">✓</span>
                                <span>Exercise-Induced Bronchoconstriction</span>
                            </li>
                        </ul>
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
                        📥 Export All Records
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        🔐 Share with Doctor
                    </button>
                </div>
            </div>
        </div>
    );
};
