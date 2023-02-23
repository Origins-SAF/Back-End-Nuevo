import inventarioRutas from "./inventario.route.js";
import usuarioRutas from "./usuarios.route.js"
import loginRutas from "./auth.route.js"
export const rutas = () => [
    inventarioRutas,
    usuarioRutas,
    loginRutas
];