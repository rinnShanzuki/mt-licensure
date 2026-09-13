/* MODEL: Handles auth state and unlock status. */

let currentUser = null;
let isLicenseUnlocked = false;

async function checkAuthState() {
    currentUser = await AuthService.getCurrentUser();
    if (currentUser) {
        setCurrentUser(currentUser.id); // set in progress-model
        isLicenseUnlocked = await DBService.hasUserUnlocked(currentUser.id);
    } else {
        setCurrentUser(null);
        isLicenseUnlocked = false;
    }
}

async function login(email, password) {
    await AuthService.signIn(email, password);
    await checkAuthState();
}

async function signup(email, password) {
    await AuthService.signUp(email, password);
    await checkAuthState();
}

async function logout() {
    await AuthService.signOut();
    await checkAuthState();
    progress = {}; // clear local progress on logout
}

async function attemptUnlock(code) {
    if (!currentUser) return { success: false, message: 'Must be logged in.' };
    
    // Normalize code (uppercase, trim)
    const normalizedCode = String(code||'').trim().toUpperCase().replace(/\s+/g,'');
    
    const result = await DBService.checkAndClaimCode(currentUser.id, normalizedCode);
    if (result.success) {
        isLicenseUnlocked = true;
    }
    return result;
}
