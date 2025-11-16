import "../common/private-route.js";
import "../common/components/index.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../common/firebase.js";
import { getOrCreateStatistics } from "../common/firestore.js";

const totalProductsElement = document.getElementById("total-products");
const totalSalidasElement = document.getElementById("total-salidas");
const totalEntradasElement = document.getElementById("total-entradas");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const statistics = await getOrCreateStatistics(user.uid);

    totalProductsElement.textContent = statistics.totalProducts || 0;
    totalSalidasElement.textContent = statistics.totalSalidas || 0;
    totalEntradasElement.textContent = statistics.totalEntradas || 0;
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
  }
});
