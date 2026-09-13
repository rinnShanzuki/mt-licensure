/* VIEW: Login, Signup, and access-code entry screens. */

let gateMode = 'code-first'; // 'code-first' | 'signup' | 'login' | 'code-auth'

function renderGate(){
  const app = document.getElementById('app');
  document.getElementById('logout-btn').style.display = 'none';
  
  if (!currentUser) {
      if (gateMode === 'code-first') {
          app.innerHTML = `
            <div class="gate-screen">
              <div class="gate-card">
                <div class="eyebrow" style="color:var(--stamp)">🔑 Case Access Required</div>
                <h1>LAB LEVEL-UP</h1>
                <p class="gate-sub">Enter the access code from your purchase confirmation to unlock this reviewer.</p>
                <form id="gate-form">
                  <input id="gate-input" class="gate-input" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="XXXX-XXXX" aria-label="Access code">
                  <button class="btn" type="submit" style="margin-top: 15px;">Unlock File →</button>
                </form>
                <div style="margin-top: 15px; text-align: center;">
                    <button class="btn-icon" onclick="switchGateMode('login')">Already have an account? Log in</button>
                </div>
                <div id="gate-error" class="gate-error" aria-live="polite"></div>
              </div>
            </div>`;
      } else if (gateMode === 'login') {
          app.innerHTML = `
            <div class="gate-screen">
              <div class="gate-card">
                <div class="eyebrow" style="color:var(--stamp)">🔒 Log In</div>
                <h1>LAB LEVEL-UP</h1>
                <p class="gate-sub">Welcome back. Log in to access your reviewer.</p>
                <form id="gate-form">
                  <input id="gate-email" class="gate-input" type="email" autocomplete="email" required placeholder="Email address" aria-label="Email">
                  <input id="gate-password" class="gate-input" type="password" autocomplete="current-password" required placeholder="Password" aria-label="Password" style="margin-top: 10px;">
                  <button class="btn" type="submit" style="margin-top: 15px;">Log In →</button>
                </form>
                <div style="margin-top: 15px; text-align: center;">
                    <button class="btn-icon" onclick="switchGateMode('code-first')">Need to claim a code? Go back</button>
                </div>
                <div id="gate-error" class="gate-error" aria-live="polite"></div>
              </div>
            </div>`;
      } else if (gateMode === 'signup') {
          app.innerHTML = `
            <div class="gate-screen">
              <div class="gate-card">
                <div class="eyebrow" style="color:var(--green)">✅ Code Accepted</div>
                <h1>LAB LEVEL-UP</h1>
                <p class="gate-sub">Create an account to bind your access code and save your progress to the cloud.</p>
                <form id="gate-form">
                  <input id="gate-email" class="gate-input" type="email" autocomplete="email" required placeholder="Email address" aria-label="Email">
                  <input id="gate-password" class="gate-input" type="password" autocomplete="new-password" required placeholder="Password" aria-label="Password" style="margin-top: 10px;">
                  <button class="btn" type="submit" style="margin-top: 15px;">Sign Up →</button>
                </form>
                <div id="gate-error" class="gate-error" aria-live="polite"></div>
              </div>
            </div>`;
      }
  } else if (!isLicenseUnlocked) {
      gateMode = 'code-auth';
      app.innerHTML = `
        <div class="gate-screen">
          <div class="gate-card">
            <div class="eyebrow" style="color:var(--stamp)">🔑 Case Access Required</div>
            <h1>LAB LEVEL-UP</h1>
            <p class="gate-sub">Logged in as ${esc(currentUser.email)}. Enter your access code to unlock the reviewer.</p>
            <form id="gate-form">
              <input id="gate-input" class="gate-input" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="XXXX-XXXX" aria-label="Access code">
              <button class="btn" type="submit" style="margin-top: 15px;">Unlock File →</button>
            </form>
            <div style="margin-top: 15px; text-align: center;">
                <button class="btn-icon" onclick="handleLogout()">Log out</button>
            </div>
            <div id="gate-error" class="gate-error" aria-live="polite"></div>
          </div>
        </div>`;
  }

  const form = document.getElementById('gate-form');
  if (form) {
      if (gateMode === 'code-first' || gateMode === 'code-auth') {
          document.getElementById('gate-input').focus();
      } else {
          document.getElementById('gate-email').focus();
      }
      form.addEventListener('submit', function(e){
        e.preventDefault();
        handleGateSubmit();
      });
  }
}

function switchGateMode(mode) {
    gateMode = mode;
    renderGate();
}
