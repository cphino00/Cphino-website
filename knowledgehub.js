import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* DOM */
const adminLogin = document.getElementById("adminLogin");
const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

/* 🔐 Login */
loginBtn?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      adminEmail.value,
      adminPass.value
    );
    loginMsg.innerText = "Login successful";
  } catch (err) {
    loginMsg.innerText = err.message;
  }
});

/* 👤 Auth state */
onAuthStateChanged(auth, user => {
  adminLogin.style.display = user ? "none" : "block";
  postForm.style.display = user ? "block" : "none";
});

/* 📝 Create Post */
document.getElementById("submitPost")?.addEventListener("click", async () => {
  const title = postTitle.value;
  const content = postContent.value;

  if (!title || !content) {
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db, "posts"), {
    title,
    content,
    author: auth.currentUser.email,
    createdAt: serverTimestamp()
  });

  postTitle.value = "";
  postContent.value = "";

  loadPosts();
});

/* 📖 Load Posts (admin view) */
async function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  postsList.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    postsList.innerHTML += `
      <div class="card">
        <h4>${d.title}</h4>
        <p>${d.content}</p>
      </div>
    `;
  });
}

loadPosts();
