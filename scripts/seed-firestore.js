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
      4: {
        title: 'Visit the Tennessee Aquarium',
        description:
          'Discover aquatic life from around the world at the Tennessee Aquarium on the banks of the Tennessee River. Explore two buildings — River Journey and Ocean Journey — featuring river otters, penguins, sharks, and freshwater habitats from the Appalachian mountains to the Gulf of Mexico.',
      },
      5: {
        title: 'Walk the Walnut Street Bridge',
        description:
          'Stroll across one of the longest pedestrian bridges in the world. The historic Walnut Street Bridge spans the Tennessee River, connecting downtown Chattanooga to the North Shore and Coolidge Park with stunning views of the city skyline and Lookout Mountain.',
      },
      6: {
        title: 'Hike Sunset Rock on Lookout Mountain',
        description:
          'Take a scenic hike through the Bluff Trail to Sunset Rock on Lookout Mountain for a panoramic view of the Tennessee Valley. This moderate trail rewards hikers with one of the most breathtaking sunset vistas in the region.',
      },
      7: {
        title: 'Tour the Chattanooga Choo Choo',
        description:
          'Visit the historic Terminal Station, made famous by the 1941 Glenn Miller song. The Chattanooga Choo Choo complex features beautifully restored train cars, a model railroad museum, gardens, and shops in the heart of the Southside district.',
      },
      8: {
        title: 'Explore the Bluff View Art District',
        description:
          'Wander through the charming Bluff View Art District perched high above the Tennessee River. This vibrant neighborhood features the Hunter Museum of American Art, sculpture gardens, cozy cafés, and galleries showcasing regional and national artists.',
      },
      9: {
        title: 'Paddle the Tennessee River',
        description:
          'Rent a kayak or stand-up paddleboard and explore the Tennessee River from the water. Paddle past downtown Chattanooga, under historic bridges, and along the riverwalk for a unique perspective of the city and its surrounding bluffs.',
      },
      10: {
        title: 'Visit Point Park on Lookout Mountain',
        description:
          'Step back in time at Point Park, part of the Chickamauga and Chattanooga National Military Park. Standing at the summit of Lookout Mountain, this Civil War battlefield offers panoramic views, historic monuments, and the story of the famous "Battle Above the Clouds."',
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
