import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, AlertTriangle, Calendar, ShieldAlert, ArrowRightCircle } from 'lucide-react';
import api from '../services/api';
import { getDaysDifference, getUrgencyStatus, getStatusColor } from '../utils/dateUtils';

export default function ActionCenter() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActionableAssets();
    }, []);

    const fetchActionableAssets = async () => {
        try {
            const response = await api.get('/api/assets');
            // Filter assets that have at least one expiry date
            const actionable = response.data.filter(a => 
                a.warrantyExpiry || a.returnWindowExpiry || a.subscriptionRenewal
            );
            setAssets(actionable);
        } catch (error) {
            console.error('Failed to fetch assets:', error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-950">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Action Centre</h1>
                    <p className="text-slate-400">Track and manage time-sensitive alerts for your assets.</p>
                </div>

                {assets.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No Active Alerts</h3>
                        <p className="text-slate-400">You don't have any assets with upcoming expiries or renewals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assets.map(asset => {
                            const warrantyDays = getDaysDifference(asset.warrantyExpiry);
                            const returnDays = getDaysDifference(asset.returnWindowExpiry);
                            const subDays = getDaysDifference(asset.subscriptionRenewal);

                            return (
                                <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
                                    <div className="mb-4 pb-4 border-b border-slate-800">
                                        <h3 className="text-lg font-semibold text-white truncate">{asset.name}</h3>
                                        <p className="text-slate-400 text-sm">Brand: {asset.brand || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-3">
                                        {asset.warrantyExpiry && (
                                            <div className={`p-3 rounded-lg border ${getStatusColor(getUrgencyStatus('warranty', warrantyDays))} flex justify-between items-center`}>
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Warranty</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold block">{warrantyDays < 0 ? 'Expired' : (warrantyDays === 0 ? 'Today' : `${warrantyDays} days left`)}</span>
                                                    <span className="text-xs opacity-80">{new Date(asset.warrantyExpiry).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )}
                                        {asset.returnWindowExpiry && (
                                            <div className={`p-3 rounded-lg border ${getStatusColor(getUrgencyStatus('return', returnDays))} flex justify-between items-center`}>
                                                <div className="flex items-center gap-2">
                                                    <ArrowRightCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Return Window</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold block">{returnDays < 0 ? 'Closed' : (returnDays === 0 ? 'Today' : `${returnDays} days left`)}</span>
                                                    <span className="text-xs opacity-80">{new Date(asset.returnWindowExpiry).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )}
                                        {asset.subscriptionRenewal && (
                                            <div className={`p-3 rounded-lg border ${getStatusColor(getUrgencyStatus('subscription', subDays))} flex justify-between items-center`}>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Renewal</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold block">{subDays < 0 ? 'Overdue' : (subDays === 0 ? 'Today' : `In ${subDays} days`)}</span>
                                                    <span className="text-xs opacity-80">{new Date(asset.subscriptionRenewal).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
