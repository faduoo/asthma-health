import React, { useState } from 'react';

interface Inhaler {
  id: number;
  name: string;
  dosesLeft: number;
  refillDate: string;
  expiryDate: string;
  status: string;
}

interface RefillModalProps {
  inhaler: Inhaler | null;
  userId?: string;
  onClose: () => void;
}

export const RefillModal: React.FC<RefillModalProps> = ({ inhaler, userId, onClose }) => {
  const [contactMethod, setContactMethod] = useState<'call' | 'email' | 'online'>('online');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!inhaler) return null;

  const submitRequest = () => {
    setLoading(true);
    try {
      const dbDataRaw = localStorage.getItem('dbData');
      const db = dbDataRaw ? JSON.parse(dbDataRaw) : {};
      if (!db.refillRequests) db.refillRequests = [];

      const request = {
        id: Date.now().toString(),
        userId: userId || 'unknown',
        inhalerId: inhaler.id,
        inhalerName: inhaler.name,
        contactMethod,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      db.refillRequests.push(request);
      localStorage.setItem('dbData', JSON.stringify(db));

      setSuccess('Refill request submitted — status: pending');
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 900);
    } catch (e) {
      console.error('Failed to submit refill request', e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Request Refill</h2>
              <p className="text-sm text-slate-600">Medication: <strong>{inhaler.name}</strong></p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="text-sm text-slate-700">Doses left: <strong>{inhaler.dosesLeft}</strong></div>
            <div className="text-sm text-slate-700">Refill date: <strong>{new Date(inhaler.refillDate).toLocaleDateString()}</strong></div>
            <div className="text-sm text-slate-700">Expiry: <strong>{new Date(inhaler.expiryDate).toLocaleDateString()}</strong></div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred contact method</label>
              <div className="flex gap-2">
                <button onClick={() => setContactMethod('online')} className={`px-3 py-2 rounded-lg ${contactMethod === 'online' ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>Online</button>
                <button onClick={() => setContactMethod('email')} className={`px-3 py-2 rounded-lg ${contactMethod === 'email' ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>Email</button>
                <button onClick={() => setContactMethod('call')} className={`px-3 py-2 rounded-lg ${contactMethod === 'call' ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>Call</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Add notes for the pharmacy or doctor (e.g., preferred pickup location)"></textarea>
            </div>

            <div className="flex gap-2 mt-4">
              <button disabled={loading} onClick={submitRequest} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Refill Request'}</button>
              <button onClick={onClose} className="flex-1 bg-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300">Cancel</button>
            </div>

            {success && <div className="mt-3 text-sm text-green-700">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
