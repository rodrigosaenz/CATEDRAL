/**
 * @fileoverview CATEDRAL Event Handlers
 * Handles user interactions: radio selection, checkbox toggling, and input updates.
 * Depends on: utils.js (renderQuestion), script.js (formData, checkConditionals)
 */

/**
 * Handles selection of a radio option.
 * Deselects all siblings, marks the clicked item as selected,
 * and stores the value in formData.
 * @param {string} qId - Question ID
 * @param {string|number} value - Selected option value
 * @param {HTMLElement} el - Clicked option element
 */
function selectRadio(qId, value, el) {
  var group = document.getElementById('group-' + qId);
  if (group) {
    group.querySelectorAll('.option-item').forEach(function(item) {
      item.classList.remove('selected');
    });
  }
  el.classList.add('selected');
  formData[qId] = value;
  checkConditionals();
  saveProgress(formData, currentScreen);
}

/**
 * Handles toggle of a checkbox option.
 * Adds or removes the value from formData's array for the question.
 * Respects the maximum selection limit if set.
 * @param {string} qId - Question ID
 * @param {string} value - Option value to toggle
 * @param {HTMLElement} el - Clicked option element
 * @param {number} max - Maximum allowed selections
 */
function toggleCheckbox(qId, value, el, max) {
  if (!formData[qId]) formData[qId] = [];
  var idx = formData[qId].indexOf(value);
  if (idx > -1) {
    formData[qId].splice(idx, 1);
    el.classList.remove('selected');
  } else {
    if (formData[qId].length >= max) return;
    formData[qId].push(value);
    el.classList.add('selected');
  }
  saveProgress(formData, currentScreen);
}

/**
 * Updates formData when a text/textarea/number input changes.
 * Also refreshes character counters and conditional visibility.
 * @param {string} qId - Question ID
 * @param {string} value - New input value
 */
function updateFormData(qId, value) {
  formData[qId] = value;
  checkConditionals();

  // Update character count display if present
  var counter = document.getElementById('count-' + qId);
  if (counter) counter.textContent = value.length;

  saveProgress(formData, currentScreen);
}

/**
 * Evaluates all conditional question blocks and shows/hides them
 * based on the current formData values.
 */
function checkConditionals() {
  document.querySelectorAll('[data-conditional-field]').forEach(function(el) {
    var field = el.dataset.conditionalField;
    var values = el.dataset.conditionalValues.split(',');
    var current = formData[field];
    if (current !== undefined && values.indexOf(String(current)) !== -1) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}
