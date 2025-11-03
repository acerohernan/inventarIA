import { auth } from "../common/firebase";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Si el usuario está autenticado, redirigir a la página de inicio
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "../inicio/inicio.html";
  }
});
