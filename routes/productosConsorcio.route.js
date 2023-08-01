import { Router } from "express";

const router = Router();

import {
    getVerduras,
    postProductosVerduras
    } from "../controllers/productosConsorcio.controller.js";
    
    
    router.get("/ver-productos-verduras", getVerduras);
    router.post("/guardar-productos-verduras", postProductosVerduras);
 
    export default router;
    
