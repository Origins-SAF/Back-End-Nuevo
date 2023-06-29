import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getUsuarios,
  actualizarUsuario
  } from "../controllers/usuarios.controller.js";

  import { upload } from "../Libs/upload.js";

  router.get("/ver-usuarios", getUsuarios);
  router.put("/actualizar-usuario/:id", upload.single("image"), actualizarUsuario);


export default router;
  