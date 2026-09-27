import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getDaysDifference, getUrgencyStatus, getStatusColor } from '../utils/dateUtils';
import { Clock, ShieldCheck, AlertTriangle, Calendar, ShieldAlert, ArrowRightCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [impactData, setImpactData] = useState({ protectedValue: 0, purchaseAdvantageTotal: 0 });
  const [actions, setActions] = useState([]);
  const [attentionAssets, setAttentionAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Safe parallel fetching
        const [impactRes, actionsRes, assetsRes] = await Promise.allSettled([
          api.get('/api/impact/summary'),
          api.get('/api/actions'),
          api.get('/api/assets')
        ]);
        
        if (impactRes.status === 'fulfilled' && impactRes.value.data) {
          setImpactData(impactRes.value.data);
        }
        if (actionsRes.status === 'fulfilled' && actionsRes.value.data) {
          setActions(actionsRes.value.data.actions || []);
        }
        if (assetsRes.status === 'fulfilled' && assetsRes.value.data) {
          const assets = assetsRes.value.data;
          
          const attentionItems = [];
          
          assets.forEach(asset => {
            const warrantyDays = getDaysDifference(asset.warrantyExpiry);
            const returnDays = getDaysDifference(asset.returnWindowExpiry);
            const subDays = getDaysDifference(asset.subscriptionRenewal);
            
            const warrantyStatus = getUrgencyStatus('warranty', warrantyDays);
            const returnStatus = getUrgencyStatus('return', returnDays);
            const subStatus = getUrgencyStatus('subscription', subDays);
            
            const flags = [];
            if (warrantyStatus === 'URGENT' || warrantyStatus === 'WARNING') {
                flags.push({ type: 'Warranty', days: warrantyDays, status: warrantyStatus, date: asset.warrantyExpiry });
            }
            if (returnStatus === 'URGENT' || returnStatus === 'WARNING') {
                flags.push({ type: 'Return Window', days: returnDays, status: returnStatus, date: asset.returnWindowExpiry });
            }
            if (subStatus === 'URGENT' || subStatus === 'WARNING') {
                flags.push({ type: 'Subscription', days: subDays, status: subStatus, date: asset.subscriptionRenewal });
            }
            
            if (flags.length > 0) {
                attentionItems.push({ ...asset, attentionFlags: flags });
            }
          });
          
          setAttentionAssets(attentionItems);
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

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-5 h-5" /> 
            Items Needing Your Attention
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg mb-8">
            {attentionAssets.length === 0 ? (
              <div className="text-center py-6">
                 <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-80" />
                 <p className="text-slate-400 font-medium">You're all caught up! No items need attention right now.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {attentionAssets.map((asset) => (
                  <li key={asset.id} className="pb-4 border-b border-slate-800 last:border-0 last:pb-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <p className="font-semibold text-lg">{asset.name}</p>
                        <p className="text-sm text-slate-400">{asset.brand || 'No Brand'}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {asset.attentionFlags.map((flag, idx) => (
                            <div key={idx} className={`px-3 py-1.5 rounded-lg border ${getStatusColor(flag.status)} flex justify-between items-center gap-4 min-w-[200px]`}>
                                <div className="flex items-center gap-2">
                                    {flag.type === 'Warranty' && <ShieldCheck className="w-3 h-3" />}
                                    {flag.type === 'Return Window' && <ArrowRightCircle className="w-3 h-3" />}
                                    {flag.type === 'Subscription' && <Calendar className="w-3 h-3" />}
                                    <span className="text-xs font-semibold">{flag.type}</span>
                                </div>
                                <span className="text-xs font-bold text-right">
                                    {flag.days < 0 ? 'Expired/Overdue' : (flag.days === 0 ? 'Today' : `${flag.days} days left`)}
                                </span>
                            </div>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h2 className="text-xl font-bold mb-4">Recommended Actions</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            {!actions || actions.length === 0 ? (
              <p className="text-slate-400">No recommended actions available.</p>
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
