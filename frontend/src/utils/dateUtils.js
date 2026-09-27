export const getDaysDifference = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    // Strip time so we're comparing strict dates if necessary, or just rely on diff
    // Math.ceil handles the time diff gracefully for days
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getUrgencyStatus = (type, days) => {
    if (days === null) return null;
    
    switch (type) {
        case 'subscription':
            if (days <= 3) return 'URGENT';
            if (days <= 10) return 'WARNING';
            return 'SAFE';
        case 'warranty':
            if (days <= 10) return 'URGENT';
            if (days <= 30) return 'WARNING';
            return 'SAFE';
        case 'return':
            if (days <= 2) return 'URGENT';
            if (days <= 7) return 'WARNING';
            return 'SAFE';
        default:
            return 'SAFE';
    }
};

export const getStatusColor = (status) => {
    if (!status) return null;
    switch (status) {
        case 'URGENT':
            return 'bg-red-500/10 border-red-500/50 text-red-400';
        case 'WARNING':
            return 'bg-amber-500/10 border-amber-500/50 text-amber-400';
        case 'SAFE':
        default:
            return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400';
    }
};
