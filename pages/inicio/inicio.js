import { auth } from "../common/firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Verificar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
  } else {
    window.location.href = "../login/login.html";
  }
});

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  logoutButton.disable = true;
  signOut(auth)
    .catch((error) => {
      console.error("Error signing out:", error);
    })
    .finally(() => {
      logoutButton.disable = false;
    });
});
