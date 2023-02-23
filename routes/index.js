import inventarioRutas from "./inventario.route.js";
import usuarioRutas from "./usuarios.route.js"
import loginRutas from "./auth.route.js"
import productosRutas from "./productos.route.js"
import parteRutas from "./parte.route.js"
import distribuidorRutas from "./distribuidor.route.js"
import puntoRutas from "./distribuidor.route.js"

export const rutas = () => [
    inventarioRutas,
    distribuidorRutas,
    puntoRutas,
    usuarioRutas,
    loginRutas,
    productosRutas,
    parteRutas
];