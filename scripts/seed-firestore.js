import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

/**
 * Seed data for the Chattanooga Adventures Firestore database.
 * Usage:
 *   node scripts/seed-firestore.js path/to/service-account.json
 *
 * If no service account file is provided, uses Application Default Credentials
 * (requires `gcloud auth application-default login`).
 */

const SEED_DATA = {
  original: {
    name: 'Original Box',
    description: 'The original Chattanooga Adventures box with 10 unique local experiences.',
    adventureCount: 10,
    adventures: {
      1: {
        title: 'Go to Ruby Falls',
        description:
          'Experience the tallest and deepest underground waterfall open to the public in the United States. Located deep inside Lookout Mountain, this stunning 145-foot waterfall is a must-see Chattanooga attraction.',
      },
      2: {
        title: 'Ride the Incline Railway',
        description:
          'Take a ride on one of the steepest passenger railways in the world. The Lookout Mountain Incline Railway has been carrying passengers to the top of Lookout Mountain since 1895, offering breathtaking views of Chattanooga and the Tennessee Valley.',
      },
      3: {
        title: 'Explore Rock City',
        description:
          "See seven states from Lover's Leap at this enchanted mountaintop garden atop Lookout Mountain. Walk through massive ancient rock formations, cross a swinging bridge, and discover the beauty of over 400 native plant species.",
      },
    },
  },
};

async function seed() {
  const serviceAccountPath = process.argv[2];

  if (serviceAccountPath) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({ projectId: 'chattanooga-adventures' });
  }

  const db = getFirestore();

  for (const [boxId, boxData] of Object.entries(SEED_DATA)) {
    const { adventures, ...boxFields } = boxData;

    console.log(`Seeding box: ${boxId}`);
    await db.collection('boxes').doc(boxId).set(boxFields);

    for (const [advId, advData] of Object.entries(adventures)) {
      console.log(`  Seeding adventure: ${advId} — ${advData.title}`);
      await db.collection('boxes').doc(boxId).collection('adventures').doc(advId).set(advData);
    }
  }

  console.log('\nSeeding complete!');
}

seed().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
