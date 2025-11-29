import "../common/private-route.js";
import "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../common/firebase.js";
import { getProductsByUser } from "../common/firestore.js";

const html5QrCode = new Html5Qrcode("scanner-reader", false);

const toastContainer = document.getElementById("toast-container");

const showToast = (message, type = "success", delay = 2500) => {
  if (!toastContainer) return;
  const toastEl = document.createElement("div");
  const bgClass =
    type === "success"
      ? "bg-success text-white"
      : type === "danger"
      ? "bg-danger text-white"
      : "bg-warning text-dark";
  toastEl.className = `toast align-items-center ${bgClass} border-0 my-2`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  const bsToast = new bootstrap.Toast(toastEl, { delay, autohide: true });
  bsToast.show();

  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
};

let productsData = [];
let productsLoaded = false;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    productsData = (await getProductsByUser(user.uid)) || [];
    productsLoaded = true;
  } catch (error) {
    showToast("Error al cargar productos", "danger");
    productsLoaded = true;
  }
});

// Retain the last decoded value to avoid duplicate rapid toasts
let lastDecodedValue = null;
let lastDecodedTimestamp = 0;

const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  /*
  TODO: 

  1. Hacer limpieza del código
  4. Agregar los productos leidos a una lista de salidas con cantidad 1 por cada código leido
  7. Al presionar "Ver resumen", mostrar un modal con la lista de productos leidos y sus cantidades
  5. Permitir enviar la lista de salidas al presionar un botón "Guardar Salida"
  8. Al presionar "Guardar Salida", guardar la salida en firestore y actualizar las cantidades de los productos
  9. Detener el scanner al guardar y regresar a la página de salidas
  */

  const code = String(decodedText || "").trim();
  const now = Date.now();

  // Si es el mismo código dentro de los 1.5 segundos, ignorar
  if (lastDecodedValue === code && now - lastDecodedTimestamp < 1500) {
    return;
  }

  lastDecodedValue = code;
  lastDecodedTimestamp = now;

  // Si los productos no han cargado, mostrar mensaje de advertencia
  if (!productsLoaded) {
    showToast(
      "Cargando productos... inténtalo de nuevo en unos segundos",
      "warning"
    );
    return;
  }

  const product = productsData.find((p) => String(p.code).trim() === code);

  if (product) {
    showToast(
      `Producto encontrado: ${product.name}`.replace(/undefined/g, ""),
      "success"
    );
    // TODO: Add to list of scanned items with quantity=1
  } else {
    showToast(
      `Producto no encontrado: ${code}`.replace(/undefined/g, ""),
      "danger"
    );
  }
};

const config = { fps: 10, qrbox: { width: 250, height: 250 } };

html5QrCode
  .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
  .catch((err) => {
    console.error("Error starting scanner:", err);
    showToast(
      "No se pudo iniciar el scanner: " +
        (err && err.message ? err.message : String(err)),
      "danger"
    );
  });
