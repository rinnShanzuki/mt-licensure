/* ENTRY POINT: boots the app, and exposes the handful of functions
   the page's inline onclick/onchange HTML attributes call by name. */

async function bootApp(){
  renderLoading();
  setSaveState('loading');
  await loadProgress();
  setSaveState('idle');
  renderDashboard();
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && currentModal) closeLevelModal();
  });
  window.addEventListener('beforeunload', function(e){
    if(pendingSaves > 0){
      e.preventDefault();
      e.returnValue = '';
    }
  });
}
async function init(){
  renderLoading(); // Show something while checking session
  
  // Listen for auth changes (e.g. if session expires while tab is open)
  AuthService.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      if (event === 'SIGNED_OUT') {
          await checkAuthState();
          gateMode = 'login';
          renderGate();
      } else if (event === 'SIGNED_IN') {
          // If signed in, we need to check if they have unlocked the app
          await checkAuthState();
          if (currentUser && isLicenseUnlocked) {
              await bootApp();
          } else {
              renderGate();
          }
      }
  });

  // Initial check
  await checkAuthState();
  
  if (currentUser && isLicenseUnlocked) {
      await bootApp();
  } else {
      renderGate();
  }
}
init();

window.backToDashboard = backToDashboard;
window.closeLevelModal = closeLevelModal;
window.exportProgress = exportProgress;
window.handleImportFile = handleImportFile;
window.openLevel = openLevel;
window.openSubject = openSubject;
window.resetProgress = resetProgress;
window.toggleStage = toggleStage;
window.triggerImportPicker = triggerImportPicker;
