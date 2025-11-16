import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

export const productsRef = collection(db, "products");
export const salidasRef = collection(db, "salidas");
export const entradasRef = collection(db, "entradas");

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

export const getSalidasByUser = async (userId) => {
  const q = query(salidasRef, where("userId", "==", userId));
  try {
    const querySnapshot = await getDocs(q);

    const listaDeElementos = [];
    querySnapshot.forEach((doc) => {
      listaDeElementos.push({ id: doc.id, ...doc.data() });
    });

    console.log(
      `Salidas encontradas para el usuario ${userId}:`,
      listaDeElementos
    );
    return listaDeElementos;
  } catch (error) {
    console.error("Error al obtener salidas: ", error);
  }
};

export const saveSalida = async (salidasData) => {
  try {
    // Calcular el monto total (suma de precios * cantidades)
    let amount = 0;
    const details = salidasData.products
      .filter((p) => p.quantity > 0)
      .map((p) => {
        amount += p.price * p.quantity;
        return {
          product: p.name,
          quantity: p.quantity,
        };
      });

    // Guardar documento en Firestore
    const docRef = await addDoc(salidasRef, {
      amount,
      date: new Date(),
      details: JSON.stringify(details),
      userId: salidasData.userId,
      createdAt: new Date(),
    });

    console.log("Salida guardada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la salida:", error);
    throw error;
  }
};

export const updateProductQuantities = async (products) => {
  try {
    // Actualizar la cantidad de cada producto
    await Promise.all(
      products
        .filter((p) => p.quantity > 0) // Solo actualizar productos con cantidad > 0
        .map((p) =>
          updateDoc(doc(db, "products", p.id), {
            quantity: Math.max(
              0,
              (p.originalQuantity || p.quantity) - p.quantity
            ),
          })
        )
    );

    console.log("Cantidades de productos actualizadas");
  } catch (error) {
    console.error("Error al actualizar cantidades de productos:", error);
    throw error;
  }
};

export const getEntradasByUser = async (userId) => {
  const q = query(entradasRef, where("userId", "==", userId));
  try {
    const querySnapshot = await getDocs(q);

    const listaDeElementos = [];
    querySnapshot.forEach((doc) => {
      listaDeElementos.push({ id: doc.id, ...doc.data() });
    });

    console.log(
      `Entradas encontradas para el usuario ${userId}:`,
      listaDeElementos
    );
    return listaDeElementos;
  } catch (error) {
    console.error("Error al obtener entradas: ", error);
  }
};
