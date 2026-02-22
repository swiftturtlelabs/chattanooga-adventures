/* global emailjs */
import { EMAILJS_CONFIG } from './firebase-config.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate the support form data.
 * @param {{ from_name: string, from_email: string, subject: string, message: string }} data
 * @returns {Record<string, string> | null} Field-level errors, or null if valid
 */
export function validateForm(data) {
  const errors = {};

  if (!data.from_name || !data.from_name.trim()) {
    errors.from_name = 'Name is required.';
  }

  if (!data.from_email || !data.from_email.trim()) {
    errors.from_email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(data.from_email)) {
    errors.from_email = 'Please enter a valid email address.';
  }

  if (!data.subject) {
    errors.subject = 'Please select a subject.';
  }

  if (!data.message || !data.message.trim()) {
    errors.message = 'Message is required.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function getFormData(form) {
  return {
    from_name: form.elements.from_name.value,
    from_email: form.elements.from_email.value,
    subject: form.elements.subject.value,
    message: form.elements.message.value,
  };
}

function showFieldErrors(errors) {
  document
    .querySelectorAll('.form-group input, .form-group select, .form-group textarea')
    .forEach((el) => el.classList.remove('invalid'));

  if (!errors) return;

  for (const field of Object.keys(errors)) {
    const el = document.querySelector(`[name="${field}"]`);
    if (el) el.classList.add('invalid');
  }
}

function showStatus(message, type) {
  const status = document.getElementById('form-status');
  status.textContent = message;
  status.className = `form-status form-status--${type}`;
}

function clearStatus() {
  const status = document.getElementById('form-status');
  status.textContent = '';
  status.className = 'form-status';
}

function getEmailJS() {
  if (typeof emailjs === 'undefined') {
    throw new Error('EmailJS SDK not loaded. Please check your internet connection.');
  }
  return emailjs;
}

function init() {
  const form = document.getElementById('support-form');
  if (!form) return;

  try {
    const ejs = getEmailJS();
    ejs.init(EMAILJS_CONFIG.publicKey);
  } catch {
    /* EmailJS will be initialized on form submit if it loads late */
  }

  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    const data = getFormData(form);
    const errors = validateForm(data);

    if (errors) {
      showFieldErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      const firstEl = document.querySelector(`[name="${firstErrorField}"]`);
      if (firstEl) firstEl.focus();
      showStatus('Please fix the errors above.', 'error');
      return;
    }

    showFieldErrors(null);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const ejs = getEmailJS();
      ejs.init(EMAILJS_CONFIG.publicKey);
      await ejs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, data);
      showStatus("Your message has been sent! We'll get back to you soon.", 'success');
      form.reset();
    } catch {
      showStatus('Something went wrong. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
