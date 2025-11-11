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
  if (products.length === 0) {
    const noProductsMessage = document.createElement("div");
    noProductsMessage.className =
      "d-flex flex-column align-items-center justify-content-center h-50";
    noProductsMessage.innerHTML = `
      <p class="fs-4">No hay productos registrados.</p> 
      <p class="text-muted">Haz clic en el botón "+" para agregar nuevos productos.</p>
    `;
    loadingMessage.replaceWith(noProductsMessage);
    productsAddButton.disabled = false;
    return;
  }

  const tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${
          product.imageUrl || ""
        }" alt="Producto" width="40" height="40" style="object-fit: cover; border-radius: 4px;">
      </td>
      <td>${product.name || "-"}</td>
      <td>${product.code || "-"}</td>
      <td>$${product.price || "0"}</td>
      <td>${product.quantity || "0"}</td>
      <td>
      <div class="d-flex align-items-center justify-content-center gap-2">
        <button class="btn btn-sm btn-outline-primary" title="Editar">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" title="Eliminar">
          <i class="bi bi-trash"></i>
        </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  productsTable.style.display = "block";
  productsAddButton.disabled = false;
  productsDownloadButton.disabled = false;
}
