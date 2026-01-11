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
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* DOM Elements */
const adminLogin = document.getElementById("adminLogin");
const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

/* 🔐 Admin Login */
loginBtn?.addEventListener("click", () => {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPass").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      loginMsg.innerText = "Login successful";
    })
    .catch(err => {
      loginMsg.innerText = err.message;
    });
});

/* 👤 Auth State */
onAuthStateChanged(auth, user => {
  if (user) {
    adminLogin.style.display = "none";
    postForm.style.display = "block";
  } else {
    adminLogin.style.display = "block";
    postForm.style.display = "none";
  }
});


/* 📝 Create Post */
document.getElementById("submitPost")?.addEventListener("click", async () => {
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;

  if (!title || !content) {
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db, "posts"), {
    title,
    content,
    createdAt: new Date()
  });

  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";

  loadPosts();
});

/* 📖 Load Posts */
async function loadPosts() {
  postsList.innerHTML = "";

  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    postsList.innerHTML = "<p class='muted'>No posts yet.</p>";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.style.marginBottom = "16px";
    div.innerHTML = `
      <h4>${data.title}</h4>
      <p class="muted">${data.content}</p>
    `;
    postsList.appendChild(div);
  });
}

loadPosts();

await addDoc(collection(db, "posts"), {
  title,
  content,
  createdAt: new Date(),
  author: auth.currentUser.email
});

