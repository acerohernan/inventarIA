import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

export const productsRef = collection(db, "products");

export const getProductsByUser = async (userId) => {
  const q = query(productsRef, where("userId", "==", userId));
  try {
    const querySnapshot = await getDocs(q);

    const listaDeElementos = [];
    querySnapshot.forEach((doc) => {
      listaDeElementos.push({ id: doc.id, ...doc.data() });
    });

    console.log(
      `Elementos encontrados para el usuario ${userId}:`,
      listaDeElementos
    );
    return listaDeElementos;
  } catch (error) {
    console.error("Error al obtener documentos: ", error);
  }
};

export const saveProduct = async (productData) => {
  try {
    // Guardar documento en Firestore
    const docRef = await addDoc(productsRef, {
      name: productData.nombre,
      price: productData.precio,
      code: productData.codigo,
      quantity: productData.cantidad,
      userId: productData.userId,
      createdAt: new Date(),
    });

    console.log("Producto guardado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    throw error;
  }
};
