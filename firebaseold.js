import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "cphino-knowledgehub.firebaseapp.com",
  projectId: "cphino-knowledgehub",
  storageBucket: "cphino-knowledgehub.appspot.com",
  messagingSenderId: "104788057588",
  appId: "1:104788057588:web:dcb4aa93d28b903a35d221"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);





