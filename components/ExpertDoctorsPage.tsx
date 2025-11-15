import React, { useState } from 'react';
import CompanyLogo from './CompanyLogo';
import lungsLogo from '../Stetho.png';

export const ExpertDoctorsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [callInProgress, setCallInProgress] = useState(false);

    const doctors = 
        [
    {
        id: 1,
        name: 'Dr. Ajith Kumar',
        specialty: 'Pulmonologist',
        credentials: 'MD, Board Certified',
        experience: '15+ years',
        rating: 4.9,
        reviews: 324,
        availability: 'Available Now',
        bio: 'Specializes in asthma management and respiratory diseases. Dedicated to personalized patient care.',
        image: 'https://randomuser.me/api/portraits/men/56.jpg', // Placeholder image for a male doctor
        languages: ['English', 'Spanish'],
        consultationFee: '$99'
    },
    {
        id: 2,
        name: 'Dr. Eswal Narayan',
        specialty: 'Respiratory Specialist',
        credentials: 'MD, PhD',
        experience: '12+ years',
        rating: 4.8,
        reviews: 287,
        availability: 'Available in 30 min',
        bio: 'Expert in chronic asthma treatment and advanced respiratory care protocols.',
        image: 'https://randomuser.me/api/portraits/men/62.jpg', // Placeholder image for a male doctor
        languages: ['English', 'Mandarin'],
        consultationFee: '$89'
    },
    {
        id: 3,
        name: 'Dr. Maria Rodriguez',
        specialty: 'Asthma Specialist',
        credentials: 'MD, FAAAAI',
        experience: '18+ years',
        rating: 4.9,
        reviews: 456,
        availability: 'Available in 1 hour',
        bio: 'Leading specialist in asthma control and personalized treatment plans.',
        image: 'https://randomuser.me/api/portraits/women/65.jpg', // Existing URL kept
        languages: ['English', 'Spanish', 'Portuguese'],
        consultationFee: '$119'
    },
    {
        id: 4,
        name: 'Dr. David Williams',
        specialty: 'General Practitioner - Respiratory',
        credentials: 'MD, MPH',
        experience: '10+ years',
        rating: 4.7,
        reviews: 198,
        availability: 'Available Now',
        bio: 'Holistic approach to asthma management with focus on patient education.',
        image: 'https://randomuser.me/api/portraits/men/62.jpg', // Placeholder image for a male doctor
        languages: ['English'],
        consultationFee: '$79'
    },
    {
        id: 5,
        name: 'Dr. Priya Patel',
        specialty: 'Pulmonary Medicine',
        credentials: 'MD, Board Certified',
        experience: '14+ years',
        rating: 4.8,
        reviews: 312,
        availability: 'Available in 45 min',
        bio: 'Focused on advanced asthma therapies and patient outcomes improvement.',
        image:'https://randomuser.me/api/portraits/men/70.jpg', // Placeholder image for a female doctor
            languages: ['English', 'Hindi', 'Gujarati'],
            consultationFee: '$109'
            },
            {
            id: 6,
            name: 'Dr. Robert Martinez',
            specialty: 'Immunology & Asthma',
            credentials: 'MD, Allergist-Immunologist',
            experience: '16+ years',
            rating: 4.9,
            reviews: 389,
            availability: 'Available Now',
            bio: 'Expert in allergen-related asthma and immunological treatment approaches.',
            image: 'https://randomuser.me/api/portraits/women/40.jpg', // Placeholder image for a male doctor
        languages: ['English', 'Spanish'],
        consultationFee: '$129'
    }    
    ];

    const handleCallClick = (doctorId: number) => {
        setSelectedDoctor(doctorId);
        setCallInProgress(true);
        setTimeout(() => {
            alert(`Initiating video call with ${doctors.find(d => d.id === doctorId)?.name}...`);
            setCallInProgress(false);
            setSelectedDoctor(null);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={onBack}
                                className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                ← Back
                            </button>
                            <div className="flex items-center space-x-3">
                                <CompanyLogo src={lungsLogo} className="h-8 w-8" alt="Asthma Health" />
                                <h1 className="text-2xl font-bold text-slate-900">Expert Doctors</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Title & Description */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Connect with Asthma Specialists</h2>
                    <p className="text-slate-600 text-lg">Get expert guidance from board-certified pulmonologists and respiratory specialists available 24/7</p>
                </div>

                {/* Filter & Sort Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1">
                            <input 
                                type="text" 
                                placeholder="Search doctors by name or specialty..." 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                            <option>All Specialties</option>
                            <option>Pulmonologist</option>
                            <option>Asthma Specialist</option>
                            <option>Respiratory Specialist</option>
                        </select>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                            <option>Availability</option>
                            <option>Available Now</option>
                            <option>Within 1 Hour</option>
                            <option>Today</option>
                        </select>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                            {/* Doctor Header */}
                            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-24 relative">
                                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                                    <div className="w-20 h-20 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center overflow-hidden shadow-lg">
                                        {doctor.image && (doctor.image.startsWith('http') || doctor.image.startsWith('data:')) ? (
                                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl">{doctor.image || '👩‍⚕️'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div className="pt-14 px-6 pb-6">
                                <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                                <p className="text-sm font-semibold text-teal-600 mt-1">{doctor.specialty}</p>
                                <p className="text-xs text-slate-600 mt-1">{doctor.credentials}</p>

                                {/* Experience & Rating */}
                                <div className="grid grid-cols-3 gap-3 mt-4 py-3 border-t border-b border-slate-200">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-600 font-semibold">EXPERIENCE</p>
                                        <p className="text-sm font-bold text-slate-900 mt-1">{doctor.experience}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-600 font-semibold">RATING</p>
                                        <p className="text-sm font-bold text-amber-600 mt-1">⭐ {doctor.rating}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-600 font-semibold">REVIEWS</p>
                                        <p className="text-sm font-bold text-slate-900 mt-1">{doctor.reviews}</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <p className="text-sm text-slate-600 mt-4">{doctor.bio}</p>

                                {/* Languages */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {doctor.languages.map((lang, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                            {lang}
                                        </span>
                                    ))}
                                </div>

                                {/* Availability & Fee */}
                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-xs text-slate-600">
                                        <strong>Status:</strong> <span className="text-green-700 font-bold">{doctor.availability}</span>
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1">
                                        <strong>Consultation:</strong> <span className="text-slate-900 font-bold">{doctor.consultationFee}</span>
                                    </p>
                                </div>

                                {/* Call Button */}
                                <button
                                    onClick={() => handleCallClick(doctor.id)}
                                    disabled={callInProgress && selectedDoctor === doctor.id}
                                    className={`w-full mt-4 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 ${
                                        callInProgress && selectedDoctor === doctor.id
                                            ? 'bg-slate-400 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-md hover:shadow-lg'
                                    }`}
                                >
                                    {callInProgress && selectedDoctor === doctor.id ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            <span>Connecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>📞</span>
                                            <span>Start Video Call</span>
                                        </>
                                    )}
                                </button>

                                {/* Secondary Actions */}
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 px-3 py-2 border-2 border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                        💬 Message
                                    </button>
                                    <button className="flex-1 px-3 py-2 border-2 border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                        📅 Schedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-12 text-center">
                    <p className="text-sm text-slate-800 mb-2">
                        <strong>Need immediate help?</strong> Call our emergency line: <span className="text-red-600 font-bold">1-800-ASTHMA-1</span>
                    </p>
                    <p className="text-xs text-slate-600">
                        All doctors are verified and board-certified. Video consultations are HIPAA compliant and secure.
                    </p>
                </div>
            </div>
        </div>
    );
};
