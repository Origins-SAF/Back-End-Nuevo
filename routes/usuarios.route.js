import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getUsuarios,
  actualizarUsuario
  } from "../controllers/usuarios.controller.js";


  router.get("/ver-usuarios", getUsuarios);
  router.put("/actualizar-usuario/:id", actualizarUsuario);


export default router;
  