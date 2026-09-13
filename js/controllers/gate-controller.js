/* CONTROLLER: Wires the gate form to the license/auth model. */

let pendingCode = null; // Temporarily store a valid code during signup

async function handleGateSubmit(){
  const errEl = document.getElementById('gate-error');
  const btn = document.querySelector('#gate-form .btn');
  errEl.textContent = '';
  errEl.style.display = 'none';
  errEl.style.color = ''; // reset color in case it was a success message
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
      if (gateMode === 'code-first') {
          const code = document.getElementById('gate-input').value.trim().toUpperCase().replace(/\s+/g,'');
          const result = await DBService.verifyCodeUnused(code);
          
          if (result.success) {
              pendingCode = code; // Save it for later
              gateMode = 'signup';
              renderGate();
          } else {
              showError(result.message);
          }
          
      } else if (gateMode === 'code-auth') {
          // Logged in user attempting to claim a code
          const code = document.getElementById('gate-input').value;
          const result = await attemptUnlock(code);
          
          if (result.success) {
              await loadProgress();
              view = { screen: 'dashboard' };
              renderDashboard();
              celebrate('🎉 Access granted. Welcome to Lab Level-Up!', 'var(--gold)', 50);
          } else {
              showError(result.message || 'Invalid or already used access code.');
          }
          
      } else if (gateMode === 'signup') {
          const email = document.getElementById('gate-email').value;
          const password = document.getElementById('gate-password').value;
          
          await signup(email, password);
          
          // Force logout so they have to log in manually as requested
          await logout();
          
          gateMode = 'login';
          renderGate();
          
          // Show a friendly success message in the error div
          const msgEl = document.getElementById('gate-error');
          msgEl.textContent = "Account created successfully! Please log in to finish unlocking.";
          msgEl.style.display = 'block';
          msgEl.style.color = 'var(--green)';
          
      } else if (gateMode === 'login') {
          const email = document.getElementById('gate-email').value;
          const password = document.getElementById('gate-password').value;
          
          await login(email, password);
          
          // If they just signed up and had a code pending, claim it now!
          if (pendingCode && currentUser) {
              await attemptUnlock(pendingCode);
              pendingCode = null;
          }
          
          if (isLicenseUnlocked) {
              await loadProgress();
              view = { screen: 'dashboard' };
              renderDashboard();
          } else {
              // They logged in but have no code.
              gateMode = 'code-auth';
              renderGate();
          }
      }
  } catch (error) {
      console.error("Gate Error:", error);
      showError(error.message || 'An error occurred.');
  } finally {
      if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
      }
  }
}

function showError(msg) {
    const errEl = document.getElementById('gate-error');
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.color = 'var(--stamp)';
        errEl.style.display = 'block';
    }
}

async function handleLogout() {
    try {
        await logout();
        gateMode = 'code-first';
        renderGate();
    } catch (e) {
        console.error("Logout error", e);
    }
}
