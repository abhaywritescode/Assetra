import zxcvbn from 'zxcvbn';

/**
 * Checks if a password has been exposed in a data breach using the HIBP k-Anonymity API.
 * @param {string} password 
 * @returns {Promise<boolean>} True if breached, false otherwise.
 */
export async function checkBreachedPassword(password) {
    if (!password) return false;
    
    try {
        // Hash password with SHA-1
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-1', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        
        const prefix = hashHex.slice(0, 5);
        const suffix = hashHex.slice(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) {
            console.error('Failed to fetch from HIBP API');
            return false; // Fail open to avoid blocking user signup on network errors
        }
        
        const text = await response.text();
        const hashes = text.split('\n');
        
        for (const line of hashes) {
            const [hashSuffix] = line.split(':');
            if (hashSuffix.trim() === suffix) {
                return true; // Found in breach database
            }
        }
        return false;
    } catch (error) {
        console.error('HIBP check error:', error);
        return false; // Fail open
    }
}

/**
 * Estimates password strength using zxcvbn.
 * @param {string} password 
 * @returns {Object} { score: number (0-4), feedback: Object }
 */
export function checkPasswordStrength(password) {
    if (!password) return { score: 0, feedback: { warning: '', suggestions: [] } };
    const result = zxcvbn(password);
    return {
        score: result.score,
        feedback: result.feedback
    };
}
