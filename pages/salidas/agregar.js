import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../common/firebase.js";
import { getProductsByUser, saveSalida } from "../common/firestore.js";
import "../common/private-route.js";
import "../common/components/index.js";

const loadingMessage = document.getElementById("loading-message");
const productsListContainer = document.getElementById(
  "products-list-container"
);
const productQuantityList = document.getElementById("product-quantity-list");
const guardarButton = document.querySelector("button[type='submit']");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  currentUser = user;
  loadingMessage.style.display = "flex";

  getProductsByUser(user.uid)
    .then((products) => {
      productsData = products;

      // If component exists, pass products to it
      if (productQuantityList) {
        productQuantityList.products = products;
        productsListContainer.style.display = "block";

        // Listen for quantity changes
        productQuantityList.addEventListener("quantity-change", (e) => {
          // e.detail -> { productId, quantity }
          // TODO: use this event to build the salida details when saving
        });
      } else {
        // Fallback: use old table rendering
        getProductsCallback(products);
      }
    })
    .finally(() => {
      loadingMessage.style.display = "none";
    });
});

guardarButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("No hay usuario autenticado");
    return;
  }

  // Obtener las cantidades del componente
  const productsWithQuantity = productQuantityList.products.filter(
    (p) => p.quantity > 0
  );

  if (productsWithQuantity.length === 0) {
    alert("Por favor selecciona al menos un producto con cantidad mayor a 0");
    return;
  }

  guardarButton.disabled = true;
  guardarButton.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

  try {
    await saveSalida({
      products: productsWithQuantity,
      userId: currentUser.uid,
    });

    alert("Salida guardada exitosamente");

    // Redirigir a salidas
    window.location.href = "./salidas.html";
  } catch (error) {
    console.error("Error al guardar la salida:", error);
    alert("Error al guardar la salida: " + error.message);
  } finally {
    guardarButton.disabled = false;
    guardarButton.innerHTML = "Guardar";
  }
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
    return;
  }

  const tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
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
}
