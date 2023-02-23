import usuarioModelo from '../models/usuario.modelo.js';


export const getUsuarios = async (req, res) => {

  try {
    const usuarios = await usuarioModelo.find()

    res.json(usuarios)
  } catch (error) {
  
    console.log("Error al mostrar los usuarios", error)
  }
};

/* ctrlUsuario.obtenerUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    //Busco el usuario con dicho ID.
    const usuario = await Usuario.findById(id).populate("designado", "nombre");
    //Verifico que el usuario este activo.

    if (!usuario.estado) {
      return res.status(400).json({
        msg: `El usuario ${usuario.nombre} no existe`,
      });
    }
    res.status(200).json({
      usuario,
    });
  } catch (err) {
    console.log("Error al mostrar los datos del usuario: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

ctrlUsuario.editarUsuario = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(
      {
        ok: true,
        usuario
      });
  } catch (err) {
    console.log("Error al actualizar el usuario: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

ctrlUsuario.usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

ctrlUsuario.eliminarUsuario = async (req, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
  } catch (err) {
    console.log("Error al borrar el usuario: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
}; */


