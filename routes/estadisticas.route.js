import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getKilosVendidosDia,
  getKilosVendidosSemana,
  getKilosVendidosMes,
  getKilosVendidosAno
  } from "../controllers/estadisticas.controller.js";


  router.get("/ver_kilos_vendidos_dia", getKilosVendidosDia)
  router.get("/ver_kilos_vendidos_semanas", getKilosVendidosSemana)
  router.get("/ver_kilos_vendidos_mes", getKilosVendidosMes)
  router.get("/ver_kilos_vendidos_ano", getKilosVendidosAno)


export default router;