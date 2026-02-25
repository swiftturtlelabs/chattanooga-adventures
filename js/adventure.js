import { db, doc, getDoc, COLLECTIONS } from './firebase-config.js';

/**
 * Parse box and adventure IDs from a URL search string.
 * @param {string} [search] - URL search string (defaults to current page)
 * @returns {{ box: string, adventure: string } | null}
 */
export function getAdventureParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const box = params.get('box');
  const adventure = params.get('adventure');
  if (!box || !adventure) return null;
  return { box, adventure };
}

/**
 * Fetch a single adventure document from Firestore.
 * @param {object} firestore - Firestore db instance (injectable for testing)
 * @param {string} box - Box document ID
 * @param {string} id - Adventure document ID
 * @returns {Promise<{ title: string, description: string } | null>}
 */
export async function fetchAdventure(firestore, box, id) {
  const ref = doc(firestore, COLLECTIONS.BOXES, box, COLLECTIONS.ADVENTURES, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

function showTeaser() {
  document.getElementById('teaser').hidden = false;
  document.getElementById('adventure-content').hidden = true;
  document.getElementById('adventure-error').hidden = true;
}

function showAdventure(data) {
  const teaser = document.getElementById('teaser');
  const content = document.getElementById('adventure-content');
  const title = document.getElementById('adventure-title');
  const description = document.getElementById('adventure-description');

  teaser.classList.add('fade-out');

  setTimeout(() => {
    teaser.hidden = true;
    title.textContent = data.title;
    description.textContent = data.description;
    content.hidden = false;
    content.classList.add('fade-in');
    title.focus();
    document.title = `${data.title} | Chattanooga Adventures`;
  }, 500);
}

function showError(message) {
  document.getElementById('teaser').hidden = true;
  document.getElementById('adventure-content').hidden = true;
  const errorSection = document.getElementById('adventure-error');
  errorSection.hidden = false;
  document.getElementById('error-message').textContent = message;
  document.getElementById('error-heading').focus();
}

function init() {
  const revealBtn = document.getElementById('reveal-btn');
  if (!revealBtn) return;

  const params = getAdventureParams();

  if (!params) {
    showError('Invalid adventure link. Please scan your QR code again.');
    return;
  }

  showTeaser();
  revealBtn.addEventListener('click', async () => {
    revealBtn.disabled = true;
    revealBtn.textContent = 'Loading...';

    try {
      const data = await fetchAdventure(db, params.box, params.adventure);

      if (!data) {
        showError("We couldn't find that adventure. Please check your link and try again.");
        return;
      }

      showAdventure(data);
    } catch {
      showError('Something went wrong. Please try again later.');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
