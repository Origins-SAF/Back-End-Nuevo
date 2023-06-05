import rolModelo from "../models/rol.modelo.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await rolModelo.find();

    res.json(roles);
  } catch (error) {
    console.log("Error al mostrar los roles", error);
  }
};

export const guardarRol = async (req, res) => {
  try {
    const datos = req.body;
    // Se alamacena el nuevo rol en la base de datos
    const rol = new rolModelo(datos);
    await rol.save();
    res.json({msg: 'El rol se guardo correctamente'});
  } catch (error) {
    console.log("Error al crear un distribuidor: ", error)
  }
};
