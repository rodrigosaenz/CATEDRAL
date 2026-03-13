/**
 * @fileoverview CATEDRAL Main Script
 * Handles screen navigation, dynamic module building, form submission,
 * and localStorage progress restoration.
 *
 * Depends on: config.js, utils.js, validation.js, handlers.js
 */

/** @type {Object} Accumulated form responses */
var formData = {};

/** @type {number} Currently visible screen index (0 = welcome) */
var currentScreen = 0;

/** @type {number} Total number of screens (set after dynamic build) */
var totalScreens = 0;

/** @type {boolean} Whether the dynamic modules have been built */
var dynamicBuilt = false;

// ===== INITIALIZATION =====

/**
 * Builds all static form screens and inserts them into the DOM.
 * Called once on page load.
 */
function rebuildForm() {
  var container = document.getElementById('form-screens');
  var html = '';
  SCREENS.forEach(function(s, i) { html += renderScreen(s, i); });
  container.innerHTML = html;
  totalScreens = SCREENS.length + 1; // +1 for welcome screen
  updateProgress();
}

/**
 * Restores a previously saved form session from localStorage.
 * Re-populates all inputs and selection states, then navigates
 * to the screen where the user left off.
 * @param {Object} saved - Saved progress object {data, screen}
 */
function restoreProgress(saved) {
  formData = saved.data || {};

  // Restore text/email/url/number/textarea inputs
  Object.keys(formData).forEach(function(key) {
    var el = document.getElementById(key);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      el.value = formData[key];
      // Update character counter if applicable
      var counter = document.getElementById('count-' + key);
      if (counter && typeof formData[key] === 'string') {
        counter.textContent = formData[key].length;
      }
    }
  });

  // Restore radio / radio_scored selections
  SCREENS.forEach(function(screen) {
    screen.questions.forEach(function(q) {
      if (q.type === 'radio' || q.type === 'radio_scored') {
        var group = document.getElementById('group-' + q.id);
        if (!group) return;
        var saved_val = formData[q.id];
        if (saved_val === undefined) return;
        group.querySelectorAll('.option-item').forEach(function(item) {
          item.classList.remove('selected');
        });
        // Find matching option by onclick attribute value comparison
        q.options.forEach(function(opt, idx) {
          if (String(opt.value) === String(saved_val)) {
            var items = group.querySelectorAll('.option-item');
            if (items[idx]) items[idx].classList.add('selected');
          }
        });
      } else if (q.type === 'checkbox') {
        var group = document.getElementById('group-' + q.id);
        if (!group) return;
        var saved_arr = formData[q.id];
        if (!Array.isArray(saved_arr)) return;
        q.options.forEach(function(opt, idx) {
          if (saved_arr.indexOf(opt.value) !== -1) {
            var items = group.querySelectorAll('.option-item');
            if (items[idx]) items[idx].classList.add('selected');
          }
        });
      }
    });
  });

  checkConditionals();

  // Navigate to saved screen (capped at static screens for safety)
  var targetScreen = Math.min(saved.screen || 0, SCREENS.length);
  for (var i = 0; i < targetScreen; i++) {
    var allScreens = document.querySelectorAll('.screen');
    if (allScreens[currentScreen]) allScreens[currentScreen].classList.remove('active');
    currentScreen++;
    if (allScreens[currentScreen]) allScreens[currentScreen].classList.add('active');
  }
  updateProgress();
}

// ===== DYNAMIC SCREEN BUILDING =====

/**
 * Builds the dynamic (type + role) modules and the result/confirmation screen
 * and appends them to the form container.
 * @returns {number} Number of dynamic modules added
 */
function buildAndAppendDynamicScreens() {
  var tipo = formData.a5_tipo_proyecto;
  var roles = formData.a6_roles || [];
  var score = calculateScore(formData);
  var level = getLevel(score);

  var dynamicModules = [];

  if (level !== 'hobby') {
    var typeModule = getTypeModule(tipo);
    if (typeModule) dynamicModules.push(typeModule);
    getRoleModules(roles).forEach(function(m) { dynamicModules.push(m); });
  }

  var html = '';
  dynamicModules.forEach(function(mod, i) {
    html += renderScreen(mod, SCREENS.length + i);
  });

  // Build result/confirmation screen
  var confirmIdx = SCREENS.length + dynamicModules.length;
  var modulesActivated = ['Base'];
  if (level !== 'hobby') {
    var tipoLabels = {
      artista_individual: 'Individual',
      grupo: 'Grupal',
      colectivo: 'Colectivo',
      creativo_tecnico: 'Creativo Técnico'
    };
    modulesActivated.push(tipoLabels[formData.a5_tipo_proyecto] || formData.a5_tipo_proyecto);
    (formData.a6_roles || []).forEach(function(r) {
      var roleLabels = {
        performer_dj: 'Performer/DJ',
        productor: 'Productor',
        compositor: 'Compositor',
        cantante: 'Cantante',
        letrista: 'Letrista',
        director_creativo: 'Director Creativo'
      };
      if (roleLabels[r]) modulesActivated.push(roleLabels[r]);
    });
  }

  var desc = getLevelDescription(level);
  html += '<div class="screen" id="screen-' + (confirmIdx + 1) + '">'
    + '<div class="section-title">Resultado del Diagnóstico</div>'
    + '<div class="section-subtitle"><span class="en">Assessment Result</span></div>'
    + '<div class="result-badge ' + level + '">' + getLevelLabel(level).toUpperCase() + '</div>'
    + '<div class="result-score">' + score + ' <span>/ 24 puntos</span></div>'
    + '<p style="margin-top:1rem;color:var(--mid);font-size:0.9rem;line-height:1.6">'
    + desc.es
    + '<br><br><span style="color:var(--blue-grey);font-style:italic">' + desc.en + '</span>'
    + '</p>'
    + '<div class="result-modules">'
    + '<h4>Módulos activados / Activated modules</h4>'
    + modulesActivated.map(function(m) { return '<span class="module-tag">' + m + '</span>'; }).join('')
    + '</div>'
    + '<div class="btn-row">'
    + '<button type="button" class="btn btn-secondary" onclick="prevScreen()">← Atrás</button>'
    + '<button type="button" class="btn btn-primary" onclick="submitForm()">Enviar / Submit ✓</button>'
    + '</div></div>';

  document.getElementById('form-screens').innerHTML += html;
  totalScreens = confirmIdx + 2; // +1 for welcome screen offset
  dynamicBuilt = true;

  return dynamicModules.length;
}

// ===== NAVIGATION =====

/**
 * Advances to the next screen after validation.
 * Builds dynamic screens when leaving the last static screen.
 */
function nextScreen() {
  // Validate required fields on current static screen
  if (currentScreen > 0 && currentScreen <= SCREENS.length) {
    var screenIndex = currentScreen - 1;
    if (!validateScreen(SCREENS[screenIndex], formData)) {
      return;
    }
  }

  // Build dynamic screens after the last static screen (bloque-c)
  if (currentScreen === SCREENS.length && !dynamicBuilt) {
    buildAndAppendDynamicScreens();
  }

  var nextIndex = currentScreen + 1;
  var allScreens = document.querySelectorAll('.screen');
  if (!allScreens[nextIndex]) return;

  allScreens[currentScreen].classList.remove('active');
  allScreens[nextIndex].classList.add('active');
  currentScreen = nextIndex;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Returns to the previous screen.
 */
function prevScreen() {
  if (currentScreen <= 0) return;
  var allScreens = document.querySelectorAll('.screen');
  allScreens[currentScreen].classList.remove('active');
  currentScreen--;
  allScreens[currentScreen].classList.add('active');
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Updates the progress bar and text counter.
 */
function updateProgress() {
  var pct = totalScreens > 1 ? Math.round((currentScreen / (totalScreens - 1)) * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent =
    currentScreen === 0 ? '' : currentScreen + ' / ' + (totalScreens - 1);
}

// ===== SUBMISSION =====

/**
 * Collects form data, validates the payload, and sends it to the webhook.
 * Shows a loading overlay during submission and a success/error message.
 */
async function submitForm() {
  var score = calculateScore(formData);
  var level = getLevel(score);
  var modulesActivated = ['base'];
  if (level !== 'hobby') {
    modulesActivated.push(formData.a5_tipo_proyecto);
    (formData.a6_roles || []).forEach(function(r) { modulesActivated.push(r); });
  }

  var payload = Object.assign({}, formData, {
    puntuacion_total: score,
    nivel_diagnostico: level,
    modulos_activados: modulesActivated,
    timestamp: new Date().toISOString()
  });

  // Client-side payload validation before sending
  var errors = validatePayload(payload);
  if (errors.length > 0) {
    alert('Error de validación:\n' + errors.join('\n') + '\n\nValidation error:\n' + errors.join('\n'));
    return;
  }

  document.getElementById('sendingOverlay').classList.add('active');

  try {
    var response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      document.getElementById('sendingOverlay').classList.remove('active');
      clearProgress();

      var allScreens = document.querySelectorAll('.screen');
      if (allScreens[currentScreen]) allScreens[currentScreen].classList.remove('active');

      document.getElementById('form-screens').innerHTML += [
        '<div class="screen active" style="text-align:center;padding:3rem 0">',
        '<div style="margin-bottom:1rem">',
        '<img src="' + ISOTIPO_IMG + '" alt="Catedral symbol" width="160"',
        ' style="display:block;margin:0 auto 24px auto;opacity:0.9" />',
        '</div>',
        '<div class="section-title" style="text-align:center">Recibido</div>',
        '<p style="color:var(--mid);margin-top:1rem;line-height:1.7">',
        'Sus respuestas han sido recibidas.<br>',
        'El equipo CATEDRAL revisará su diagnóstico y lo contactará pronto.<br><br>',
        '<span style="color:var(--blue-grey);font-style:italic">',
        'Your responses have been received.<br>',
        'The CATEDRAL team will review your assessment and contact you soon.',
        '</span></p></div>'
      ].join('');

      document.getElementById('progressFill').style.width = '100%';
    } else {
      throw new Error('Response not ok: ' + response.status);
    }
  } catch (err) {
    document.getElementById('sendingOverlay').classList.remove('active');
    alert('Error al enviar. Por favor intente de nuevo.\nError sending. Please try again.');
    console.error('Submit error:', err);
  }
}

// ===== INIT =====

(function init() {
  rebuildForm();

  // Restore progress if available
  var saved = loadProgress();
  if (saved && saved.data && Object.keys(saved.data).length > 0) {
    restoreProgress(saved);
  }
})();
