import { initializeApp } from 'firebase/app'
import { useAuth } from '@vueuse/firebase'

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  browserLocalPersistence,
} from 'firebase/auth'

import { defineStore } from 'pinia'

const firebaseConfig = {
  apiKey: 'AIzaSyApIDtWXZ_J8uHjwDaNWULCvxfK1eAvfEE',
  authDomain: 'penandphone-364415.firebaseapp.com',
  projectId: 'penandphone-364415',
  storageBucket: 'penandphone-364415.appspot.com',
  messagingSenderId: '853355927149',
  appId: '1:853355927149:web:c2caae1ec6ee8ffe50d164',
  measurementId: 'G-DMT7KBPHQ5',
}

export const useFirebase = defineStore('firebase', () => {
  const app = initializeApp(firebaseConfig)

  const auth = getAuth(app)
  auth.setPersistence(browserLocalPersistence)

  const { isAuthenticated, user } = useAuth(auth)

  const login = () => signInWithPopup(auth, new GoogleAuthProvider())
  const logout = () => signOut(auth)

  return {
    app,
    isAuthenticated,
    user,
    login,
    logout,
  }
})
