import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getKilosVendidosSemana
  } from "../controllers/estadisticas.controller.js";


  router.get("/ver_kilos_vendidos_productos", getKilosVendidosSemana)


export default router;