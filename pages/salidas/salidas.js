import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../common/firebase.js";
import { getSalidasByUser } from "../common/firestore.js";
import "../common/private-route.js";
import "../common/components/index.js";
import "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";

const loadingMessage = document.getElementById("loading-message");
const salidasTable = document.getElementById("salidas-table");
const salidasAddButton = document.getElementById("salidas-add-button");
const salidasDownloadButton = document.getElementById(
  "salidas-download-button"
);

let currentSalidas = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  loadingMessage.style.display = "flex";

  getSalidasByUser(user.uid)
    .then(getSalidasCallback)
    .finally(() => {
      loadingMessage.style.display = "none";
    });
});

salidasDownloadButton.addEventListener("click", () => {
  downloadSalidasExcel(currentSalidas);
});

function getSalidasCallback(salidas) {
  if (salidas.length === 0) {
    const noSalidasMessage = document.createElement("div");
    noSalidasMessage.className =
      "d-flex flex-column align-items-center justify-content-center h-50";
    noSalidasMessage.innerHTML = `
      <p class="fs-4">No hay salidas registradas.</p> 
      <p class="text-muted">Haz clic en el botón "+" para registrar nuevas salidas.</p>
    `;
    loadingMessage.replaceWith(noSalidasMessage);
    salidasAddButton.disabled = false;
    return;
  }

  salidas = salidas.sort((a, b) => {
    const dateA = a.date
      ? a.date.toDate
        ? a.date.toDate()
        : new Date(a.date)
      : new Date(0);
    const dateB = b.date
      ? b.date.toDate
        ? b.date.toDate()
        : new Date(b.date)
      : new Date(0);
    return dateA - dateB;
  });

  // Guardar las salidas para usar en la descarga
  currentSalidas = salidas;

  const tbody = document.querySelector("#salidas-table tbody");
  tbody.innerHTML = "";

  salidas.forEach((salida) => {
    const row = document.createElement("tr");

    // Parsear los detalles si es una cadena JSON
    let detallesTexto = "-";
    try {
      const detalles =
        typeof salida.details === "string"
          ? JSON.parse(salida.details)
          : salida.details;

      if (Array.isArray(detalles)) {
        detallesTexto = detalles
          .map((item) => `- ${item.quantity} ${item.product}`)
          .join("<br>");
      }
    } catch (e) {
      detallesTexto = salida.details || "-";
    }

    // Formatear la fecha
    let fechaTexto = "-";
    if (salida.date) {
      const fecha = salida.date.toDate
        ? salida.date.toDate()
        : new Date(salida.date);
      fechaTexto = fecha.toLocaleDateString("es-ES");
    }

    row.innerHTML = `
      <td>${fechaTexto}</td>
      <td>$${salida.amount || "0"}</td>
      <td style="white-space: pre-wrap; min-width: 250px; word-wrap: break-word; overflow-wrap: break-word;">${detallesTexto}</td>
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

  salidasTable.style.display = "block";
  salidasAddButton.disabled = false;
  salidasDownloadButton.disabled = false;
}

function downloadSalidasExcel(salidas) {
  // Preparar los datos para el Excel
  const dataToExport = salidas.map((salida) => {
    // Parsear los detalles
    let detallesTexto = "-";
    try {
      const detalles =
        typeof salida.details === "string"
          ? JSON.parse(salida.details)
          : salida.details;

      if (Array.isArray(detalles)) {
        detallesTexto = detalles
          .map((item) => `- ${item.quantity} ${item.product}`)
          .join("\n");
      }
    } catch (e) {
      detallesTexto = salida.details || "-";
    }

    // Formatear la fecha
    let fechaTexto = "-";
    if (salida.date) {
      const fecha = salida.date.toDate
        ? salida.date.toDate()
        : new Date(salida.date);
      fechaTexto = fecha.toLocaleDateString("es-ES");
    }

    return {
      Fecha: fechaTexto,
      Monto: salida.amount,
      Detalles: detallesTexto,
    };
  });

  // Crear un nuevo workbook
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Salidas");

  // Generar el archivo y descargarlo
  const now = new Date();
  const timestamp = now.toISOString().split("T")[0]; // YYYY-MM-DD
  XLSX.writeFile(wb, `salidas_${timestamp}.xlsx`);
}
