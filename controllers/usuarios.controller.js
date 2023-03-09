import usuarioModelo from '../models/usuario.modelo.js';


export const getUsuarios = async (req, res) => {

  try {
    const usuarios = await usuarioModelo.find()

    res.json(usuarios)
  } catch (error) {
  
    console.log("Error al mostrar los usuarios", error)
  }
};



