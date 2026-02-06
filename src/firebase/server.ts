import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// This function is safe to call in Server Components
export function getFirebaseServer() {
  // 1. Check if firebase is already running to avoid "Duplicate App" errors
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  // 2. Return only what we need for SEO (Firestore)
  return { 
    firestore: getFirestore(app) 
  };
}