import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('YOUR_') &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'demo-local-nfl-pool'
);

const app = initializeApp(firebaseConfig);
// Initialize Firestore using the configured project database ID
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || undefined);
export const auth = getAuth(app);
