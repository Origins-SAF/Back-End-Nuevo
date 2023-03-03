import { Router } from "express";
const router = Router();


import {check } from "express-validator"

//import { esRoleValido, emailExiste } from "../helpers/db-validators";

import { login, register, loginUser } from "../controllers/auth.controller.js";

import validarJWT  from "../middlewares/validar-jwt.js";



router.post("/login",login);

router.post("/registro",register);

router.get("/loadUser", validarJWT , loginUser);

export default router;