import { response } from ("express");
import { Punto } from ("../models/puntos.js");



export const getPuntos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    const [total, puntos, tabla] = await Promise.all([
      Punto.countDocuments(query),
      Punto.find(query)
        .populate("usuario", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
      Punto.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "usuarios",
            localField: "usuario",
            foreignField: "_id",
            as: "usuario",
          },
        },
        { $unwind: "$usuario" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            nombre: 1,
            departamento: 1,
            barrio: 1,
            descripcion: 1,
            usuario: "$usuario.nombre",
            updatedAt: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$updatedAt",
              },
            },
          },
        },
      ]),
    ]);

    res.json({
      total,
      tabla,
      puntos,
    });
  } catch (err) {
    console.log("Error al mostrar los puntos: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const getPunto = async (req, res) => {
  const { id } = req.params;

  try {
    const punto = await Punto.findById(id).populate("usuario", "nombre");

    res.json(punto);
  } catch (err) {
    console.log("Error al mostrar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const PostPuntos = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const puntoDB = await Punto.findOne({ nombre });

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

    const punto = new Punto(data);

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

export const PutPuntos = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const punto = await Punto.findByIdAndUpdate(id, data, { new: true });

    res.json(punto);
  } catch (err) {
    console.log("Error al actualizar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const DeletePuntos = async (req, res) => {
  const { id } = req.params;

  try {
    const puntoBorrado = await Punto.findByIdAndUpdate(
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

