import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM
const loginBox = document.getElementById("loginBox");
const editor = document.getElementById("editor");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const publishBtn = document.getElementById("publishBtn");
const postsDiv = document.getElementById("posts");

// LOGIN
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
  } catch (err) {
    alert(err.message);
  }
});

// AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBox.style.display = "none";
    editor.style.display = "block";
    loadPosts();
  } else {
    loginBox.style.display = "block";
    editor.style.display = "none";
  }
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// PUBLISH
publishBtn.addEventListener("click", async () => {
  if (!titleInput.value || !contentInput.value) {
    alert("Title & content required");
    return;
  }

  await addDoc(collection(db, "Posts"), {
    title: titleInput.value,
    content: contentInput.value,
    createdAt: serverTimestamp()
  });

  titleInput.value = "";
  contentInput.value = "";
  loadPosts();
});

// LOAD POSTS
async function loadPosts() {
  postsDiv.innerHTML = "";

  const snap = await getDocs(collection(db, "Posts"));
  snap.forEach((d) => {
    const data = d.data();

    postsDiv.innerHTML += `
      <div class="post">
        <h4>${data.title}</h4>
        <p>${data.content}</p>
        <div class="actions">
          <button class="btn danger" data-id="${d.id}">Delete</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".danger").forEach(btn => {
    btn.onclick = async () => {
      await deleteDoc(doc(db, "Posts", btn.dataset.id));
      loadPosts();
    };
  });
}

