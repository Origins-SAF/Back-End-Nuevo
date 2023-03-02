
import PuntoModelo from "../models/punto.modelo.js";



export const getPuntos = async (req, res) => {
  
  try {
    const puntos = await PuntoModelo.find({estado: true}) // consulta para todos los documentos

// Respuesta del servidor
res.json(puntos);
} catch (error) {
    console.log("Error al traer los puntos: ", error)
    }
   }
   
export const getPunto = async (req, res) => {
  const { id } = req.params;

  try {
    const punto = await PuntoModelo.findById(id).populate("usuario", "nombre");

    res.json(punto);
  } catch (err) {
    console.log("Error al mostrar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const postNuevoPunto = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const puntoDB = await PuntoModelo.findOne({ nombre });

    if (puntoDB) {
      return res.status(400).json({
        msg: `El punto ${puntoDB.nombre}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...req.body,
      usuario: req.usuario._id,
    };

    const punto = new PuntoModelo(data);

    // Guardar DB
    await punto.save();

    res.status(201).json(punto);
  } catch (err) {
    console.log("Error al crear el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const test2 = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const punto = await PuntoModelo.findByIdAndUpdate(id, data, { new: true });

    res.json(punto);
  } catch (err) {
    console.log("Error al actualizar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const test3 = async (req, res) => {
  const { id } = req.params;

  try {
    const puntoBorrado = await PuntoModelo.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.json(puntoBorrado);
  } catch (err) {
    console.log("Error al borrar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

