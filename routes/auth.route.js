import { Router } from "express";
const router = Router();


import {check } from "express-validator"

//import { esRoleValido, emailExiste } from "../helpers/db-validators";

import { login, register, } from "../controllers/auth.controller.js";



router.post("/login",login);

router.post("/registro",register);

export default router;