import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

export const productsRef = collection(db, "products");

export const getProductsByUser = async (userId) => {
  const q = query(productsRef, where("userId", "==", userId));
  try {
    // const querySnapshot = await getDocs(q);

    const listaDeElementos = [];
    /* querySnapshot.forEach((doc) => {
      listaDeElementos.push({ id: doc.id, ...doc.data() });
    }); */

    console.log(
      `Elementos encontrados para el usuario ${userId}:`,
      listaDeElementos
    );
    return listaDeElementos;
  } catch (error) {
    console.error("Error al obtener documentos: ", error);
  }
};
