import React, { useState, useEffect } from 'react';

interface UserDetails {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    asthmaType?: string;
    severity?: string;
    knownAllergens?: string;
    doctorName?: string;
    doctorPhone?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
}

interface UserDetailsEditPageProps {
    onBack: () => void;
}

export const UserDetailsEditPage: React.FC<UserDetailsEditPageProps> = ({ onBack }) => {
    const [formData, setFormData] = useState<UserDetails>({
        id: '',
        name: '',
        email: '',
        phone: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'emergency' | 'insurance'>('personal');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Load user data on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setFormData(user);
            }

            // Also try to load from db.json
            const dbData = localStorage.getItem('dbData');
            if (dbData) {
                const db = JSON.parse(dbData);
                if (db.users && db.users.length > 0) {
                    const dbUser = db.users[0];
                    setFormData((prev) => ({ ...prev, ...dbUser }));
                }
            }
        } catch (e) {
            console.error('Failed to load user details:', e);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name || !formData.email || !formData.phone) {
            setErrorMessage('Name, email, and phone are required fields');
            setTimeout(() => setErrorMessage(''), 3000);
            return false;
        }
        if (!formData.asthmaType || !formData.severity) {
            setErrorMessage('Asthma type and severity are required');
            setTimeout(() => setErrorMessage(''), 3000);
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        try {
            // Normalize DOB and save to localStorage currentUser (store in both dateOfBirth and dob for compatibility)
            const userToSave = { ...formData } as any;
            if (formData.dateOfBirth) {
                // ensure it's stored as ISO date (YYYY-MM-DD)
                try {
                    const d = new Date(formData.dateOfBirth);
                    if (!isNaN(d.getTime())) {
                        // keep the YYYY-MM-DD if the input provided that, else use toISOString date portion
                        const iso = formData.dateOfBirth.length === 10 ? formData.dateOfBirth : d.toISOString().split('T')[0];
                        userToSave.dateOfBirth = iso;
                        userToSave.dob = iso;
                    } else {
                        userToSave.dateOfBirth = formData.dateOfBirth;
                        userToSave.dob = formData.dateOfBirth;
                    }
                } catch (e) {
                    userToSave.dateOfBirth = formData.dateOfBirth;
                    userToSave.dob = formData.dateOfBirth;
                }
            }

            // Save to localStorage currentUser
            localStorage.setItem('currentUser', JSON.stringify(userToSave));

            // Also save to db.json structure
            let dbData = localStorage.getItem('dbData');
            const db = dbData ? JSON.parse(dbData) : {};

            if (!db.users) db.users = [];

            const userIndex = db.users.findIndex((u: any) => u.id === formData.id);
            if (userIndex >= 0) {
                db.users[userIndex] = userToSave;
            } else {
                db.users.push(userToSave);
            }

            localStorage.setItem('dbData', JSON.stringify(db));

            setEditMode(false);
            setSuccessMessage('✓ Profile updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e) {
            console.error('Failed to save user details:', e);
            setErrorMessage('Failed to save changes');
            setTimeout(() => setErrorMessage(''), 3000);
        }
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">👤 User Details</h1>
                            <p className="text-slate-600">Manage your personal, medical, emergency, and insurance information</p>
                        </div>
                        <div className="flex gap-2">
                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                                >
                                    ✎ Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        ✓ Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="px-6 py-2 bg-slate-400 text-white rounded-lg font-semibold hover:bg-slate-500 transition"
                                    >
                                        ✕ Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-slate-200 bg-white rounded-t-xl">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`px-6 py-4 font-semibold transition border-b-2 ${
                            activeTab === 'personal'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        👤 Personal Info
                    </button>
                    <button
                        onClick={() => setActiveTab('medical')}
                        className={`px-6 py-4 font-semibold transition border-b-2 ${
                            activeTab === 'medical'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        💊 Medical Info
                    </button>
                    <button
                        onClick={() => setActiveTab('emergency')}
                        className={`px-6 py-4 font-semibold transition border-b-2 ${
                            activeTab === 'emergency'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        🚨 Emergency Contact
                    </button>
                    <button
                        onClick={() => setActiveTab('insurance')}
                        className={`px-6 py-4 font-semibold transition border-b-2 ${
                            activeTab === 'insurance'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        🛡️ Insurance
                    </button>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-b-xl shadow-lg p-8">
                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your email"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your phone number"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your street address"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your city"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your state"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Zip Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your zip code"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Medical Info Tab */}
                    {activeTab === 'medical' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Medical Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Asthma Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Asthma Type *</label>
                                    <select
                                        name="asthmaType"
                                        value={formData.asthmaType || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="intermittent">Intermittent</option>
                                        <option value="mild-persistent">Mild Persistent</option>
                                        <option value="moderate-persistent">Moderate Persistent</option>
                                        <option value="severe-persistent">Severe Persistent</option>
                                    </select>
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Severity *</label>
                                    <select
                                        name="severity"
                                        value={formData.severity || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    >
                                        <option value="">Select Severity</option>
                                        <option value="mild">Mild</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="severe">Severe</option>
                                    </select>
                                </div>

                                {/* Known Allergens */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Known Allergens</label>
                                    <textarea
                                        name="knownAllergens"
                                        value={formData.knownAllergens || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="List any known allergens that trigger your asthma (e.g., pollen, pet dander, dust mites)"
                                        rows={3}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Doctor Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Doctor Name</label>
                                    <input
                                        type="text"
                                        name="doctorName"
                                        value={formData.doctorName || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter your doctor's name"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Doctor Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor Phone</label>
                                    <input
                                        type="tel"
                                        name="doctorPhone"
                                        value={formData.doctorPhone || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter doctor's phone number"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Emergency Contact Tab */}
                    {activeTab === 'emergency' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Emergency Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Emergency Contact Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Name</label>
                                    <input
                                        type="text"
                                        name="emergencyContactName"
                                        value={formData.emergencyContactName || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter emergency contact name"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Emergency Contact Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Phone</label>
                                    <input
                                        type="tel"
                                        name="emergencyContactPhone"
                                        value={formData.emergencyContactPhone || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter emergency contact phone"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Emergency Contact Relation */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Relationship</label>
                                    <input
                                        type="text"
                                        name="emergencyContactRelation"
                                        value={formData.emergencyContactRelation || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="e.g., Mother, Father, Spouse, Friend"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Insurance Tab */}
                    {activeTab === 'insurance' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Insurance Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Insurance Provider */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Insurance Provider</label>
                                    <input
                                        type="text"
                                        name="insuranceProvider"
                                        value={formData.insuranceProvider || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter insurance provider name"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>

                                {/* Insurance Policy Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Policy Number</label>
                                    <input
                                        type="text"
                                        name="insurancePolicyNumber"
                                        value={formData.insurancePolicyNumber || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        placeholder="Enter insurance policy number"
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode
                                                ? 'border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                                : 'border-slate-300 bg-slate-50'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-200 flex gap-3">
                        <button
                            onClick={onBack}
                            className="flex-1 px-6 py-3 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition"
                        >
                            ← Back
                        </button>
                        {editMode && (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    ✓ Save All Changes
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex-1 px-6 py-3 bg-slate-400 text-white rounded-lg font-semibold hover:bg-slate-500 transition"
                                >
                                    ✕ Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
