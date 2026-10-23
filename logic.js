/**
 * ============================================================================
 * "FOR YOU, MY LOVE ❤️" — COMPLETE MULTI-PAGE ROUTER & ROMANTIC LOGIC ENGINE
 * ============================================================================
 * High-performance, zero-dependency, mobile-optimized JavaScript engine:
 * 1. 7-Page Sequential Router with strict route guarding & patience toast
 * 2. State & Progression persistence via localStorage
 * 3. Dynamic content renderers for Pages 1 through 7
 * 4. Interactive Photo Upload & Lightbox (Base64 + localStorage persistence)
 * 5. Animated 3D Wax-sealed letter unfolding & inline editor
 * 6. Cake Candle Blow / Relight interactive physics & celebration fireworks
 * 7. Story & Personalization Editor Drawer with JSON Config export
 * 8. Ambient Rose Petals, Hearts, and Twinkling Particle Canvas
 * 9. Native Web Audio Romantic Ambient Melody & Interaction Chimes
 * ============================================================================
 */

// Application State
const state = {
  unlockedPage: 1, // Max page unlocked (1-7)
  currentPage: 1,  // Currently active page (1-7)
  config: null,    // User config merged with DEFAULT_CONFIG
  audio: {
    enabled: false,
    ctx: null,
    intervalId: null
  },
  lightbox: {
    activeCategory: 'her',
    currentIndex: 0,
    photos: []
  },
  uploadPending: {
    base64: null,
    filename: null
  },
  letterRevealed: false,
  candlesBlown: false,
  cinematicRan: false
};

// Route Definitions
const ROUTES = [
  { page: 1, route: 'welcome', title: 'The Mysterious Welcome' },
  { page: 2, route: 'surprise', title: 'A Little Surprise for You' },
  { page: 3, route: 'her', title: 'Just You, Being You' },
  { page: 4, route: 'our-memories', title: 'Our Little World' },
  { page: 5, route: 'reasons', title: 'Things I Want You to Know' },
  { page: 6, route: 'love-letter', title: 'A Letter From My Heart' },
  { page: 7, route: 'final-surprise', title: 'The Ultimate Birthday Surprise' }
];

// ============================================================================
// 1. INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initStorageAndConfig();
  initParticleAtmosphere();
  initRouter();
  renderAllDynamicContent();
  bindGlobalEvents();
  initUploadDropzone();
  initCloudDatabaseSync();
});

function initStorageAndConfig() {
  // Load Unlocked Chapter from localStorage
  const savedUnlocked = localStorage.getItem('for_you_unlocked');
  if (savedUnlocked) {
    const num = parseInt(savedUnlocked, 10);
    if (!isNaN(num) && num >= 1 && num <= 7) {
      state.unlockedPage = num;
    }
  }

  // Load Custom Config or Fallback to DEFAULT_CONFIG
  const savedConfig = localStorage.getItem('for_you_config');
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig);
      state.config = deepMerge(DEFAULT_CONFIG, parsed);
    } catch (e) {
      console.warn('Could not parse saved config, using default config:', e);
      state.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
  } else {
    state.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }

  // Ensure unique nicknames on page5 reasons (Priyanka, Riya, Sona, Koto ma, Tuktuki, Layli)
  if (state.config && state.config.page5 && Array.isArray(state.config.page5.reasons)) {
    const defaultNicknames = ['Priyanka', 'Riya', 'Sona', 'Koto ma', 'Tuktuki', 'Layli'];
    state.config.page5.reasons.forEach((r, i) => {
      if (!r.name && defaultNicknames[i]) {
        r.name = defaultNicknames[i];
      }
    });
  }
}

function saveConfigToStorage() {
  try {
    localStorage.setItem('for_you_config', JSON.stringify(state.config));
  } catch (e) {
    console.error('Failed to save config to localStorage:', e);
    showToast('Storage limit reached! Please use smaller images for uploads.', 'warning');
  }
}

function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// ============================================================================
// 2. MULTI-PAGE SEQUENTIAL ROUTER & ACCESS GUARD
// ============================================================================
function initRouter() {
  window.addEventListener('hashchange', handleHashChange);
  
  if (!window.location.hash) {
    window.location.hash = '#/' + ROUTES[0].route;
  } else {
    handleHashChange();
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const matchedRoute = ROUTES.find(r => r.route === hash);

  if (!matchedRoute) {
    navigateToPage(state.unlockedPage, false);
    return;
  }

  // Strict Sequential Route Guard:
  // Cannot jump ahead to pages greater than state.unlockedPage
  if (matchedRoute.page > state.unlockedPage) {
    showToast(`Patience, my love ❤️ Complete Chapter ${state.unlockedPage} first to unlock this secret!`, 'romantic');
    playTone(280, 0.25, 'sine');
    // Force redirect back to current unlocked page
    navigateToPage(state.unlockedPage, false);
    return;
  }

  // Transition to allowed page
  transitionToPage(matchedRoute.page);
}

function navigateToPage(pageIndex, pushHash = true) {
  const target = ROUTES.find(r => r.page === pageIndex);
  if (!target) return;

  if (pushHash) {
    window.location.hash = '#/' + target.route;
  } else {
    history.replaceState(null, '', '#/' + target.route);
    transitionToPage(pageIndex);
  }
}

function transitionToPage(pageIndex) {
  state.currentPage = pageIndex;

  // Update Page DOM elements
  const allPages = document.querySelectorAll('.page-view');
  allPages.forEach(p => {
    p.classList.remove('active', 'page-slide-in', 'page-fade-in');
  });

  const targetElem = document.getElementById(`page-${pageIndex}`);
  if (targetElem) {
    targetElem.classList.add('active', 'page-fade-in');
  }

  // Update Chapter Tracker Header
  updateChapterTracker(pageIndex);

  // Trigger page-specific actions
  onPageActivated(pageIndex);

  // Smooth scroll back to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateChapterTracker(pageIndex) {
  const chapter = ROUTES.find(r => r.page === pageIndex);
  const badge = document.getElementById('chapter-badge');
  const name = document.getElementById('chapter-name');

  if (badge) badge.textContent = `Chapter ${pageIndex} of 7`;
  if (name && chapter) name.textContent = chapter.title;

  // Update Navigation Dots
  const dots = document.querySelectorAll('.chapter-dot');
  dots.forEach(dot => {
    const dotPage = parseInt(dot.getAttribute('data-page'), 10);
    dot.classList.remove('active', 'locked', 'completed');

    if (dotPage === pageIndex) {
      dot.classList.add('active');
    } else if (dotPage < pageIndex || dotPage <= state.unlockedPage) {
      dot.classList.add('completed');
    } else {
      dot.classList.add('locked');
    }

    const lockIcon = dot.querySelector('.dot-lock');
    if (lockIcon) {
      lockIcon.style.display = dotPage > state.unlockedPage ? 'inline' : 'none';
    }
  });
}

function advanceToNextPage(nextPageIndex) {
  if (nextPageIndex > state.unlockedPage) {
    state.unlockedPage = nextPageIndex;
    localStorage.setItem('for_you_unlocked', state.unlockedPage);
    playChimeCelebration();
    showToast(`✨ Chapter ${nextPageIndex} Unlocked!`, 'success');
  }

  navigateToPage(nextPageIndex, true);
}

function onPageActivated(pageIndex) {
  switch (pageIndex) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      renderHerGallery();
      break;
    case 4:
      renderCoupleScrapbook();
      break;
    case 5:
      renderReasonsList();
      break;
    case 6:
      renderLetterDetails();
      break;
    case 7:
      initiateFinalCinematicSequence();
      break;
  }
}

// ============================================================================
// 3. DYNAMIC CONTENT RENDERERS
// ============================================================================
function renderAllDynamicContent() {
  renderPage1();
  renderPage2();
  renderHerGallery();
  renderCoupleScrapbook();
  renderReasonsList();
  renderLetterDetails();
  renderPage7();
}

function renderPage1() {
  const p1 = state.config.page1;
  const badge = document.getElementById('p1-badge');
  const greeting = document.getElementById('p1-greeting');
  const line1 = document.getElementById('p1-line1');
  const line2 = document.getElementById('p1-line2');
  const question = document.getElementById('p1-question');
  const btnText = document.getElementById('p1-btn-text');
  const portraitImg = document.getElementById('p1-portrait-img');
  const portraitStage = document.getElementById('p1-portrait-stage');

  if (badge) badge.innerHTML = `<span>✨</span><span>${escapeHtml(p1.badge)}</span><span>✨</span>`;
  if (greeting) greeting.innerHTML = `${escapeHtml(p1.greeting)} <span class="heart-pulse">❤️</span>`;
  if (line1) line1.textContent = p1.line1;
  if (line2) line2.textContent = p1.line2;
  if (question) question.textContent = p1.question;
  if (btnText) btnText.textContent = p1.buttonText;
  if (portraitImg && p1.portrait) {
    portraitImg.src = p1.portrait;
    if (portraitStage) portraitStage.style.display = 'flex';
  }
}

function renderPage2() {
  const p2 = state.config.page2;
  const badge = document.getElementById('p2-badge');
  const heading = document.getElementById('p2-heading');
  const quote = document.getElementById('p2-quote');
  const message = document.getElementById('p2-message');
  const hint = document.getElementById('p2-hint');
  const btnText = document.getElementById('p2-btn-text');
  const photoImg = document.getElementById('p2-photo-img');
  const photoFrame = document.getElementById('p2-photo-frame');

  if (badge) badge.innerHTML = `<span>🌸</span><span>${escapeHtml(p2.badge)}</span><span>🌸</span>`;
  if (heading) heading.textContent = p2.heading;
  if (quote) quote.textContent = `"${p2.quote}"`;
  if (message) message.textContent = p2.message;
  if (hint) hint.textContent = p2.hint;
  if (btnText) btnText.textContent = p2.buttonText;
  if (photoImg && p2.photo) {
    photoImg.src = p2.photo;
    if (photoFrame) photoFrame.style.display = 'block';
  }
}

function revealHeartMessage() {
  const heart = document.getElementById('illuminated-heart');
  const promptText = document.getElementById('heart-reveal-prompt');
  const msgBox = document.getElementById('surprise-message-box');

  if (heart) heart.classList.add('revealed');
  if (promptText) promptText.style.display = 'none';
  if (msgBox) {
    msgBox.classList.add('revealed');
    msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  playTone(523.25, 0.4, 'sine'); // C5
  triggerHeartBursts(window.innerWidth / 2, window.innerHeight / 2, 8);
}

// --- Page 3: Her Personal Photo Gallery ---
function renderHerGallery() {
  const p3 = state.config.page3;
  const badge = document.getElementById('p3-badge');
  const heading = document.getElementById('p3-heading');
  const subtitle = document.getElementById('p3-subtitle');
  const bottomNote = document.getElementById('p3-bottom-note');
  const btnText = document.getElementById('p3-btn-text');
  const counter = document.getElementById('her-photo-counter');
  const grid = document.getElementById('her-photo-grid') || document.getElementById('her-gallery-grid');

  if (badge) badge.innerHTML = `<span>✨</span><span>${escapeHtml(p3.badge)}</span><span>✨</span>`;
  if (heading) heading.textContent = p3.heading;
  if (subtitle) subtitle.textContent = p3.subtitle;
  if (bottomNote) bottomNote.textContent = p3.bottomNote;
  if (btnText) btnText.textContent = p3.buttonText;

  const photos = p3.photos || [];
  if (counter) counter.textContent = `Showing ${photos.length} photograph${photos.length === 1 ? '' : 's'}`;

  if (!grid) return;
  grid.innerHTML = '';

  photos.forEach((photo) => {
    const card = document.createElement('div');
    card.className = 'her-photo-card photo-card-romantic';
    card.innerHTML = `
      <div class="her-photo-frame photo-img-wrap" onclick="openPhotoLightbox('${photo.id}', 'her')">
        <img src="${photo.src}" alt="${escapeHtml(photo.caption)}" loading="lazy">
        <div class="photo-overlay-glass">
          <span class="expand-icon">🔍 View Full Size</span>
        </div>
        ${photo.tag ? `<span class="her-card-tag photo-tag-pill">${escapeHtml(photo.tag)}</span>` : ''}
      </div>
      <div class="her-caption-wrap photo-card-info">
        <p class="her-caption-text photo-caption-text">${escapeHtml(photo.caption)}</p>
        <div class="photo-card-actions">
          <button class="btn-caption-edit" onclick="editPhotoCaption('${photo.id}', 'her', event)" title="Edit Caption">✏️ Edit</button>
          <button class="btn-card-delete" onclick="deletePhoto('${photo.id}', 'her', event)" title="Delete Photo">🗑️</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // "+ Add Photograph" card
  const addCard = document.createElement('div');
  addCard.className = 'her-photo-card photo-card-romantic add-card';
  addCard.onclick = () => openUploadModal('her');
  addCard.innerHTML = `
    <div class="add-card-content">
      <div class="add-card-icon">📸</div>
      <h4 class="add-card-title">Add Photograph</h4>
      <p class="add-card-desc">Upload a picture of ${escapeHtml(state.config.recipientName)}</p>
      <button class="btn-add-action">+ Upload Picture</button>
    </div>
  `;
  grid.appendChild(addCard);
}

// --- Page 4: Couple Polaroid Scrapbook ---
function renderCoupleScrapbook() {
  const p4 = state.config.page4;
  const badge = document.getElementById('p4-badge');
  const heading = document.getElementById('p4-heading');
  const quote = document.getElementById('p4-quote');
  const bottomNote = document.getElementById('p4-bottom-note');
  const btnText = document.getElementById('p4-btn-text');
  const counter = document.getElementById('couple-photo-counter');
  const grid = document.getElementById('scrapbook-polaroid-grid') || document.getElementById('couple-scrapbook-grid');

  if (badge) badge.innerHTML = `<span>💑</span><span>${escapeHtml(p4.badge)}</span><span>💑</span>`;
  if (heading) heading.textContent = p4.heading;
  if (quote) quote.textContent = `"${p4.quote}"`;
  if (bottomNote) bottomNote.textContent = p4.bottomNote;
  if (btnText) btnText.textContent = p4.buttonText;

  const photos = p4.photos || [];
  if (counter) counter.textContent = `Showing ${photos.length} memor${photos.length === 1 ? 'y' : 'ies'}`;

  if (!grid) return;
  grid.innerHTML = '';

  photos.forEach((photo, idx) => {
    const tilts = [-2, 1.8, -1.2, 2.2, -1.5, 1.4];
    const tilt = tilts[idx % tilts.length];

    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid-card scrapbook-polaroid';
    polaroid.style.transform = `rotate(${tilt}deg)`;
    polaroid.innerHTML = `
      <div class="polaroid-tape washi-tape"></div>
      <div class="polaroid-frame polaroid-photo-wrap" onclick="openPhotoLightbox('${photo.id}', 'couple')">
        <img src="${photo.src}" alt="${escapeHtml(photo.caption)}" loading="lazy">
        <div class="polaroid-overlay">
          <span>🔍 View Moment</span>
        </div>
      </div>
      <div class="polaroid-caption-area polaroid-footer">
        <p class="polaroid-caption">${escapeHtml(photo.caption)}</p>
        <div class="polaroid-meta polaroid-meta-row">
          <span class="polaroid-date">📅 ${escapeHtml(photo.date || 'Sweet Memory')}</span>
          ${photo.location ? `<span class="polaroid-location">📍 ${escapeHtml(photo.location)}</span>` : ''}
        </div>
        <div class="polaroid-actions">
          <button class="btn-polaroid-edit" onclick="editPhotoCaption('${photo.id}', 'couple', event)" title="Edit Memory">✏️ Edit</button>
          <button class="btn-polaroid-delete" onclick="deletePhoto('${photo.id}', 'couple', event)" title="Delete Memory">🗑️</button>
        </div>
      </div>
    `;
    grid.appendChild(polaroid);
  });

  // "+ Add Our Memory" scrapbook card
  const addPolaroid = document.createElement('div');
  addPolaroid.className = 'polaroid-card scrapbook-polaroid add-polaroid';
  addPolaroid.onclick = () => openUploadModal('couple');
  addPolaroid.innerHTML = `
    <div class="polaroid-tape washi-tape"></div>
    <div class="add-polaroid-content">
      <div class="add-polaroid-icon">💑</div>
      <h4 class="add-polaroid-title">Add Couple Memory</h4>
      <p class="add-polaroid-sub">Upload a picture of the two of you</p>
      <button class="btn-add-action">+ Add Polaroid</button>
    </div>
  `;
  grid.appendChild(addPolaroid);
}

// --- Page 5: Reasons / Things I Want You to Know (Heartfelt Wishes with GF Profile Pictures) ---
function showDirectImagePreview(src, title) {
  state.lightbox.activeCategory = 'preview';
  state.lightbox.photos = [{
    id: 'preview-' + Date.now(),
    src: src,
    caption: title || state.config.recipientName,
    date: 'Heartfelt Wish for You ❤️'
  }];
  state.lightbox.currentIndex = 0;
  renderActiveLightboxPhoto();

  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function renderReasonsList() {
  const p5 = state.config.page5;
  const badge = document.getElementById('p5-badge');
  const heading = document.getElementById('p5-heading');
  const subtitle = document.getElementById('p5-subtitle');
  const bottomNote = document.getElementById('p5-bottom-note');
  const btnText = document.getElementById('p5-btn-text');
  const container = document.getElementById('reasons-cards-grid') || document.getElementById('reasons-cards-container');

  if (badge) badge.innerHTML = `<span>💌</span><span>${escapeHtml(p5.badge)}</span><span>💌</span>`;
  if (heading) heading.textContent = p5.heading;
  if (subtitle) subtitle.textContent = p5.subtitle;
  if (bottomNote) bottomNote.textContent = p5.bottomNote;
  if (btnText) btnText.textContent = p5.buttonText;

  // Render Girlfriend Profile Spotlight
  const profileAvatar = document.getElementById('p5-profile-avatar');
  const gfName = document.getElementById('p5-gf-name');
  const gfTagline = document.getElementById('p5-gf-tagline');
  if (profileAvatar) {
    profileAvatar.src = p5.profileAvatar || 'photo1.jpeg';
    profileAvatar.onclick = () => showDirectImagePreview(profileAvatar.src, `${state.config.recipientName} ❤️`);
  }
  if (gfName) gfName.textContent = `${state.config.recipientName} ❤️`;
  if (gfTagline && p5.profileTagline) gfTagline.textContent = p5.profileTagline;

  if (!container) return;
  container.innerHTML = '';

  const defaultNicknames = ['Priyanka', 'Riya', 'Sona', 'Koto ma', 'Tuktuki', 'Layli'];
  const defaultAvatars = ['photo1.jpeg', 'photo2.jpeg', 'photo3.jpeg', 'photo5.jpeg'];
  const defaultTags = ['My Sunshine ☀️', 'Pure Grace 🌸', 'Endless Radiance ✨', 'Forever Cherished 💖', 'My Queen 👑', 'My Safest Harbor 💫'];

  const reasons = p5.reasons || [];
  reasons.forEach((reason, idx) => {
    const avatarSrc = reason.avatar || defaultAvatars[idx % defaultAvatars.length];
    const reasonTag = reason.tag || defaultTags[idx % defaultTags.length];
    const cardGfName = reason.name || defaultNicknames[idx % defaultNicknames.length] || state.config.recipientName;

    const card = document.createElement('div');
    card.className = 'reason-card reason-card-romantic';
    card.innerHTML = `
      <div class="wish-card-profile-header">
        <div class="wish-avatar-wrap" onclick="showDirectImagePreview('${avatarSrc}', '${escapeHtml(reason.title)}')" title="Click to view photograph">
          <img src="${avatarSrc}" alt="${escapeHtml(reason.title)}" class="wish-avatar-img">
          <span class="wish-avatar-icon">${escapeHtml(reason.icon || '❤️')}</span>
        </div>
        <div class="wish-profile-meta">
          <div class="wish-name-row">
            <span class="wish-gf-name">${escapeHtml(cardGfName)}</span>
            <span class="wish-tag-badge">${escapeHtml(reasonTag)}</span>
          </div>
          <span class="reason-num">#0${idx + 1}</span>
        </div>
      </div>
      <div class="wish-content-body">
        <h4 class="reason-title">${escapeHtml(reason.title)}</h4>
        <p class="reason-text">${escapeHtml(reason.text)}</p>
      </div>
      <div class="reason-card-actions">
        <button class="btn-reason-edit" onclick="editReason('${reason.id}', event)">✏️ Edit Wish</button>
        <button class="btn-reason-delete" onclick="deleteReason('${reason.id}', event)">🗑️</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addNewReasonPrompt() {
  const name = prompt('Enter name/nickname for this card (e.g., Priyanka, Riya, Sona, Koto ma, Tuktuki, Layli):') || state.config.recipientName;
  const title = prompt('Enter a title for this wish (e.g., "Your Sweet Smile"):');
  if (!title) return;
  const text = prompt('Enter the wish or message content:');
  if (!text) return;
  const icon = prompt('Enter an emoji icon (e.g., 💖, 🌸, ✨, 🌟, 👑):') || '❤️';
  const tag = prompt('Enter a little tag (e.g., "My Sunshine ☀️", "My Queen 👑"):') || 'Special Wish ✨';
  const avatar = prompt('Enter picture filename for profile photo (e.g., photo1.jpeg, photo2.jpeg, photo3.jpeg, photo5.jpeg):') || 'photo1.jpeg';

  const newReason = {
    id: 'reason-' + Date.now(),
    name: name.trim(),
    avatar: avatar.trim() || 'photo1.jpeg',
    icon,
    tag,
    title,
    text
  };

  state.config.page5.reasons.push(newReason);
  saveConfigToStorage();
  renderReasonsList();
  showToast('✨ Added new heartfelt wish!', 'success');
}

function editReason(reasonId, event) {
  if (event) event.stopPropagation();
  const r = state.config.page5.reasons.find(item => item.id === reasonId);
  if (!r) return;

  const newName = prompt('Edit Name/Nickname on Card (e.g. Priyanka, Riya, Sona, Koto ma, Tuktuki, Layli):', r.name || state.config.recipientName);
  if (newName !== null) r.name = newName.trim();
  const newTitle = prompt('Edit Wish Title:', r.title);
  if (newTitle === null) return;
  const newText = prompt('Edit Wish Content:', r.text);
  if (newText === null) return;
  const newTag = prompt('Edit Tag (e.g., "My Queen 👑"):', r.tag || 'Wish for You ✨');
  const newIcon = prompt('Edit Emoji Icon:', r.icon || '❤️');
  const newAvatar = prompt('Edit Picture Filename:', r.avatar || 'photo1.jpeg');

  r.title = newTitle.trim() || r.title;
  r.text = newText.trim() || r.text;
  if (newTag) r.tag = newTag.trim();
  if (newIcon) r.icon = newIcon.trim();
  if (newAvatar) r.avatar = newAvatar.trim();

  saveConfigToStorage();
  renderReasonsList();
  showToast('Saved wish changes!', 'success');
}

function deleteReason(reasonId, event) {
  if (event) event.stopPropagation();
  if (!confirm('Are you sure you want to remove this wish?')) return;

  state.config.page5.reasons = state.config.page5.reasons.filter(r => r.id !== reasonId);
  saveConfigToStorage();
  renderReasonsList();
  showToast('Wish removed', 'info');
}

// --- Page 6: Letter Details & Envelope ---
function renderLetterDetails() {
  const p6 = state.config.page6;
  const badge = document.getElementById('p6-badge');
  const title = document.getElementById('p6-prompt-title');
  const subtitle = document.getElementById('p6-prompt-subtitle');
  const salutation = document.getElementById('letter-salutation');
  const bodyElem = document.getElementById('letter-body-paragraphs');
  const signature = document.getElementById('letter-signature');
  const bottomNote = document.getElementById('p6-bottom-note');
  const btnText = document.getElementById('p6-btn-text');

  if (badge) badge.innerHTML = `<span>🕊️</span><span>${escapeHtml(p6.badge)}</span><span>🕊️</span>`;
  if (title) title.textContent = p6.title;
  if (subtitle) subtitle.textContent = p6.subtitle;
  if (bottomNote) bottomNote.textContent = p6.bottomNote;
  if (btnText) btnText.textContent = p6.buttonText;

  if (salutation) {
    salutation.textContent = p6.salutation || `My Dearest ${state.config.recipientName},`;
  }

  if (bodyElem) {
    bodyElem.innerHTML = '';
    const paras = p6.paragraphs || [];
    paras.forEach(p => {
      const pElem = document.createElement('p');
      pElem.textContent = p;
      bodyElem.appendChild(pElem);
    });
  }

  if (signature) signature.textContent = p6.signature || state.config.senderName;

  const keepsakeImg = document.getElementById('letter-keepsake-img');
  const keepsakeFrame = document.getElementById('letter-keepsake-frame');
  if (keepsakeImg && p6.keepsakePhoto) {
    keepsakeImg.src = p6.keepsakePhoto;
    if (keepsakeFrame) keepsakeFrame.style.display = 'block';
  }
}

function openLoveLetterEnvelope() {
  const envelope = document.getElementById('envelope-box');
  const footer = document.getElementById('letter-nav-footer');

  if (envelope) {
    envelope.classList.add('opened');
  }

  state.letterRevealed = true;
  playChimeCelebration();
  showToast('💌 Unfolding your romantic letter...', 'romantic');

  setTimeout(() => {
    if (footer) {
      footer.classList.add('revealed');
      footer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 900);
}

function openLetterEditorModal() {
  openStoryEditor();
}

// --- Page 7: The Ultimate Birthday Surprise ---
function renderPage7() {
  const p7 = state.config.page7;
  const nameSpan = document.getElementById('finale-name-span');
  const dateTag = document.getElementById('finale-date-tag');
  const cakePillText = document.getElementById('cake-pill-text');
  const finalMsg = document.getElementById('finale-final-message');
  const signature = document.getElementById('finale-sender-signature');
  const spotlightImg = document.getElementById('finale-couple-img');
  const spotlightCaption = document.getElementById('finale-couple-caption');

  if (nameSpan) nameSpan.textContent = `${state.config.recipientName.toUpperCase()} ❤️`;
  if (dateTag) dateTag.innerHTML = `<span>🎂 ${escapeHtml(state.config.birthdayDate.toUpperCase())} 🎂</span>`;
  if (cakePillText) cakePillText.textContent = `${state.config.recipientName}'s 20th Birthday Cake`;
  if (finalMsg) finalMsg.textContent = `"${p7.finalMessage}"`;
  if (signature) signature.textContent = p7.finalSignature || state.config.senderName;

  if (spotlightImg) {
    spotlightImg.src = p7.spotlightPhoto || 'photo4.jpeg';
  }
  if (spotlightCaption && p7.spotlightCaption) {
    spotlightCaption.innerHTML = `<span>"${escapeHtml(p7.spotlightCaption)}" ❤️</span>`;
  }
}

function initiateFinalCinematicSequence() {
  const intro = document.getElementById('finale-cinematic-intro');
  const stage = document.getElementById('finale-celebration-stage');

  if (!intro || !stage) return;

  // If already ran or already completed, show directly
  if (state.cinematicRan) {
    intro.style.display = 'none';
    stage.classList.add('active');
    return;
  }

  state.cinematicRan = true;
  intro.style.display = 'flex';
  stage.classList.remove('active');

  // Trigger celebration stage after 6.5s of poetic cinematic lines
  setTimeout(() => {
    intro.style.transition = 'opacity 0.8s ease';
    intro.style.opacity = '0';

    setTimeout(() => {
      intro.style.display = 'none';
      stage.classList.add('active');
      playChimeCelebration();
      triggerConfettiBurst();
    }, 800);
  }, 6500);
}

// ============================================================================
// 4. CANDLE BLOWING & CAKE CELEBRATION
// ============================================================================
function blowCandles() {
  const f1 = document.getElementById('flame-1');
  const f2 = document.getElementById('flame-2');
  const s1 = document.getElementById('smoke-1');
  const s2 = document.getElementById('smoke-2');
  const glow = document.getElementById('cake-ambient-glow');
  const shimmer = document.getElementById('cake-shimmer');
  const aura = document.getElementById('cake-celebration-aura');
  const stage = document.getElementById('cake-stage');
  const btnBlow = document.getElementById('btn-blow-candles');
  const btnRelight = document.getElementById('btn-relight-candles');
  const message = document.getElementById('cake-message');

  // Blow out flames with animation
  if (f1) f1.className = 'candle-flame blowing-out';
  if (f2) f2.className = 'candle-flame blowing-out';

  setTimeout(() => {
    if (f1) f1.className = 'candle-flame blown-out';
    if (f2) f2.className = 'candle-flame blown-out';
  }, 380);

  // Activate smoke puffs
  if (s1) s1.className = 'smoke-puff active';
  if (s2) s2.className = 'smoke-puff active';

  // Fade ambient cake candle glow
  if (glow) glow.classList.add('faded');

  // Bounce and celebration animations
  if (stage) {
    stage.classList.remove('celebrating');
    void stage.offsetWidth;
    stage.classList.add('celebrating');
  }

  if (shimmer) {
    shimmer.className = 'cake-shimmer-sweep active';
  }

  if (aura) {
    aura.className = 'cake-celebration-aura active';
  }

  // Toggle buttons
  if (btnBlow) btnBlow.style.display = 'none';
  if (btnRelight) btnRelight.style.display = 'inline-flex';

  // Update celebratory wish message
  if (message) {
    message.textContent = `✨ Your 20th birthday wish has flown into the heavens! Happy Birthday, ${state.config.recipientName}! ❤️`;
    message.classList.add('celebrate-glow');
  }

  state.candlesBlown = true;
  playBlowSound();
  playChimeCelebration();
  triggerConfettiBurst();
  showToast(`🎂 Happy 20th Birthday, ${state.config.recipientName}! May every dream come true! ❤️`, 'romantic');
}

function relightCandles() {
  const f1 = document.getElementById('flame-1');
  const f2 = document.getElementById('flame-2');
  const s1 = document.getElementById('smoke-1');
  const s2 = document.getElementById('smoke-2');
  const glow = document.getElementById('cake-ambient-glow');
  const btnBlow = document.getElementById('btn-blow-candles');
  const btnRelight = document.getElementById('btn-relight-candles');
  const message = document.getElementById('cake-message');

  if (s1) s1.className = 'smoke-puff';
  if (s2) s2.className = 'smoke-puff';

  if (f1) f1.className = 'candle-flame relighting';
  if (f2) f2.className = 'candle-flame relighting';

  setTimeout(() => {
    if (f1) f1.className = 'candle-flame';
    if (f2) f2.className = 'candle-flame';
  }, 500);

  if (glow) glow.classList.remove('faded');

  if (btnBlow) btnBlow.style.display = 'inline-flex';
  if (btnRelight) btnRelight.style.display = 'none';

  if (message) {
    message.textContent = `Make your 20th birthday wish for October 29th before blowing the candles, ${state.config.recipientName}... ✨`;
    message.classList.remove('celebrate-glow');
  }

  state.candlesBlown = false;
  playTone(659.25, 0.3, 'sine');
  showToast('🕯️ Candles relit! You can wish again!', 'success');
}

function tapCake(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;

  triggerHeartBursts(x, y, 6);
  playTone(783.99, 0.2, 'sine', 0.05);

  const shimmer = document.getElementById('cake-shimmer');
  if (shimmer) {
    shimmer.classList.remove('quick-flash');
    void shimmer.offsetWidth;
    shimmer.classList.add('quick-flash');
  }
}

function triggerHeartBursts(originX, originY, count = 5) {
  const hearts = ['❤️', '💖', '💕', '✨', '🌸'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floating-heart-burst';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;

    const tx = (Math.random() - 0.5) * 160;
    const ty = -Math.random() * 120 - 40;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

// ============================================================================
// 5. RESTART JOURNEY SYSTEM
// ============================================================================
function restartOurStory() {
  if (!confirm('Would you like to return to Chapter 1 and relive this romantic journey from the beginning? (All your photographs and personal edits remain safely preserved!)')) {
    return;
  }

  // Reset progression back to Page 1
  state.unlockedPage = 1;
  localStorage.setItem('for_you_unlocked', 1);

  // Reset interactive reveals
  state.letterRevealed = false;
  state.candlesBlown = false;
  state.cinematicRan = false;

  const envelope = document.getElementById('envelope-box');
  if (envelope) envelope.classList.remove('opened');
  const footer = document.getElementById('letter-nav-footer');
  if (footer) footer.classList.remove('revealed');

  // Relight candles if blown
  relightCandles();

  // Navigate to Page 1
  navigateToPage(1, true);
  showToast('✨ Our story begins again, my love ❤️', 'romantic');
}

// ============================================================================
// 6. PHOTO LIGHTBOX VIEWER
// ============================================================================
function openPhotoLightbox(photoId, category) {
  state.lightbox.activeCategory = category;
  const photoList = category === 'her' ? state.config.page3.photos : state.config.page4.photos;
  state.lightbox.photos = photoList;

  const index = photoList.findIndex(p => p.id === photoId);
  state.lightbox.currentIndex = index !== -1 ? index : 0;

  renderActiveLightboxPhoto();

  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function renderActiveLightboxPhoto() {
  const photo = state.lightbox.photos[state.lightbox.currentIndex];
  if (!photo) return;

  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const date = document.getElementById('lightbox-date');
  const index = document.getElementById('lightbox-index');

  if (img) img.src = photo.src;
  if (caption) caption.textContent = photo.caption || '';
  if (date) {
    let dateStr = photo.date || '';
    if (photo.location) dateStr += ` • ${photo.location}`;
    date.textContent = dateStr;
  }
  if (index) {
    index.textContent = `${state.lightbox.currentIndex + 1} of ${state.lightbox.photos.length}`;
  }
}

function nextLightboxPhoto() {
  const len = state.lightbox.photos.length;
  if (len <= 1) return;
  state.lightbox.currentIndex = (state.lightbox.currentIndex + 1) % len;
  renderActiveLightboxPhoto();
}

function prevLightboxPhoto() {
  const len = state.lightbox.photos.length;
  if (len <= 1) return;
  state.lightbox.currentIndex = (state.lightbox.currentIndex - 1 + len) % len;
  renderActiveLightboxPhoto();
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// ============================================================================
// 7. PHOTO UPLOADER & DRAG-AND-DROP (Base64 + LocalStorage)
// ============================================================================
function initUploadDropzone() {
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('photo-file-input');

  if (fileInput) {
    fileInput.addEventListener('change', handleUploadFileChange);
  }

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });
  }
}

function openUploadModal(category = 'her') {
  const modal = document.getElementById('upload-modal');
  const categorySelect = document.getElementById('photo-target-category');
  const title = document.getElementById('upload-modal-title');
  const captionInput = document.getElementById('photo-caption-input');
  const dateInput = document.getElementById('photo-date-input');

  state.uploadPending = { base64: null, filename: null };
  clearUploadPreview();

  if (categorySelect) categorySelect.value = category;
  if (title) {
    title.textContent = category === 'her' 
      ? `📸 Add Photograph of ${state.config.recipientName}` 
      : '💑 Add Couple Memory Photograph';
  }
  if (captionInput) captionInput.value = '';
  if (dateInput) dateInput.value = '';

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeUploadModal() {
  const modal = document.getElementById('upload-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function handleUploadFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    processUploadedFile(file);
  }
}

function processUploadedFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (JPEG, PNG, WebP)', 'warning');
    return;
  }

  state.uploadPending.file = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    // High-resolution preservation with smooth display compression
    compressImage(e.target.result, 1600, 0.90, (compressedBase64) => {
      state.uploadPending.base64 = compressedBase64;
      state.uploadPending.filename = file.name;

      const dropzone = document.getElementById('upload-dropzone');
      const previewWrap = document.getElementById('upload-preview-wrap');
      const previewImg = document.getElementById('upload-preview-img');

      if (dropzone) dropzone.style.display = 'none';
      if (previewWrap) previewWrap.style.display = 'block';
      if (previewImg) previewImg.src = compressedBase64;
    });
  };
  reader.readAsDataURL(file);
}

function clearUploadPreview() {
  state.uploadPending = { base64: null, filename: null, file: null };

  const dropzone = document.getElementById('upload-dropzone');
  const previewWrap = document.getElementById('upload-preview-wrap');
  const previewImg = document.getElementById('upload-preview-img');
  const fileInput = document.getElementById('photo-file-input');

  if (dropzone) dropzone.style.display = 'block';
  if (previewWrap) previewWrap.style.display = 'none';
  if (previewImg) previewImg.src = '';
  if (fileInput) fileInput.value = '';
}

function compressImage(base64Src, maxWidth, quality, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
  img.src = base64Src;
}

async function submitUploadedPhoto() {
  if (!state.uploadPending.base64 && !state.uploadPending.file) {
    showToast('Please choose or drop an image first!', 'warning');
    return;
  }

  const categorySelect = document.getElementById('photo-target-category');
  const captionInput = document.getElementById('photo-caption-input');
  const dateInput = document.getElementById('photo-date-input');

  const category = categorySelect ? categorySelect.value : 'her';
  const caption = (captionInput && captionInput.value.trim()) || 'A beautiful memory ❤️';
  const date = (dateInput && dateInput.value.trim()) || 'October 2026';

  showToast('☁️ Saving photograph to lifetime database...', 'info');

  try {
    let uploadResult;
    if (window.CloudDB) {
      uploadResult = await window.CloudDB.uploadPhoto({
        file: state.uploadPending.file,
        base64: state.uploadPending.base64,
        category: category,
        caption: caption,
        date: date,
        tag: category === 'her' ? 'Radiant ✨' : '',
        location: category === 'couple' ? 'Together' : ''
      });
    } else {
      uploadResult = {
        success: true,
        photo: {
          id: 'photo-' + Date.now(),
          src: state.uploadPending.base64,
          caption: caption,
          date: date,
          tag: category === 'her' ? 'Radiant ✨' : '',
          location: category === 'couple' ? 'Together' : ''
        },
        cloudSynced: false
      };
    }

    const newPhoto = uploadResult.photo;

    if (category === 'her') {
      if (!state.config.page3.photos.some(p => p.id === newPhoto.id)) {
        state.config.page3.photos.push(newPhoto);
      }
      renderHerGallery();
    } else {
      if (!state.config.page4.photos.some(p => p.id === newPhoto.id)) {
        state.config.page4.photos.push(newPhoto);
      }
      renderCoupleScrapbook();
    }

    closeUploadModal();
    clearUploadPreview();

    if (uploadResult.cloudSynced) {
      showToast('✨ Photo saved to Lifetime Cloud Database! Synced to both phones ❤️', 'success');
    } else {
      showToast('✨ Photo saved permanently! (Connect Cloud to sync across phones)', 'success');
    }
  } catch (err) {
    console.error('Upload error:', err);
    showToast('Could not save photo: ' + err.message, 'warning');
  }
}

function editPhotoCaption(photoId, category, event) {
  if (event) event.stopPropagation();
  const list = category === 'her' ? state.config.page3.photos : state.config.page4.photos;
  const p = list.find(item => item.id === photoId);
  if (!p) return;

  const newCaption = prompt('Edit Caption:', p.caption);
  if (newCaption === null) return;

  p.caption = newCaption.trim() || p.caption;

  if (category === 'couple') {
    const newDate = prompt('Edit Date/Location:', p.date || '');
    if (newDate !== null) p.date = newDate.trim();
  }

  saveConfigToStorage();
  if (category === 'her') renderHerGallery();
  else renderCoupleScrapbook();

  showToast('Caption updated!', 'success');
}

async function deletePhoto(photoId, category, event) {
  if (event) event.stopPropagation();
  if (!confirm('Are you sure you want to delete this photograph from the database?')) return;

  if (window.CloudDB) {
    await window.CloudDB.deletePhoto(photoId);
  }

  if (category === 'her') {
    state.config.page3.photos = state.config.page3.photos.filter(p => p.id !== photoId);
    renderHerGallery();
  } else {
    state.config.page4.photos = state.config.page4.photos.filter(p => p.id !== photoId);
    renderCoupleScrapbook();
  }

  saveConfigToStorage();
  showToast('Photo removed from database', 'info');
}

// Cloud Database Real-Time Synchronization Listener
async function initCloudDatabaseSync() {
  if (!window.CloudDB) return;

  await window.CloudDB.init();

  // Listen for live cloud updates from any device
  window.addEventListener('cloud-photos-updated', (event) => {
    const cloudPhotos = event.detail.photos || [];
    if (!cloudPhotos.length) return;

    let changed = false;

    cloudPhotos.forEach(cp => {
      if (cp.category === 'her') {
        const existingIdx = state.config.page3.photos.findIndex(p => p.id === cp.id);
        if (existingIdx !== -1) {
          state.config.page3.photos[existingIdx] = cp;
        } else {
          state.config.page3.photos.push(cp);
          changed = true;
        }
      } else {
        const existingIdx = state.config.page4.photos.findIndex(p => p.id === cp.id);
        if (existingIdx !== -1) {
          state.config.page4.photos[existingIdx] = cp;
        } else {
          state.config.page4.photos.push(cp);
          changed = true;
        }
      }
    });

    if (changed || cloudPhotos.length) {
      renderHerGallery();
      renderCoupleScrapbook();
    }
  });

  // Load offline IndexedDB stored photos
  try {
    const localPhotos = await window.CloudDB.getLocalPhotos();
    if (localPhotos && localPhotos.length) {
      localPhotos.forEach(lp => {
        if (lp.category === 'her') {
          if (!state.config.page3.photos.some(p => p.id === lp.id)) {
            state.config.page3.photos.push(lp);
          }
        } else {
          if (!state.config.page4.photos.some(p => p.id === lp.id)) {
            state.config.page4.photos.push(lp);
          }
        }
      });
      renderHerGallery();
      renderCoupleScrapbook();
    }
  } catch (e) {
    console.warn('Local database load note:', e);
  }
}



// ============================================================================
// 7B. CLOUD DATABASE & SYNC MODAL CONTROLLERS
// ============================================================================
function openCloudSyncModal() {
  const modal = document.getElementById('cloud-sync-modal');
  if (!modal) return;

  // Pre-fill fields from active config if present
  if (window.CloudDB) {
    const activeCfg = window.CloudDB.getActiveConfig();
    if (activeCfg) {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };
      setVal('fb-apiKey', activeCfg.apiKey);
      setVal('fb-projectId', activeCfg.projectId);
      setVal('fb-authDomain', activeCfg.authDomain);
      setVal('fb-storageBucket', activeCfg.storageBucket);
      setVal('fb-messagingSenderId', activeCfg.messagingSenderId);
      setVal('fb-appId', activeCfg.appId);
    }
    window.CloudDB.updateCloudStatusUI(window.CloudDB.isCloudActive());
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeCloudSyncModal() {
  const modal = document.getElementById('cloud-sync-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function parseAndApplyFirebaseSnippet() {
  const textarea = document.getElementById('cloud-paste-snippet');
  if (!textarea || !textarea.value.trim()) {
    showToast('Please paste your Firebase snippet first!', 'warning');
    return;
  }

  const text = textarea.value;
  const extractField = (fieldName) => {
    const regex = new RegExp(`['"]?${fieldName}['"]?\\s*:\\s*['"\`]([^'"\`]+)['"\`]`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const apiKey = extractField('apiKey');
  const projectId = extractField('projectId');
  const authDomain = extractField('authDomain');
  const storageBucket = extractField('storageBucket');
  const messagingSenderId = extractField('messagingSenderId');
  const appId = extractField('appId');

  if (!apiKey && !projectId) {
    showToast('Could not find apiKey or projectId in the pasted snippet. Please check or fill manually.', 'warning');
    return;
  }

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  };

  setVal('fb-apiKey', apiKey);
  setVal('fb-projectId', projectId);
  setVal('fb-authDomain', authDomain);
  setVal('fb-storageBucket', storageBucket);
  setVal('fb-messagingSenderId', messagingSenderId);
  setVal('fb-appId', appId);

  showToast('🪄 Successfully parsed and filled all Firebase keys!', 'success');
}

async function saveCloudConfigFromUI() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const apiKey = getVal('fb-apiKey');
  const projectId = getVal('fb-projectId');
  const authDomain = getVal('fb-authDomain') || (projectId ? `${projectId}.firebaseapp.com` : '');
  const storageBucket = getVal('fb-storageBucket') || (projectId ? `${projectId}.appspot.com` : '');
  const messagingSenderId = getVal('fb-messagingSenderId');
  const appId = getVal('fb-appId');

  if (!apiKey || !projectId) {
    showToast('Please enter both API Key and Project ID to connect.', 'warning');
    return;
  }

  const configObj = {
    apiKey,
    projectId,
    authDomain,
    storageBucket,
    messagingSenderId,
    appId
  };

  showToast('Connecting to Google Firebase Cloud...', 'info');

  if (window.CloudDB) {
    const isReady = window.CloudDB.saveConfig(configObj);
    if (isReady) {
      showToast('✨ Live Cloud Database connected! Photos will sync across both phones ❤️', 'success');
      closeCloudSyncModal();
    } else {
      showToast('Config saved, but Firebase initialization had an issue. Please verify keys.', 'warning');
    }
  }
}

async function testCloudConnection() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const apiKey = getVal('fb-apiKey');
  const projectId = getVal('fb-projectId');
  const authDomain = getVal('fb-authDomain') || (projectId ? `${projectId}.firebaseapp.com` : '');
  const storageBucket = getVal('fb-storageBucket') || (projectId ? `${projectId}.appspot.com` : '');
  const messagingSenderId = getVal('fb-messagingSenderId');
  const appId = getVal('fb-appId');

  if (!apiKey || !projectId) {
    showToast('Please enter at least API Key and Project ID to test.', 'warning');
    return;
  }

  const testBtn = document.getElementById('btn-test-cloud');
  const originalText = testBtn ? testBtn.textContent : '';
  if (testBtn) {
    testBtn.disabled = true;
    testBtn.textContent = '⏳ Testing...';
  }

  showToast('Testing connection with Google Firebase...', 'info');

  if (window.CloudDB && window.CloudDB.testConnection) {
    const result = await window.CloudDB.testConnection({
      apiKey,
      projectId,
      authDomain,
      storageBucket,
      messagingSenderId,
      appId
    });

    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'warning');
    }
  } else {
    showToast('Cloud database engine is not loaded.', 'warning');
  }

  if (testBtn) {
    testBtn.disabled = false;
    testBtn.textContent = originalText;
  }
}

function disconnectCloudConfig() {
  if (!confirm('Are you sure you want to disconnect from Firebase Cloud? Uploaded photos will remain stored locally on this device.')) {
    return;
  }

  if (window.CloudDB) {
    window.CloudDB.saveConfig(null);
  }

  const clearVal = (id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  };
  clearVal('fb-apiKey');
  clearVal('fb-projectId');
  clearVal('fb-authDomain');
  clearVal('fb-storageBucket');
  clearVal('fb-messagingSenderId');
  clearVal('fb-appId');
  clearVal('cloud-paste-snippet');

  showToast('Disconnected from Firebase Cloud. Device offline mode active.', 'info');
  closeCloudSyncModal();
}

// ============================================================================
// 8. STORY CUSTOMIZATION DRAWER & EXPORT
// ============================================================================
function openStoryEditor() {
  const drawer = document.getElementById('editor-drawer');
  const recipientInput = document.getElementById('cfg-recipient-name');
  const senderInput = document.getElementById('cfg-sender-name');
  const dateInput = document.getElementById('cfg-birthday-date');
  const letterTextarea = document.getElementById('cfg-letter-paragraphs');

  if (recipientInput) recipientInput.value = state.config.recipientName;
  if (senderInput) senderInput.value = state.config.senderName;
  if (dateInput) dateInput.value = state.config.birthdayDate;
  if (letterTextarea) {
    letterTextarea.value = (state.config.page6.paragraphs || []).join('\n\n');
  }

  if (drawer) {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
  }
}

function closeStoryEditor() {
  const drawer = document.getElementById('editor-drawer');
  if (drawer) {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
  }
}

function saveStoryEditorChanges() {
  const recipientInput = document.getElementById('cfg-recipient-name');
  const senderInput = document.getElementById('cfg-sender-name');
  const dateInput = document.getElementById('cfg-birthday-date');
  const letterTextarea = document.getElementById('cfg-letter-paragraphs');

  if (recipientInput && recipientInput.value.trim()) {
    state.config.recipientName = recipientInput.value.trim();
  }
  if (senderInput && senderInput.value.trim()) {
    state.config.senderName = senderInput.value.trim();
    state.config.page6.signature = senderInput.value.trim();
  }
  if (dateInput && dateInput.value.trim()) {
    state.config.birthdayDate = dateInput.value.trim();
  }
  if (letterTextarea && letterTextarea.value.trim()) {
    const paras = letterTextarea.value
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    state.config.page6.paragraphs = paras;
  }

  state.config.page6.salutation = `My Dearest ${state.config.recipientName},`;

  saveConfigToStorage();
  renderAllDynamicContent();
  closeStoryEditor();
  showToast('✨ Personalization saved!', 'success');
}

function exportConfigCode() {
  const exportData = JSON.stringify(state.config, null, 2);
  const jsCode = `// Exported Birthday Configuration\nconst DEFAULT_CONFIG = ${exportData};`;

  navigator.clipboard.writeText(jsCode).then(() => {
    showToast('📋 Configuration code copied to clipboard!', 'success');
  }).catch(() => {
    prompt('Copy your configuration code below:', jsCode);
  });
}

function resetToDefaultConfig() {
  if (!confirm('Reset all personalized settings and photos back to original defaults?')) return;

  state.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  localStorage.removeItem('for_you_config');
  renderAllDynamicContent();
  closeStoryEditor();
  showToast('↺ Restored original defaults', 'info');
}

// ============================================================================
// 9. AMBIENT PARTICLES (Rose Petals, Twinkling Stars & Floating Hearts)
// ============================================================================
function initParticleAtmosphere() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const TOTAL_PARTICLES = 40;

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    particles.push(createParticle(width, height));
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * p.speedX;
      p.angle += p.spin;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;

      if (p.type === 'petal') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.6, 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'heart') {
        ctx.fillStyle = p.color;
        ctx.font = `${p.size * 1.4}px serif`;
        ctx.fillText('❤️', 0, 0);
      } else {
        ctx.fillStyle = '#f5e6b3';
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function createParticle(w, h) {
  const types = ['petal', 'petal', 'star', 'star', 'heart'];
  const type = types[Math.floor(Math.random() * types.length)];
  const petalColors = ['#ff4d6d', '#ff8fa3', '#800e13', '#c9184a', '#ffccd5'];

  return {
    type,
    x: Math.random() * w,
    y: Math.random() * h,
    size: type === 'star' ? Math.random() * 2 + 1 : Math.random() * 6 + 4,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    alpha: Math.random() * 0.4 + 0.2,
    speedY: Math.random() * 0.65 + 0.35,
    speedX: Math.random() * 0.45 + 0.2,
    angle: Math.random() * Math.PI * 2,
    spin: Math.random() * 0.02 + 0.005,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.025
  };
}

// ============================================================================
// 10. WEB AUDIO API ROMANTIC AMBIENT SYNTH & CHIMES
// ============================================================================
function getAudioContext() {
  if (!state.audio.ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    state.audio.ctx = new AudioCtx();
  }
  if (state.audio.ctx.state === 'suspended') {
    state.audio.ctx.resume();
  }
  return state.audio.ctx;
}

function toggleRomanticAudio() {
  const btn = document.getElementById('btn-toggle-audio');
  const icon = document.getElementById('audio-icon');
  const text = document.getElementById('audio-text');

  if (!state.audio.enabled) {
    state.audio.enabled = true;
    startRomanticChordsLoop();
    if (btn) btn.classList.add('playing');
    if (icon) icon.textContent = '💖';
    if (text) text.textContent = 'Playing';
    showToast('🎵 Romantic music playing softly...', 'romantic');
  } else {
    state.audio.enabled = false;
    stopRomanticChordsLoop();
    if (btn) btn.classList.remove('playing');
    if (icon) icon.textContent = '🎵';
    if (text) text.textContent = 'Music';
    showToast('Music paused', 'info');
  }
}

function startRomanticChordsLoop() {
  const ctx = getAudioContext();
  const chordNotes = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 261.63, 329.63, 349.23], // Fmaj7
    [196.00, 261.63, 293.66, 392.00]  // Gsus4
  ];

  let chordIndex = 0;
  let noteIndex = 0;

  state.audio.intervalId = setInterval(() => {
    if (!state.audio.enabled) return;

    const currentChord = chordNotes[chordIndex];
    const freq = currentChord[noteIndex];

    playTone(freq, 1.2, 'sine', 0.04);

    noteIndex++;
    if (noteIndex >= currentChord.length) {
      noteIndex = 0;
      chordIndex = (chordIndex + 1) % chordNotes.length;
    }
  }, 900);
}

function stopRomanticChordsLoop() {
  if (state.audio.intervalId) {
    clearInterval(state.audio.intervalId);
    state.audio.intervalId = null;
  }
}

function playTone(freq, duration = 0.5, type = 'sine', volume = 0.08) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playChimeCelebration() {
  const chimes = [523.25, 659.25, 783.99, 1046.50];
  chimes.forEach((f, idx) => {
    setTimeout(() => {
      playTone(f, 0.8, 'triangle', 0.07);
    }, idx * 120);
  });
}

function playBlowSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.45);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {}
}

function triggerConfettiBurst() {
  const colors = ['#ff4d6d', '#ff8fa3', '#d4af37', '#ffffff', '#ffccd5'];
  const count = 45;

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `${Math.random() * 25 + 10}vh`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = `${Math.random() * 2.2 + 2}s`;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// ============================================================================
// 11. TOAST NOTIFICATIONS & UTILITIES
// ============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'romantic-toast';

  const iconMap = {
    romantic: '❤️',
    success: '✨',
    warning: '🔒',
    info: '💌'
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || '✨'}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px) scale(0.95)';
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// 12. GLOBAL KEYBOARD & CLICK EVENT BINDINGS
// ============================================================================
function bindGlobalEvents() {
  // Chapter Navigation Dots click
  document.querySelectorAll('.chapter-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const targetPage = parseInt(dot.getAttribute('data-page'), 10);
      if (targetPage <= state.unlockedPage) {
        navigateToPage(targetPage, true);
      } else {
        showToast(`🔒 Chapter ${targetPage} is locked. Complete Chapter ${state.unlockedPage} first!`, 'warning');
        playTone(280, 0.2, 'sine');
      }
    });
  });

  // Lightbox keyboard arrows & Escape key
  document.addEventListener('keydown', (e) => {
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightboxPhoto();
      if (e.key === 'ArrowRight') nextLightboxPhoto();
    }

    const drawer = document.getElementById('editor-drawer');
    if (drawer && drawer.classList.contains('active') && e.key === 'Escape') {
      closeStoryEditor();
    }

    const uploadModal = document.getElementById('upload-modal');
    if (uploadModal && uploadModal.classList.contains('active') && e.key === 'Escape') {
      closeUploadModal();
    }

    const cloudModal = document.getElementById('cloud-sync-modal');
    if (cloudModal && cloudModal.classList.contains('active') && e.key === 'Escape') {
      closeCloudSyncModal();
    }
  });
}
