import React, { useEffect, useState } from 'react';

interface Inhaler {
  id: number;
  name: string;
  dosesLeft: number;
  maxDoses?: number;
  refillDate: string;
  expiryDate: string;
  status: string;
}

interface MedicationLog {
  id: string;
  userId: string;
  inhalerId: number;
  action: 'taken' | 'skipped';
  timestamp: string;
}

export const MedicineTracker: React.FC<{ userId?: string }> = ({ userId }) => {
  const [inhalers, setInhalers] = useState<Inhaler[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const dbRaw = localStorage.getItem('dbData');
      const db = dbRaw ? JSON.parse(dbRaw) : {};
      if (db.inhalers && Array.isArray(db.inhalers)) {
        setInhalers(db.inhalers);
      } else {
        // fallback sample with maxDoses
        setInhalers([
          { id: 1, name: 'Albuterol (Rescue)', dosesLeft: 85, maxDoses: 120, refillDate: '2025-02-15', expiryDate: '2025-12-31', status: 'good' },
          { id: 2, name: 'Fluticasone (Maintenance)', dosesLeft: 45, maxDoses: 120, refillDate: '2025-03-10', expiryDate: '2026-01-15', status: 'caution' },
        ]);
      }

      if (db.medicationLogs && Array.isArray(db.medicationLogs)) {
        setLogs(db.medicationLogs);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error('Failed to load inhalers/logs', e);
    }
  }, []);

  const saveDb = (newInhalers: Inhaler[], newLogs: MedicationLog[]) => {
    try {
      const dbRaw = localStorage.getItem('dbData');
      const db = dbRaw ? JSON.parse(dbRaw) : {};
      db.inhalers = newInhalers;
      db.medicationLogs = newLogs;
      localStorage.setItem('dbData', JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save medication data', e);
    }
  };

  const markDoseTaken = (inhalerId: number) => {
    setLoading(true);
    const now = new Date().toISOString();
    const newLogs = [
      ...logs,
      { id: Date.now().toString(), userId: userId || 'unknown', inhalerId, action: 'taken', timestamp: now },
    ];

    const newInhalers = inhalers.map(i => {
      if (i.id === inhalerId) {
        const updated = { ...i, dosesLeft: Math.max(0, i.dosesLeft - 1) };
        const max = i.maxDoses ?? 120;
        const pct = (updated.dosesLeft / max) * 100;
        // update status based on percentage
        if (pct <= 10) updated.status = 'critical';
        else if (pct <= 30) updated.status = 'caution';
        else updated.status = 'good';
        return updated;
      }
      return i;
    });

    setInhalers(newInhalers);
    setLogs(newLogs);
    saveDb(newInhalers, newLogs);

    // small UX delay
    setTimeout(() => setLoading(false), 400);
  };

  const requestRefill = (inhaler: Inhaler) => {
    try {
      const dbRaw = localStorage.getItem('dbData');
      const db = dbRaw ? JSON.parse(dbRaw) : {};
      if (!db.refillRequests) db.refillRequests = [];
      const req = {
        id: Date.now().toString(),
        userId: userId || 'unknown',
        inhalerId: inhaler.id,
        inhalerName: inhaler.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      db.refillRequests.push(req);
      localStorage.setItem('dbData', JSON.stringify(db));
      alert(`Refill request submitted for ${inhaler.name}`);
    } catch (e) {
      console.error('Failed to request refill', e);
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl">💨</div>
            <div>
              <h2 className="text-lg font-bold text-white">Medication Tracker</h2>
              <p className="text-sm text-white/90">Track inhaler supply, doses and refills</p>
            </div>
          </div>
          <div className="text-sm text-white/90">Auto-saves changes</div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {inhalers.length === 0 ? (
          <div className="text-center py-10 col-span-full">No medications found.</div>
        ) : (
          inhalers.sort((a,b)=>a.id-b.id).map(inhaler => {
            const max = inhaler.maxDoses ?? 120;
            const pct = Math.round((Math.max(0, inhaler.dosesLeft) / max) * 100);
            const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444';
            return (
              <div key={inhaler.id} className={`relative bg-white rounded-xl shadow-sm p-4 border ${inhaler.status === 'critical' ? 'border-red-200' : inhaler.status === 'caution' ? 'border-amber-200' : 'border-green-200'}`}>
                {inhaler.status === 'critical' && <div className="absolute -top-3 right-3 animate-pulse bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Low</div>}
                <div className="flex items-center gap-4">
                  <div style={{ width: 64, height: 64, borderRadius: 9999, background: `conic-gradient(${color} ${pct}%, #e6e6e6 ${pct}%)` }} className="flex items-center justify-center">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-slate-800">{inhaler.dosesLeft}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{inhaler.name}</h3>
                        <p className="text-xs text-slate-600 mt-1">Expires {new Date(inhaler.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${inhaler.status === 'good' ? 'text-green-600' : inhaler.status === 'caution' ? 'text-amber-600' : 'text-red-600'}`}>
                          {inhaler.status === 'good' ? 'Good' : inhaler.status === 'caution' ? 'Low' : 'Critical'}
                        </div>
                        <div className="text-xs text-slate-500">{pct}%</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <button onClick={() => markDoseTaken(inhaler.id)} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                        {loading ? 'Updating...' : 'Mark Dose'}
                      </button>
                      <button onClick={() => requestRefill(inhaler)} className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">
                        Request Refill
                      </button>
                      <div className="text-xs text-slate-500">Refill by {new Date(inhaler.refillDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm">
        <h4 className="font-semibold mb-3">Recent Medication Logs</h4>
        <div className="space-y-2">
          {logs.slice().reverse().slice(0,6).map(l => (
            <div key={l.id} className="flex items-center justify-between py-2 bg-white rounded-lg px-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${l.action === 'taken' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{l.action === 'taken' ? '✓' : '✕'}</div>
                <div>
                  <div className="font-semibold">{inhalers.find(i=>i.id===l.inhalerId)?.name || 'Medication'}</div>
                  <div className="text-xs text-slate-600">{new Date(l.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">{l.userId}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
