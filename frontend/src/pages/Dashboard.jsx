import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [impactData, setImpactData] = useState({ protectedValue: 0, purchaseAdvantageTotal: 0 });
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Safe parallel fetching
        const [impactRes, actionsRes] = await Promise.allSettled([
          api.get('/api/impact/summary'),
          api.get('/api/actions')
        ]);
        
        if (impactRes.status === 'fulfilled' && impactRes.value.data) {
          setImpactData(impactRes.value.data);
        }
        if (actionsRes.status === 'fulfilled' && actionsRes.value.data) {
          setActions(actionsRes.value.data.actions || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-slate-50">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
      <p className="text-slate-400 mb-8">Here is your Assetra overview.</p>

      {loading ? (
        <div className="text-slate-400 animate-pulse">Loading your assets...</div>
      ) : (
        <>

          <h2 className="text-xl font-bold mb-4">Action Center</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            {!actions || actions.length === 0 ? (
              <p className="text-slate-400">You're all caught up! No pending actions.</p>
            ) : (
              <ul className="space-y-4">
                {actions.map((action, idx) => (
                  <li key={idx} className="pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm text-slate-400">{action.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
