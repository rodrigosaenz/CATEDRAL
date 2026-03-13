/**
 * @fileoverview CATEDRAL Utility Functions
 * Helper functions for scoring, level calculation, storage, and HTML rendering.
 */

/** @const {string} LocalStorage key for saving form progress */
var STORAGE_KEY = 'catedral_form_progress';

/**
 * Calculates the total diagnostic score from scored questions.
 * @param {Object} data - Current form data object
 * @returns {number} Total score (0-24)
 */
function calculateScore(data) {
  var total = 0;
  ['b1_produccion', 'b2_audiencia', 'b3_shows', 'b4_horas',
    'b5_metas', 'b6_equipo', 'b7_identidad', 'b8_ingresos'
  ].forEach(function(key) {
    total += parseInt(data[key] || 0, 10);
  });
  return total;
}

/**
 * Determines the artist level based on score.
 * @param {number} score - Numeric score
 * @returns {string} Level key: 'hobby' | 'foundation' | 'development' | 'select'
 */
function getLevel(score) {
  if (score <= 6) return 'hobby';
  if (score <= 12) return 'foundation';
  if (score <= 18) return 'development';
  return 'select';
}

/**
 * Returns the display label for a given level key.
 * @param {string} level - Level key
 * @returns {string} Human-readable label
 */
function getLevelLabel(level) {
  var labels = {
    hobby: 'Hobby',
    foundation: 'Foundation',
    development: 'Development',
    select: 'Select'
  };
  return labels[level] || level;
}

/**
 * Returns the diagnostic description text for a level.
 * @param {string} level - Level key
 * @returns {{es: string, en: string}} Object with Spanish and English text
 */
function getLevelDescription(level) {
  var descriptions = {
    hobby: {
      es: 'Su proyecto se encuentra en fase temprana. Le invitamos a explorar nuestro contenido educativo gratuito y regresar cuando tenga mayor compromiso con su proyecto.',
      en: 'Your project is in an early stage. We invite you to explore our free educational content and return when you have greater commitment.'
    },
    foundation: {
      es: 'Su proyecto tiene actividad real pero necesita estructura. CATEDRAL puede acompañar este proceso de profesionalización.',
      en: 'Your project has real activity but needs structure. CATEDRAL can support this professionalization process.'
    },
    development: {
      es: 'Su proyecto muestra consistencia y crecimiento. Necesita escalar con estrategia, no solo con esfuerzo.',
      en: 'Your project shows consistency and growth. It needs to scale with strategy, not just effort.'
    },
    select: {
      es: 'Su proyecto está consolidado. CATEDRAL puede potenciar su optimización e internacionalización.',
      en: 'Your project is consolidated. CATEDRAL can enhance your optimization and internationalization.'
    }
  };
  return descriptions[level] || descriptions.hobby;
}

/**
 * Saves current form progress to localStorage.
 * @param {Object} data - Form data to persist
 * @param {number} screen - Current screen index
 */
function saveProgress(data, screen) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: data, screen: screen }));
  } catch (e) {
    // localStorage may be unavailable in some contexts; fail silently
  }
}

/**
 * Loads saved form progress from localStorage.
 * @returns {{data: Object, screen: number}|null} Saved progress or null
 */
function loadProgress() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Clears saved form progress from localStorage.
 */
function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // fail silently
  }
}

/**
 * Escapes a string for safe use in HTML attribute values.
 * @param {string} str - Input string
 * @returns {string} HTML-escaped string
 */
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Renders HTML for a single question block.
 * @param {Object} q - Question definition object
 * @returns {string} HTML string for the question
 */
function renderQuestion(q) {
  var html = '<div class="q-block" id="qblock-' + q.id + '"';
  if (q.conditional) {
    html += ' data-conditional-field="' + escapeAttr(q.conditional.field) + '"';
    html += ' data-conditional-values="' + escapeAttr(q.conditional.values.join(',')) + '"';
    html += ' style="display:none"';
  }
  html += '>';
  html += '<div class="q-label">' + q.es + (q.required ? ' *' : '') + '</div>';
  html += '<div class="q-label-en">' + q.en + '</div>';

  if (q.type === 'text' || q.type === 'email' || q.type === 'url') {
    var placeholder = q.type === 'email' ? 'email@ejemplo.com' : q.type === 'url' ? 'https://' : '';
    html += '<input type="' + q.type + '" id="' + q.id + '" name="' + q.id + '"'
      + (q.required ? ' required' : '')
      + ' placeholder="' + escapeAttr(placeholder) + '"'
      + ' oninput="updateFormData(\'' + q.id + '\', this.value)">';
  } else if (q.type === 'number') {
    html += '<input type="number" id="' + q.id + '" name="' + q.id + '" min="2" max="50"'
      + (q.required ? ' required' : '')
      + ' oninput="updateFormData(\'' + q.id + '\', this.value)">';
  } else if (q.type === 'textarea') {
    html += '<textarea id="' + q.id + '" name="' + q.id + '"'
      + ' maxlength="' + (q.maxlength || 500) + '"'
      + (q.required ? ' required' : '')
      + ' oninput="updateFormData(\'' + q.id + '\', this.value)"></textarea>';
    if (q.maxlength) {
      html += '<div style="font-size:0.75rem;color:var(--muted);margin-top:0.25rem;text-align:right">'
        + '<span id="count-' + q.id + '">0</span>/' + q.maxlength + '</div>';
    }
  } else if (q.type === 'radio' || q.type === 'radio_scored') {
    html += '<div class="option-group" id="group-' + q.id + '">';
    q.options.forEach(function(opt) {
      // opt.value is always a primitive (number or string) as defined in config.js
      var val = typeof opt.value === 'number' ? opt.value : '"' + escapeAttr(String(opt.value)) + '"';
      html += '<div class="option-item" onclick="selectRadio(\'' + q.id + '\', ' + val + ', this)">'
        + '<div class="option-indicator"></div>'
        + '<div class="option-text">'
        + '<div class="option-text-es">' + opt.es + '</div>'
        + '<div class="option-text-en">' + opt.en + '</div>'
        + '</div></div>';
    });
    html += '</div>';
  } else if (q.type === 'checkbox') {
    html += '<div class="option-group" id="group-' + q.id + '">';
    q.options.forEach(function(opt) {
      html += '<div class="option-item checkbox" onclick="toggleCheckbox(\'' + q.id + '\', \'' + escapeAttr(opt.value) + '\', this, ' + (q.max || 99) + ')">'
        + '<div class="option-indicator"></div>'
        + '<div class="option-text">'
        + '<div class="option-text-es">' + opt.es + '</div>'
        + '<div class="option-text-en">' + opt.en + '</div>'
        + '</div></div>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * Renders HTML for a complete form screen.
 * @param {Object} screen - Screen definition object
 * @param {number} index - Zero-based index in the screens array (screen DOM id = index+1)
 * @returns {string} HTML string for the screen
 */
function renderScreen(screen, index) {
  var html = '<div class="screen" id="screen-' + (index + 1) + '">';
  html += '<div class="section-title">' + screen.title + '</div>';
  html += '<div class="section-subtitle"><span class="en">' + screen.subtitle + '</span></div>';
  screen.questions.forEach(function(q) { html += renderQuestion(q); });
  html += '<div class="btn-row">';
  html += '<button type="button" class="btn btn-secondary" onclick="prevScreen()">← Atrás</button>';
  html += '<button type="button" class="btn btn-primary" onclick="nextScreen()">Siguiente →</button>';
  html += '</div></div>';
  return html;
}
