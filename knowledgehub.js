// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// 🔑 Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔒 ADMIN EMAIL (ONLY THIS USER CAN WRITE)
const ADMIN_EMAIL = "ADMIN_EMAIL@gmail.com";

// Elements
const adminLogin = document.getElementById("adminLogin");
const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const loginMsg = document.getElementById("loginMsg");

// 👀 Load posts (for everyone)
async function loadPosts() {
  postsList.innerHTML = "";

  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    postsList.innerHTML += `
      <div class="card">
        <h3>${data.title}</h3>
        <p>${data.content}</p>
      </div>
    `;
  });
}

loadPosts();

// 🔐 Check auth state
onAuthStateChanged(auth, user => {
  if (user && user.email === ADMIN_EMAIL) {
    adminLogin.style.display = "none";
    postForm.style.display = "block";
  } else {
    adminLogin.style.display = "none"; // hidden from visitors
    postForm.style.display = "none";
  }
});

// 🔑 Admin login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = adminEmail.value;
  const password = adminPass.value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (userCred.user.email !== ADMIN_EMAIL) {
      throw new Error("Not authorized");
    }

    loginMsg.innerText = "Admin logged in";
    postForm.style.display = "block";
    adminLogin.style.display = "none";

  } catch (err) {
    loginMsg.innerText = "Access denied";
  }
});

// ✍️ Publish post
document.getElementById("submitPost").addEventListener("click", async () => {
  const title = postTitle.value.trim();
  const content = postContent.value.trim();

  if (!title || !content) {
    alert("Please fill in both title and content.");
    return;
  }

  await addDoc(collection(db, "blogs"), {
    title,
    content,
    createdAt: serverTimestamp()
  });

  postTitle.value = "";
  postContent.value = "";
  loadPosts();
});
