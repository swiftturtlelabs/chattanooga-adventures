import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

/*
 * Firebase web app config — fill in apiKey, messagingSenderId, and appId
 * from the Firebase Console → Project Settings → Your apps → Web app.
 * These are client-side keys and safe to commit.
 */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyClwRKKr4uLcKuXa7kyDcTS424WDdrrags',
  authDomain: 'chattanooga-adventures.firebaseapp.com',
  projectId: 'chattanooga-adventures',
  storageBucket: 'chattanooga-adventures.firebasestorage.app',
  messagingSenderId: '595841889827',
  appId: '1:595841889827:web:930f90f895a24aad066396',
};

export const EMAILJS_CONFIG = {
  serviceId: 'service_lsqyq99',
  templateId: 'template_uljq9hm',
  publicKey: '5pKuh16AobKbZ_MSm',
};

export const COLLECTIONS = {
  BOXES: 'boxes',
  ADVENTURES: 'adventures',
};

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

export { doc, getDoc, getDocs, collection };
