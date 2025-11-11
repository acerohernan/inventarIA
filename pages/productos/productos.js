import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../common/firebase.js";
import "../common/private-route.js";
import "../common/components/index.js";
import { getProductsByUser } from "../common/firestore.js";

const loadingMessage = document.getElementById("loading-message");
const productsTable = document.getElementById("products-table");
const productsAddButton = document.getElementById("products-add-button");
const productsDownloadButton = document.getElementById(
  "products-download-button"
);

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  loadingMessage.style.display = "flex";

  getProductsByUser(user.uid)
    .then(getProductsCallback)
    .finally(() => {
      loadingMessage.style.display = "none";
    });
});

function getProductsCallback(products) {
  console.log("Productos del usuario:", products);
  productsTable.style.display = "block";
  productsAddButton.disabled = false;
  productsDownloadButton.disabled = false;
}
