import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const postsContainer = document.getElementById("postsContainer");

async function loadPosts() {
  const q = query(
    collection(db, "Posts"),   // ✅ CAPITAL P (matches Firestore)
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  postsContainer.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "post-card";

    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.content}</p>
    `;

    postsContainer.appendChild(div);
  });
}
loadPosts();


