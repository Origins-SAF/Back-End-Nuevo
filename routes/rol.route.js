import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getRoles,
  guardarRol
  } from "../controllers/rol.controller.js";


  router.get("/ver-roles", getRoles);
  router.post("/guardar-rol", guardarRol);


export default router;