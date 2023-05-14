
import PuntoModelo from "../models/punto.modelo.js";
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js';
import cloudinary from 'cloudinary'

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

export const publicacionPunto = async (req, res) => {
  const { id } = req.params;
  const valor = req.body.publicado

  
try {
    const puntoPublicado = await PuntoModelo.findByIdAndUpdate(
      id,
      { publicado: valor },
      { new: true }
    );

    res.json({
      msg: "Punto Actualizado Correctamente (Publicacion)",
      puntoPublicado,
    });
  } catch (err) {
    console.log("Error al actualizar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const postNuevoPunto = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();
  const usuarios = await usuarioModelo.find({}, 'uid')
  const imgURl = await cloudinary.uploader.upload(req?.file?.path)
  try {
    const puntoDB = await PuntoModelo.findOne({ nombre });
    
    
    if (puntoDB) {
      return res.status(400).json({
        msg: `El punto ${puntoDB.nombre}, ya existe`,
      });
    }
    
    console.log(imgURl)

    let iconoUrl
    if(req.body.tipo == "PuntoFijo"){
      iconoUrl = "https://res.cloudinary.com/dabtnpikz/image/upload/v1684089821/ubi3_a9iutd.webp"
    }else if (req.body.tipo == "PuntoVisitado"){
      iconoUrl = "https://res.cloudinary.com/dabtnpikz/image/upload/v1684089784/PuntoVisitado_b4e3rg.webp"
    }else if (req.body.tipo == "PuntoBarrio"){
      iconoUrl = "https://res.cloudinary.com/dabtnpikz/image/upload/v1684089821/ubiBarrio_jhdqgp.webp"
    }else if (req.body.tipo == "PuntoInterior"){
      iconoUrl = "https://res.cloudinary.com/dabtnpikz/image/upload/v1684089821/ubiInterior_ajtzs8.webp"
    }

    // Generar la data a guardar
    const data = {
      ...req.body,
      usuario: req.usuario._id,
      img: imgURl?.url,
      icono: iconoUrl
    };
    

    const punto = new PuntoModelo(data);

    const noti = {}

    noti.descripcion = `Nuevo Punto Registrado (${punto.nombre})`
    noti.tipo = "Punto"
    noti.img = "ti-map-alt"
    noti.color = "bg-success"

    const userID = []
    for (let i = 0; i < usuarios.length; i++) {
      //console.log()
      const nuevoUser = {
        leido: false,
        idUsuario: usuarios[i]._id
      }
      userID.push(nuevoUser);
    }

    noti.usuarios = userID

    const notificacionNueva = new notificacionesModelo(noti)
    await notificacionNueva.save()
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

export const updatePunto = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  /* data.nombre = data.nombre.toUpperCase(); */
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

export const eliminarPuntoLog = async (req, res) => {
  const { id } = req.params;

  try {
    const puntoBorrado = await PuntoModelo.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.json({
      msg: "Punto eliminado correctamente (lógica)",
      puntoBorrado,
    });
  } catch (err) {
    console.log("Error al borrar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const reactivarPuntoLog = async (req, res) => {
  const { id } = req.params;

  try {
    const puntoReactivado = await PuntoModelo.findByIdAndUpdate(
      id,
      { estado: true },
      { new: true }
    );

    res.json({
      msg: "Punto Reactivado correctamente (lógica)",
      puntoReactivado,
    });
  } catch (err) {
    console.log("Error al reactivar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

