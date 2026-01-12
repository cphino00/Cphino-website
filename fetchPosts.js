import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const postsContainer = document.getElementById("postsList");

async function loadPosts() {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    postsContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  postsContainer.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    postsContainer.innerHTML += `
      <div class="post-card">
        <h3>${data.title}</h3>
        <p>${data.content}</p>
      </div>
    `;
  });
}

loadPosts();
