import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getUsuarios
  } from "../controllers/usuarios.controller.js";


  router.get("/ver-usuarios", getUsuarios);


export default router;
  