/**
 * Firestore security rules tests.
 * Requires the Firebase emulator to be running:
 *   firebase emulators:start --only firestore
 */
import { describe, it, beforeAll, afterAll } from 'vitest';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';

let testEnv;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'chattanooga-adventures-test',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup();
  });

  describe('unauthenticated reads', () => {
    it('allows reading boxes collection', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(db.collection('boxes').doc('original').get());
    });

    it('allows reading adventures subcollection', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(
        db.collection('boxes').doc('original').collection('adventures').doc('1').get(),
      );
    });
  });

  describe('unauthenticated writes', () => {
    it('denies writing to boxes', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertFails(db.collection('boxes').doc('test').set({ name: 'hack' }));
    });

    it('denies writing to adventures', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertFails(
        db
          .collection('boxes')
          .doc('original')
          .collection('adventures')
          .doc('test')
          .set({ title: 'hack' }),
      );
    });

    it('denies deleting boxes', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertFails(db.collection('boxes').doc('original').delete());
    });
  });

  describe('authenticated writes', () => {
    it('denies writes even for authenticated users', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      await assertFails(db.collection('boxes').doc('test').set({ name: 'hack' }));
    });

    it('denies deletes even for authenticated users', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      await assertFails(db.collection('boxes').doc('original').delete());
    });
  });
});
