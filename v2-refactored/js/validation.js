/**
 * @fileoverview CATEDRAL Frontend Validation
 * Validates required fields before allowing screen navigation.
 */

/**
 * Validates all required questions on a given screen.
 * Displays an inline error message if any required fields are missing.
 * @param {Object} screenData - Screen definition object (with questions array)
 * @param {Object} formData - Current form data object
 * @returns {boolean} True if valid, false if there are missing required fields
 */
function validateScreen(screenData, formData) {
  // Remove any existing error message
  var existing = document.getElementById('validation-error');
  if (existing) existing.remove();

  var missingRequired = [];

  screenData.questions.forEach(function(q) {
    if (!q.required) return;

    // Skip conditionally hidden questions
    var qBlock = document.getElementById('qblock-' + q.id);
    if (qBlock && qBlock.style.display === 'none') return;

    var value = formData[q.id];
    var isEmpty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      missingRequired.push(q.es);
    }
  });

  if (missingRequired.length > 0) {
    var currentScreenEl = document.querySelector('.screen.active');
    var errorDiv = document.createElement('div');
    errorDiv.id = 'validation-error';
    errorDiv.style.cssText = [
      'background:#F0E6E6',
      'border-left:4px solid var(--red)',
      'color:var(--red)',
      'padding:1rem 1.25rem',
      'border-radius:4px',
      'margin-bottom:1.5rem',
      'font-size:0.9rem',
      'line-height:1.6'
    ].join(';');
    errorDiv.innerHTML = '<strong>Por favor responda las siguientes preguntas requeridas:</strong>'
      + '<br>• ' + missingRequired.join('<br>• ')
      + '<br><br>'
      + '<span style="font-style:italic;color:inherit">Please answer the following required questions • '
      + missingRequired.join(' • ') + '</span>';

    var titleEl = currentScreenEl.querySelector('.section-title');
    if (titleEl && titleEl.nextElementSibling) {
      currentScreenEl.insertBefore(errorDiv, titleEl.nextElementSibling);
    } else if (currentScreenEl) {
      currentScreenEl.insertBefore(errorDiv, currentScreenEl.firstChild);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  }

  return true;
}

/**
 * Validates a submitted payload object for server-bound submission.
 * Returns an array of error strings (empty array means valid).
 * @param {Object} payload - Form payload object
 * @returns {string[]} Array of validation error messages
 */
function validatePayload(payload) {
  var errors = [];

  if (!payload.a1_nombre || String(payload.a1_nombre).trim().length === 0) {
    errors.push('Full name is required');
  }

  if (!payload.a3_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.a3_email)) {
    errors.push('Valid email address is required');
  }

  if (!payload.a4_ciudad_pais || String(payload.a4_ciudad_pais).trim().length === 0) {
    errors.push('City and country is required');
  }

  if (!payload.a5_tipo_proyecto) {
    errors.push('Project type is required');
  }

  if (!payload.a6_roles || !Array.isArray(payload.a6_roles) || payload.a6_roles.length === 0) {
    errors.push('At least one role must be selected');
  }

  return errors;
}
