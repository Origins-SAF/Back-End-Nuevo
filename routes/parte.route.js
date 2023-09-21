import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)

import {
    getPartes,
    postParte,
    putParte,
    getPartesPorGrupos,
    getPartesPorFecha,
    getPartesPorMes,
    getPartesSemanales,
    CalculosGraficos
  } from "../controllers/parte.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";
  
router.get("/ver-parte", getPartes);
router.post("/calcular-graficos", CalculosGraficos);
router.get("/ver-parte-semanales", getPartesSemanales);
router.get("/ver-parte-mes", getPartesPorMes);
router.get("/ver-partes-dias-grupos", getPartesPorGrupos);
router.get("/ver-partes-dias-fecha/:fechapd", getPartesPorFecha)
router.post("/crear-parte",validarJWT, postParte);
router.put("/editar-parte/:id",validarJWT, putParte);


export default router;