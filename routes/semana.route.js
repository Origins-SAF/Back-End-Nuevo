import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getSemanas,
  guardarSemana,
  cambiarEstadoSemana
  } from "../controllers/semana.controller.js";


  router.get("/ver-semanas", getSemanas);
  router.post("/guardar-semana", guardarSemana);
  router.put("/cambiar-estado-semana/:idSemana", cambiarEstadoSemana)


export default router;