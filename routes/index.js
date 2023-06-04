import inventarioRutas from "./inventario.route.js";
import usuarioRutas from "./usuarios.route.js";
import loginRutas from "./auth.route.js";
import distribuidorRutas from "./distribuidor.route.js";
import puntoRutas from "./punto.route.js";
import productosRutas from "./productos.route.js";
import parteRutas from "./parte.route.js"
import notifacionRutas from "./notificaciones.route.js"
import noticiaRutas from "./noticia.route.js"
import programaVivoRutas from "./programaVivo.route.js"
import cronogramaRutas from "./cronograma.route.js"

export const rutas = () => [
    inventarioRutas,
    distribuidorRutas,
    puntoRutas,
    usuarioRutas,
    loginRutas,
    productosRutas,
    parteRutas,
    notifacionRutas,
    noticiaRutas,
    programaVivoRutas,
    cronogramaRutas
];