

import bcryptjs from 'bcryptjs';

const ctrlAuth = {};


import  generarJWT  from '../helpers/generar-jwt.js';
import usuarioModelo from '../models/usuario.modelo.js';

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await usuarioModelo.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // SI el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (err) {
    console.log("Error al iniciar sesión", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador (vos)",
    });
  }
};

export const register = async (req, res) => {
  const { password, ...resto } = req.body;

  try {
    const usuario = new usuarioModelo(resto);

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    const usuarioRegistrado = await usuario.save();

    const token = await generarJWT(usuarioRegistrado.id);

    res.json({
      usuario,
      token,
    });
  } catch (err) {
    console.log("Error al registrar al usuario: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador (vos)",
    });
  }
};

export const renew = async (req = request, res = response) => {
  const { _id } = req.usuario;

  try {
    const usuario = await usuarioModelo.findById(_id);

    const token = await generarJWT(_id);

    res.json({
      ok: true,
      msg: "Token revalidado",
      usuario,
      token,
    });
  } catch (err) {
    console.log("Error al revalidar al token", err);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, hable con el administrador",
    });
  }
};

