import { db, collection, getDocs, COLLECTIONS } from './firebase-config.js';

/**
 * Fetch every box and its adventures from Firestore.
 * @param {object} firestore - Firestore db instance (injectable for testing)
 * @returns {Promise<Array<{ id: string, name: string, adventures: Array }>>}
 */
export async function fetchAllAdventures(firestore) {
  const boxesRef = collection(firestore, COLLECTIONS.BOXES);
  const boxSnapshots = await getDocs(boxesRef);

  const boxes = [];

  for (const boxDoc of boxSnapshots.docs) {
    const boxData = boxDoc.data();
    const adventuresRef = collection(
      firestore,
      COLLECTIONS.BOXES,
      boxDoc.id,
      COLLECTIONS.ADVENTURES,
    );
    const adventureSnapshots = await getDocs(adventuresRef);

    const adventures = adventureSnapshots.docs.map((advDoc) => ({
      id: advDoc.id,
      ...advDoc.data(),
    }));

    boxes.push({
      id: boxDoc.id,
      name: boxData.name || boxDoc.id,
      description: boxData.description || '',
      adventures,
    });
  }

  return boxes;
}

function renderAdventures(container, boxes) {
  container.innerHTML = '';

  if (boxes.length === 0) {
    container.innerHTML = '<p>No adventures found.</p>';
    return;
  }

  for (const box of boxes) {
    const group = document.createElement('section');
    group.className = 'box-group';
    group.setAttribute('aria-labelledby', `box-${box.id}`);

    const heading = document.createElement('h2');
    heading.id = `box-${box.id}`;
    heading.className = 'box-group__title';
    heading.textContent = box.name;
    group.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'tile-grid';

    for (const adventure of box.adventures) {
      const tile = document.createElement('a');
      tile.className = 'tile';
      tile.href = `/adventure?box=${encodeURIComponent(box.id)}&adventure=${encodeURIComponent(adventure.id)}`;
      tile.textContent = adventure.title;
      grid.appendChild(tile);
    }

    group.appendChild(grid);
    container.appendChild(group);
  }
}

async function init() {
  const container = document.getElementById('adventures-container');
  if (!container) return;

  try {
    const boxes = await fetchAllAdventures(db);
    renderAdventures(container, boxes);
  } catch {
    container.innerHTML =
      '<p class="loading">Failed to load adventures. Please try again later.</p>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
