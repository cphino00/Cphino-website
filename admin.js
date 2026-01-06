import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔒 Only this email can publish
const ADMIN_EMAIL = "ADMIN_EMAIL@gmail.com";

// Elements
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const editor = document.getElementById("editor");
const publishBtn = document.getElementById("publishBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginBox = document.getElementById("loginBox");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");


// 🔐 Login
loginBtn.onclick = async () => {
  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    if (userCred.user.email !== ADMIN_EMAIL) {
      throw new Error("Not authorized");
    }

    editor.style.display = "block";

  } catch (err) {
    alert("Access denied");
  }
};

// 🔄 Persist login
onAuthStateChanged(auth, user => {
  if (user && user.email === ADMIN_EMAIL) {
    loginBox.style.display = "none";
    editor.style.display = "block";
  } else {
    loginBox.style.display = "block";
    editor.style.display = "none";
  }
});

// ✍️ Publish post
publishBtn.onclick = async () => {
  if (!titleInput.value || !contentInput.value) {
    alert("Title and content required");
    return;
  }

  await addDoc(collection(db, "posts"), {
    title: titleInput.value,
    content: contentInput.value,
    createdAt: serverTimestamp()
  });

  titleInput.value = "";
  contentInput.value = "";
  alert("Post published");
};
 
// logout button
logoutBtn.onclick = async () => {
  await signOut(auth);
  loginBox.style.display = "block";
  editor.style.display = "none";
  alert("Logged out");
};

