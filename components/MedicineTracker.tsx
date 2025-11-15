import React, { useEffect, useState } from 'react';
import { inhalersService, medicationLogsService } from '../services/databaseService';

interface Inhaler {
  id: number;
  name: string;
  dosesLeft: number;
  maxDoses?: number;
  refillDate: string;
  expiryDate: string;
  status: string;
  userId?: string;
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
    const loadData = async () => {
      try {
        if (userId) {
          // Load user's inhalers from backend
          const userInhalers = await inhalersService.getInhalersByUserId(userId);
          if (userInhalers && userInhalers.length > 0) {
            setInhalers(userInhalers);
          } else {
            // Create default inhalers for new users
            try {
              const defaultInhaler1 = await inhalersService.createInhaler({
                userId,
                name: 'Albuterol (Rescue)',
                dosesLeft: 85,
                maxDoses: 120,
                refillDate: '2025-02-15',
                expiryDate: '2025-12-31',
                status: 'good'
              });
              const defaultInhaler2 = await inhalersService.createInhaler({
                userId,
                name: 'Fluticasone (Maintenance)',
                dosesLeft: 45,
                maxDoses: 120,
                refillDate: '2025-03-10',
                expiryDate: '2026-01-15',
                status: 'caution'
              });
              setInhalers([defaultInhaler1, defaultInhaler2]);
            } catch (err) {
              console.error('Failed to create default inhalers:', err);
              // Fallback to local state
              setInhalers([
                { id: 1, userId, name: 'Albuterol (Rescue)', dosesLeft: 85, maxDoses: 120, refillDate: '2025-02-15', expiryDate: '2025-12-31', status: 'good' },
                { id: 2, userId, name: 'Fluticasone (Maintenance)', dosesLeft: 45, maxDoses: 120, refillDate: '2025-03-10', expiryDate: '2026-01-15', status: 'caution' },
              ]);
            }
          }

          // Load medication logs
          const userLogs = await medicationLogsService.getLogsByUserId(userId);
          setLogs(userLogs || []);
        }
      } catch (error) {
        console.error('Failed to load inhalers/logs', error);
        // Fallback to sample data if backend is unavailable
        setInhalers([
          { id: 1, name: 'Albuterol (Rescue)', dosesLeft: 85, maxDoses: 120, refillDate: '2025-02-15', expiryDate: '2025-12-31', status: 'good' },
          { id: 2, name: 'Fluticasone (Maintenance)', dosesLeft: 45, maxDoses: 120, refillDate: '2025-03-10', expiryDate: '2026-01-15', status: 'caution' },
        ]);
      }
    };
    loadData();
  }, [userId]);

  const markDoseTaken = async (inhalerId: number) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      // Create medication log in backend
      await medicationLogsService.createLog({
        userId,
        inhalerId,
        action: 'taken',
        timestamp: now,
      });

      // Update inhaler in backend
      const inhaler = inhalers.find(i => i.id === inhalerId);
      if (inhaler) {
        const updated = { ...inhaler, dosesLeft: Math.max(0, inhaler.dosesLeft - 1) };
        const max = updated.maxDoses ?? 120;
        const pct = (updated.dosesLeft / max) * 100;
        // update status based on percentage
        if (pct <= 10) updated.status = 'critical';
        else if (pct <= 30) updated.status = 'caution';
        else updated.status = 'good';
        
        await inhalersService.updateInhaler(inhalerId, updated);
        
        // Update local state
        setInhalers(inhalers.map(i => i.id === inhalerId ? updated : i));
        setLogs([...logs, { id: Date.now().toString(), userId, inhalerId, action: 'taken' as const, timestamp: now }]);
      }
    } catch (error) {
      console.error('Failed to mark dose taken', error);
      alert('Failed to update medication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestRefill = async (inhaler: Inhaler) => {
    if (!userId) return;
    
    try {
      const { refillRequestsService } = await import('../services/databaseService');
      await refillRequestsService.createRequest({
        userId,
        inhalerId: inhaler.id,
        inhalerName: inhaler.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      alert(`Refill request submitted for ${inhaler.name}`);
    } catch (error) {
      console.error('Failed to request refill', error);
      alert('Failed to submit refill request. Please try again.');
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
