/* ADMIN CONTROLLER: Handles code generation and admin auth. */

let currentUser = null;
let isAdmin = false;

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomGroup(len){
  let s = '';
  for(let i=0; i<len; i++) {
      s += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return s;
}

function generateRandomCode(){
  return `LLU-${randomGroup(4)}-${randomGroup(4)}`;
}

async function checkAdminStatus() {
    currentUser = await AuthService.getCurrentUser();
    if (currentUser) {
        // Check if user is in admin_users table
        const { data, error } = await sbClient
            .from('admin_users')
            .select('user_id')
            .eq('user_id', currentUser.id)
            .single();
            
        if (data) {
            isAdmin = true;
        } else {
            isAdmin = false;
        }
    } else {
        isAdmin = false;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.querySelector('#admin-login-form .btn');
    const errEl = document.getElementById('admin-error');
    errEl.textContent = '';
    btn.disabled = true;
    
    try {
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        await AuthService.signIn(email, password);
        await initAdmin();
    } catch (e) {
        errEl.textContent = e.message || 'Login failed';
    } finally {
        if(btn) btn.disabled = false;
    }
}

async function handleGenerateCode() {
    const btn = document.getElementById('btn-generate');
    btn.disabled = true;
    btn.textContent = 'Generating...';
    
    try {
        const newCode = generateRandomCode();
        const { error } = await sbClient
            .from('access_codes')
            .insert([{ code: newCode }]);
            
        if (error) throw error;
        
        document.getElementById('generated-code').textContent = newCode;
        await loadHistory();
    } catch (e) {
        alert("Failed to generate code: " + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Generate New Code';
    }
}

async function loadHistory() {
    const listEl = document.getElementById('history-list');
    if (!listEl) return;
    
    // Fetch last 20 codes using the secure RPC to get emails
    const { data, error } = await sbClient.rpc('get_admin_recent_codes');
        
    if (error) {
        console.error("Failed to load history", error);
        return;
    }
    
    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Access Code</th>
            <th>Status</th>
            <th>Claimed By</th>
            <th>Date Used</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(row => {
        let statusClass = row.is_used ? 'status-used' : 'status-unused';
        let statusText = row.is_used ? 'Claimed' : 'Available';
        let emailText = row.user_email ? esc(row.user_email) : '-';
        let dateText = row.used_at ? new Date(row.used_at).toLocaleDateString() : '-';

        html += `
          <tr>
            <td style="font-weight: bold; color: var(--text)">${esc(row.code)}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${emailText}</td>
            <td>${dateText}</td>
          </tr>
        `;
    });

    html += "</tbody></table>";
    listEl.innerHTML = html;
}

async function renderAdminDashboard() {
    document.getElementById('app').innerHTML = `
    <div class="admin-container">
      <div class="eyebrow" style="color:var(--green)">Welcome, Admin</div>
      <h1>Code Generator</h1>
      <p class="gate-sub">Click the button below to generate a new valid access code. It will be instantly saved to the database and ready for use.</p>
      
      <div class="code-display" id="generated-code">
        [ CLICK GENERATE ]
      </div>
      
      <div style="text-align: center;">
          <button id="btn-generate" class="btn" onclick="handleGenerateCode()">Generate New Code</button>
          <br><br>
          <button class="btn-icon" onclick="AuthService.signOut().then(() => initAdmin())">Log Out</button>
      </div>

      <div class="history-list">
          <div class="eyebrow" style="margin-bottom: 15px;">Recent Codes</div>
          <div id="history-list"></div>
      </div>
    </div>
    `;
    
    await loadHistory();
}

async function initAdmin() {
    await checkAdminStatus();
    
    if (currentUser && isAdmin) {
        renderAdminDashboard();
    } else if (currentUser && !isAdmin) {
        document.getElementById('app').innerHTML = `
        <div class="admin-container gate-card">
            <h1 style="color:var(--stamp)">Access Denied</h1>
            <p>Your account (${esc(currentUser.email)}) is not an administrator.</p>
            <button class="btn" onclick="AuthService.signOut().then(() => initAdmin())">Log Out</button>
        </div>`;
    } else {
        // Show login form (already in HTML)
        const form = document.getElementById('admin-login-form');
        if (form) {
            form.addEventListener('submit', handleLogin);
        } else {
            // Need to reload the page to get the original HTML back if they logged out from non-admin state
            window.location.reload(); 
        }
    }
}

// Start
AuthService.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') initAdmin();
});

initAdmin();
