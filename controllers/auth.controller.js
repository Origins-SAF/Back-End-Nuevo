

import bcryptjs from 'bcryptjs';
import cloudinary from 'cloudinary'
import logModelo from '../models/log.modelo.js';

const ctrlAuth = {};


import  generarJWT  from '../helpers/generar-jwt.js';
import usuarioModelo from '../models/usuario.modelo.js';

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await usuarioModelo.findOne({ correo }).populate("rol", ["rol"]);
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

    const log = {}
    const date = new Date();
  
    let hora = date.getHours()
    let minutos = date.getMinutes()

    log.descripcion = `El usuario (${usuario.usuario}) inicio sesion a las ${hora}:${minutos}`

    const logNuevo = new logModelo(log)
    await logNuevo.save()

    res.json({
      usuario,
      token,
    });
  } catch (err) {
    /* console.log("Error al iniciar sesión", err); */
    res.status(500).json({
      msg: "Por favor, hable con el administrador (vos)",
    });
  }
};

export const register = async (req, res) => {
  const { password, ...resto } = req.body;

  let imgURl = ""

  if(req?.file?.path){
    imgURl = await cloudinary.uploader.upload(req?.file?.path)
  }else {
    imgURl = req.body?.image
  }

  try {
    let datos = {
      ...resto,
      usuario: resto.nombre +  resto.apellido.slice(0, 1),
      ubicacion: JSON.parse(resto?.ubicacion),
      img: imgURl?.url ? imgURl?.url : imgURl
    }

    const usuario = new usuarioModelo(datos);

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    

    // Guardar en BD
    const usuarioRegistrado = await usuario.save();

    /* const token = await generarJWT(usuarioRegistrado.id); */

    res.json({msg: 'El Usuario se guardo correctamente', usuarioRegistrado});

  } catch (err) {
    /* console.log("Error al registrar al usuario: ", err); */
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    
      const user = await usuarioModelo.findById(req.usuario.id).select('-password, -updatedAt').populate("rol", ["rol"]);
      res.json(user)
  } catch (error) {
      /* console.log(error) */
      res.status(500).send('server error - Hable con un administrador')
  }
}

