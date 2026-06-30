// ============================================================
// ST. MICHAEL'S ADMIN PORTAL — admin.js
// Firebase Firestore writes + UI logic
// ============================================================
// Using global getData, setData, DEFAULTS from firebase-config.js

// ── Global state ──────────────────────────────────────────────
let state = {};
let currentPanel = 'dashboard';
let editingItem = null;

// ── DOM ───────────────────────────────────────────────────────
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const pageTitle = document.getElementById('pageTitle');

// ── Init / Auth State listener ────────────────────────────────
function init() {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      showDashboard();
      await loadAllData();
      renderCurrentPanel();
    } else {
      loginScreen.style.display = 'flex';
      dashboard.style.display = 'none';
      dashboard.classList.remove('visible');
    }
  });
}

// ── Login ─────────────────────────────────────────────────────
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPw').value;
  const btn = document.getElementById('loginBtn');

  btn.classList.add('loading');
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Verifying...`;

  try {
    await firebase.auth().signInWithEmailAndPassword(email, pw);
    loginError.classList.remove('show');
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.add('show');
    btn.classList.remove('loading');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign In`;
    document.getElementById('loginPw').value = '';
    document.getElementById('loginPw').focus();
  }
});

// Toggle password visibility
document.getElementById('pwToggle')?.addEventListener('click', () => {
  const pwInput = document.getElementById('loginPw');
  const icon = document.getElementById('pwToggle').querySelector('svg');
  if (pwInput.type === 'password') {
    pwInput.type = 'text';
    icon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    pwInput.type = 'password';
    icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
});

// ── Logout ────────────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  if (confirm('Are you sure you want to log out?')) {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      toast('Sign out failed: ' + e.message, 'error');
    }
  }
});

// ── Show Dashboard ────────────────────────────────────────────
function showDashboard() {
  loginScreen.style.display = 'none';
  dashboard.style.display = 'flex';
  dashboard.classList.add('visible');
  document.getElementById('adminTime').textContent = new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
}

// ── Load All Data from Firestore ──────────────────────────────
async function loadAllData() {
  const sections = ['news','admission','toppers','gallery','hours','contact','faculty','principal'];
  for (const section of sections) {
    const data = await getData(section);
    if (data && data.items && Array.isArray(data.items)) {
      state[section] = data.items;
    } else if (data) {
      state[section] = data;
    } else {
      state[section] = DEFAULTS[section];
    }
  }
}

// ── Navigation ────────────────────────────────────────────────
document.querySelectorAll('.nav-item[data-panel]').forEach(item => {
  item.addEventListener('click', () => {
    const panel = item.getAttribute('data-panel');
    switchPanel(panel);
    item.closest('.nav-item')?.parentElement?.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-panel]').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

function switchPanel(name) {
  currentPanel = name;
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${name}`);
  if (panel) {
    panel.classList.add('active');
    pageTitle.textContent = panel.getAttribute('data-title') || 'Dashboard';
  }
  renderCurrentPanel();
}

function renderCurrentPanel() {
  switch(currentPanel) {
    case 'dashboard': renderDashboard(); break;
    case 'news': renderNews(); break;
    case 'admission': renderAdmission(); break;
    case 'toppers': renderToppers(); break;
    case 'gallery': renderGallery(); break;
    case 'hours': renderHours(); break;
    case 'contact': renderContact(); break;
    case 'faculty': renderFaculty(); break;
    case 'principal': renderPrincipal(); break;
  }
}

// ── Toast ─────────────────────────────────────────────────────
function toast(message, type = 'success') {
  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  const container = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

// ── Save Helper ───────────────────────────────────────────────
async function saveSection(section, data) {
  try {
    await setData(section, data);
    if (data && data.items && Array.isArray(data.items)) {
      state[section] = data.items;
    } else {
      state[section] = data;
    }
    toast(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully!`, 'success');
  } catch (err) {
    toast(`Save failed: ${err.message}`, 'error');
    console.error(err);
  }
}

// ── Modal Helpers ─────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  m?.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  m?.classList.remove('open');
  editingItem = null;
}
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal-backdrop');
    if (modal) { modal.classList.remove('open'); editingItem = null; }
  });
});
document.querySelectorAll('.modal-backdrop').forEach(m => {
  m.addEventListener('click', (e) => { if (e.target === m) { m.classList.remove('open'); editingItem = null; } });
});

// ── DASHBOARD ─────────────────────────────────────────────────
function renderDashboard() {
  document.getElementById('dash-news-count').textContent = (state.news?.length || 0);
  document.getElementById('dash-gallery-count').textContent = (state.gallery?.length || 0);
  document.getElementById('dash-toppers-count').textContent = (state.toppers?.length || 0);
  document.getElementById('dash-faculty-count').textContent = (state.faculty?.length || 0);
}

// ── NEWS ──────────────────────────────────────────────────────
function renderNews() {
  const list = document.getElementById('newsList');
  const items = state.news || [];
  list.innerHTML = items.length === 0
    ? `<p style="color:var(--admin-muted);text-align:center;padding:2rem">No news items yet.</p>`
    : items.map((item, i) => `
      <div class="list-item" data-id="${item.id}">
        <div class="list-item-drag">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
        <div class="list-item-content">
          <div class="list-item-title">${item.text}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn-icon edit" title="Edit" onclick="editNews(${i})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon delete" title="Delete" onclick="deleteNews(${i})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
}

window.editNews = function(i) {
  editingItem = i;
  const item = state.news[i];
  document.getElementById('newsModalTitle').textContent = 'Edit News Item';
  document.getElementById('newsText').value = item.text;
  openModal('newsModal');
};
window.deleteNews = async function(i) {
  if (!confirm('Delete this news item?')) return;
  state.news.splice(i, 1);
  await saveSection('news', { items: state.news });
  state.news = state.news; // already updated
  renderNews();
};

document.getElementById('addNewsBtn')?.addEventListener('click', () => {
  editingItem = null;
  document.getElementById('newsModalTitle').textContent = 'Add News Item';
  document.getElementById('newsText').value = '';
  openModal('newsModal');
});

document.getElementById('saveNewsItem')?.addEventListener('click', async () => {
  const text = document.getElementById('newsText').value.trim();
  if (!text) { toast('News text cannot be empty.', 'error'); return; }
  if (!state.news) state.news = [];
  if (editingItem !== null) {
    state.news[editingItem].text = text;
  } else {
    state.news.push({ id: Date.now(), text });
  }
  await saveSection('news', { items: state.news });
  closeModal('newsModal');
  renderNews();
  renderDashboard();
});

// ── ADMISSION ─────────────────────────────────────────────────
function renderAdmission() {
  const d = state.admission || DEFAULTS.admission;
  document.getElementById('admissionTitle').value = d.title || '';
  document.getElementById('admissionDocs').value = (d.documents || []).join('\n');
}

document.getElementById('saveAdmission')?.addEventListener('click', async () => {
  const title = document.getElementById('admissionTitle').value.trim();
  const docs = document.getElementById('admissionDocs').value
    .split('\n').map(s => s.trim()).filter(Boolean);
  if (!title) { toast('Title cannot be empty.', 'error'); return; }
  await saveSection('admission', { title, documents: docs });
});

// ── TOPPERS ───────────────────────────────────────────────────
function renderToppers() {
  const list = document.getElementById('toppersList');
  const items = state.toppers || [];
  list.innerHTML = items.length === 0
    ? `<p style="color:var(--admin-muted);text-align:center;padding:2rem">No toppers added yet.</p>`
    : items.map((t, i) => `
      <div class="list-item">
        <div class="list-item-content">
          <div class="list-item-title">${t.rank} — ${t.name}</div>
          <div class="list-item-sub">Class ${t.class} | ${t.score}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn-icon edit" title="Edit" onclick="editTopper(${i})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon delete" title="Delete" onclick="deleteTopper(${i})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
}

window.editTopper = function(i) {
  editingItem = i;
  const t = state.toppers[i];
  document.getElementById('topperModalTitle').textContent = 'Edit Topper';
  document.getElementById('topperRank').value = t.rank;
  document.getElementById('topperName').value = t.name;
  document.getElementById('topperClass').value = t.class;
  document.getElementById('topperScore').value = t.score;
  openModal('topperModal');
};
window.deleteTopper = async function(i) {
  if (!confirm('Delete this topper?')) return;
  state.toppers.splice(i, 1);
  await saveSection('toppers', { items: state.toppers });
  renderToppers();
  renderDashboard();
};

document.getElementById('addTopperBtn')?.addEventListener('click', () => {
  editingItem = null;
  document.getElementById('topperModalTitle').textContent = 'Add Topper';
  ['topperRank','topperName','topperClass','topperScore'].forEach(id => document.getElementById(id).value = '');
  openModal('topperModal');
});

document.getElementById('saveTopperItem')?.addEventListener('click', async () => {
  const rank  = document.getElementById('topperRank').value.trim();
  const name  = document.getElementById('topperName').value.trim();
  const cls   = document.getElementById('topperClass').value.trim();
  const score = document.getElementById('topperScore').value.trim();
  if (!name || !rank) { toast('Name and rank are required.', 'error'); return; }
  if (!state.toppers) state.toppers = [];
  const entry = { id: Date.now(), rank, name, class: cls, score };
  if (editingItem !== null) state.toppers[editingItem] = entry;
  else state.toppers.push(entry);
  await saveSection('toppers', { items: state.toppers });
  closeModal('topperModal');
  renderToppers();
  renderDashboard();
});

// ── GALLERY ───────────────────────────────────────────────────
function renderGallery() {
  const grid = document.getElementById('galleryAdminGrid');
  const items = state.gallery || [];
  grid.innerHTML = items.map((g, i) => `
    <div class="gallery-thumb">
      <img src="${g.url}" alt="${g.caption}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'75\\'><rect fill=\\'%23122448\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23666\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>No Image</text></svg>'">
      <span class="gallery-category-tag">${g.category || 'general'}</span>
      <div class="gallery-thumb-overlay">
        <div class="gallery-thumb-caption">${g.caption}</div>
      </div>
      <button class="gallery-del-btn" onclick="deleteGallery(${i})" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('') + `
    <div class="gallery-add-card" onclick="document.getElementById('addGalleryBtn').click()">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Photo
    </div>
  `;
  document.getElementById('galleryCount').textContent = `${items.length} photos`;
}

window.deleteGallery = async function(i) {
  if (!confirm('Delete this photo?')) return;
  state.gallery.splice(i, 1);
  await saveSection('gallery', { items: state.gallery });
  renderGallery();
  renderDashboard();
};

document.getElementById('addGalleryBtn')?.addEventListener('click', () => {
  document.getElementById('galleryUrl').value = '';
  document.getElementById('galleryCaption').value = '';
  document.getElementById('galleryCategory').value = 'campus';
  document.getElementById('galleryPreview').style.display = 'none';
  openModal('galleryModal');
});

document.getElementById('galleryUrl')?.addEventListener('input', (e) => {
  const url = e.target.value.trim();
  const preview = document.getElementById('galleryPreview');
  if (url) {
    preview.src = url;
    preview.style.display = 'block';
    preview.onerror = () => preview.style.display = 'none';
  } else {
    preview.style.display = 'none';
  }
});

document.getElementById('saveGalleryItem')?.addEventListener('click', async () => {
  const url = document.getElementById('galleryUrl').value.trim();
  const caption = document.getElementById('galleryCaption').value.trim();
  const category = document.getElementById('galleryCategory').value;
  if (!url) { toast('Photo URL is required.', 'error'); return; }
  if (!state.gallery) state.gallery = [];
  state.gallery.push({ id: Date.now(), url, caption: caption || 'Photo', category });
  await saveSection('gallery', { items: state.gallery });
  closeModal('galleryModal');
  renderGallery();
  renderDashboard();
});

// ── HOURS ─────────────────────────────────────────────────────
function renderHours() {
  const h = state.hours || DEFAULTS.hours;
  Object.keys(h).forEach(k => {
    const el = document.getElementById(`hours_${k}`);
    if (el) el.value = h[k];
  });
}

document.getElementById('saveHours')?.addEventListener('click', async () => {
  const fields = ['regularWeekday','regularSaturday','summerWeekday','summerSaturday','officeWeekday','officeSaturday'];
  const data = {};
  fields.forEach(f => data[f] = document.getElementById(`hours_${f}`)?.value.trim() || '');
  await saveSection('hours', data);
});

// ── CONTACT ───────────────────────────────────────────────────
function renderContact() {
  const c = state.contact || DEFAULTS.contact;
  Object.keys(c).forEach(k => {
    const el = document.getElementById(`contact_${k}`);
    if (el) el.value = c[k];
  });
}

document.getElementById('saveContact')?.addEventListener('click', async () => {
  const fields = ['phone','principal','juniorSection','seniorSection','email','adminEmail','address'];
  const data = {};
  fields.forEach(f => data[f] = document.getElementById(`contact_${f}`)?.value.trim() || '');
  await saveSection('contact', data);
});

// ── FACULTY ───────────────────────────────────────────────────
function renderFaculty() {
  const list = document.getElementById('facultyList');
  const items = state.faculty || [];
  list.innerHTML = items.length === 0
    ? `<p style="color:var(--admin-muted);text-align:center;padding:2rem">No faculty members added.</p>`
    : items.map((f, i) => `
      <div class="list-item">
        <div class="list-item-content">
          <div class="list-item-title">${f.name}</div>
          <div class="list-item-sub">${f.designation} — ${f.department}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn-icon edit" onclick="editFaculty(${i})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon delete" onclick="deleteFaculty(${i})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
}

window.editFaculty = function(i) {
  editingItem = i;
  const f = state.faculty[i];
  document.getElementById('facultyModalTitle').textContent = 'Edit Faculty';
  document.getElementById('facultyName').value = f.name;
  document.getElementById('facultyDesignation').value = f.designation;
  document.getElementById('facultyDepartment').value = f.department;
  openModal('facultyModal');
};
window.deleteFaculty = async function(i) {
  if (!confirm('Remove this faculty member?')) return;
  state.faculty.splice(i, 1);
  await saveSection('faculty', { items: state.faculty });
  renderFaculty();
  renderDashboard();
};

document.getElementById('addFacultyBtn')?.addEventListener('click', () => {
  editingItem = null;
  document.getElementById('facultyModalTitle').textContent = 'Add Faculty Member';
  ['facultyName','facultyDesignation','facultyDepartment'].forEach(id => document.getElementById(id).value = '');
  openModal('facultyModal');
});

document.getElementById('saveFacultyItem')?.addEventListener('click', async () => {
  const name = document.getElementById('facultyName').value.trim();
  const designation = document.getElementById('facultyDesignation').value.trim();
  const department = document.getElementById('facultyDepartment').value.trim();
  if (!name) { toast('Faculty name is required.', 'error'); return; }
  if (!state.faculty) state.faculty = [];
  const entry = { id: Date.now(), name, designation, department };
  if (editingItem !== null) state.faculty[editingItem] = entry;
  else state.faculty.push(entry);
  await saveSection('faculty', { items: state.faculty });
  closeModal('facultyModal');
  renderFaculty();
  renderDashboard();
});

// ── PRINCIPAL ─────────────────────────────────────────────────
function renderPrincipal() {
  const p = state.principal || DEFAULTS.principal;
  document.getElementById('principalName').value = p.name || '';
  document.getElementById('principalTitle').value = p.title || '';
  document.getElementById('principalPhoto').value = p.photoUrl || '';
  document.getElementById('principalMsgTitle').value = p.messageTitle || '';
  document.getElementById('principalMessage').value = p.message || '';
  const prev = document.getElementById('principalPhotoPreview');
  if (p.photoUrl) { prev.src = p.photoUrl; prev.style.display = 'block'; }
}

document.getElementById('principalPhoto')?.addEventListener('input', (e) => {
  const prev = document.getElementById('principalPhotoPreview');
  prev.src = e.target.value.trim();
  prev.style.display = e.target.value.trim() ? 'block' : 'none';
  prev.onerror = () => prev.style.display = 'none';
});

document.getElementById('savePrincipal')?.addEventListener('click', async () => {
  const data = {
    name: document.getElementById('principalName').value.trim(),
    title: document.getElementById('principalTitle').value.trim(),
    photoUrl: document.getElementById('principalPhoto').value.trim(),
    messageTitle: document.getElementById('principalMsgTitle').value.trim(),
    message: document.getElementById('principalMessage').value.trim()
  };
  await saveSection('principal', data);
});

// ── Spin animation ────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } .spin{animation:spin 1s linear infinite}`;
document.head.appendChild(style);

// ── Boot ─────────────────────────────────────────────────────
init();
