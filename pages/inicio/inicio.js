import { auth } from "../common/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import "../common/private-route.js";

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
