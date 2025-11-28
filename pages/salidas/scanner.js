import "../common/private-route.js";
import "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";

const html5QrCode = new Html5Qrcode("scanner-reader", false);
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  alert(`Code matched = ${decodedText}`);

  /*
  TODO: 

  1. Mostrar un mensajito de bootstrap por cada código leido
  2. Crear un código de barras por cada producto en la tabla de porudctos
  3. Traer los productos desde firestore y comparar los códigos leidos con los códigos de los productos
  4. Agregar los productos leidos a una lista de salidas con cantidad 1 por cada código leido
  5. Permitir enviar la lista de salidas al presionar un botón "Guardar Salida"
  6. Agregar dos botones en la parte de abajo para "Cancelar" y "Ver resumen"
  7. Al presionar "Ver resumen", mostrar un modal con la lista de productos leidos y sus cantidades
  8. Al presionar "Guardar Salida", guardar la salida en firestore y actualizar las cantidades de los productos
  9. Detener el scanner al guardar y regresar a la página de salidas
  */
};
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
