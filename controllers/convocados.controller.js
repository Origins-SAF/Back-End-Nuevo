import convocadoModelo from "../models/convocados.modelo.js";
import mongoose from "mongoose";

export const getConvocados = async (req, res) => {
  const limitConv = parseInt(req.query.limitConv);
  const skipConv = parseInt(req.query.skipConv);

  try {
    const convocados = await convocadoModelo
      .find({ estado: true, vigente: true })
      .populate("punto", ["nombre", "barrio", "tipo", "departamento"]); // consulta para todos los documentos

   /*  console.log(convocados); */

    let listaConvocados = convocados.reverse(); /* .slice(skip, skip + limit) */
    //console.log(listaConvocados)

    // "data" es la variable que está alojando el JSON
    var datos;
    var convocadosArrayList = [];

    for (let i = 0; i < listaConvocados.length; i++) {
      datos = listaConvocados[i];

      var listaFecha;
      var listaC = {};

      /* console.log(datos.vigente) */
      /* console.log(datos.fecha.toLocaleDalistaUserring("es-ES")) */
      // Revisa si la ciudad que que actualmente estamos leyendo difiere con la última leída
      if (listaFecha !== datos.fecha.toLocaleDateString("es-ES")) {
        /* console.log(datos.fecha) */
        // Guarda la nueva ciudad en la variable correspondiente
        listaFecha = datos.fecha.toLocaleDateString("es-ES");
        /* console.log(listaFecha) */
        // Guarda en la propiedad "nombre" del objeto "ciudad" el valor de la propiedad "Ciudad"
        // del profesional que actualmente estamos evaluando
        listaC.fecha_convocados = datos.fecha;

        // Filtra el objeto "data" comparando la propiedad "Ciudad" de cada profesional con la ciudad actual
        listaC.datos = listaConvocados.filter(
          (item) =>
            item.fecha.toLocaleDateString("es-ES") === listaFecha &&
            item.vigente == true
        );

        /* console.log(listaC) */
        // Finalmente toma el objeto ciudad con todos los profesionales que le corresponden y lo guarda en el array "ciudades"

        convocadosArrayList.push(listaC);
      }
    }

    const pagesConv = [];

    //Convocados
    if (limitConv != 1) {
      for (let x = 0; x < convocadosArrayList.length; x += limitConv) {
        let pageC = x;
        pagesConv.push(pageC);
      }
    }

    const totalPageConvocados = pagesConv;

    let convocadosArray = convocadosArrayList.splice(
      skipConv,
      skipConv + limitConv
    );

    // Respuesta del servidor
    res.json({ totalPageConvocados, convocadosArray });
  } catch (error) {
    console.log("Error al traer los convocados: ", error);
  }
};

export const getConvocadosArchivados = async (req, res) => {
  const limitArc = parseInt(req.query.limitArc);
  const skipArc = parseInt(req.query.skipArc);

  try {
    const convocados = await convocadoModelo
      .find({ estado: true, vigente: false })
      .populate("punto", ["nombre", "barrio", "tipo", "departamento"]); // consulta para todos los documentos

    /* const totalPage = convocados.length */

    let listaConvocados = convocados.reverse(); /* .slice(skip, skip + limit) */
    //console.log(listaConvocados)

    const pagesArc = [];

    //Archivados
    if (limitArc != 1) {
      for (let i = 0; i < listaConvocados.length; i += limitArc) {
        let pageA = i;
        pagesArc.push(pageA);
      }
    }

    /* console.log(convocadosArrayList) */

    const totalPageArchivados = pagesArc;

    /*  console.log(archivadosArrayList.length) */
    let archivadosArray = listaConvocados.slice(skipArc, skipArc + limitArc);

    // Respuesta del servidor
    res.json({ totalPageArchivados, archivadosArray });
  } catch (error) {
    console.log("Error al traer los convocados: ", error);
  }
};

export const getConvocadosArchivadosPorMes = async (req, res) => {
  const limitArc = parseInt(req.query.limitArc);
  const skipArc = parseInt(req.query.skipArc);

  let fechaInicio;
  let fechaFinal;

  var año = new Date().getFullYear();

  if (req.query.fechaInicio) {
    fechaInicio = new Date(req.query.fechaInicio);
  } else {
    fechaInicio = new Date(`${año}/01/01`);
  }

  if (req.query.fechaFinal) {
    fechaFinal = new Date(req.query.fechaFinal);
  } else {
    fechaFinal = new Date(`${año}/12/31`);
  }

  try {
    const lista = await convocadoModelo
      .find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFinal,
        },
        estado: true,
        vigente: false,
      })
      .populate("punto", ["nombre", "barrio", "tipo", "departamento"]);

    /* 
    console.log(dataOrdenada[20])
    console.log(lista[20]) 
    */
    const pagesArc = [];

    //Archivados
    if (limitArc != 1) {
      for (let i = 0; i < lista.length; i += limitArc) {
        let pageA = i;
        pagesArc.push(pageA);
      }
    }

    const totalPageArchivados = pagesArc;

    /*  console.log(archivadosArrayList.length) */
    let listaOrd = lista.slice().sort((a, b) => a.fecha - b.fecha);
    /* console.log(archivadosArray.at(-5).fecha) */
    let archivadosArray = listaOrd.slice(skipArc, skipArc + limitArc);
    /* console.log(new Date(archivadosArray[1]?.fecha)) */

    /* console.log(listaOrd.length)
    console.log(archivadosArray.length) */

    res.json({ totalPageArchivados, archivadosArray, listaOrd });
  } catch (error) {
    console.log("Error al traer las asistencias: ", error);
  }
};

// Controlador que almacena una nueva lista de convocados
export const postConvocados = async (req, res) => {
  // Desestructuramos la información recibida del cliente

  const datos = req.body;

  try {
    // Se alamacena la nueva lista en la base de datos
    const listConvocados = new convocadoModelo(datos);
    await listConvocados.save();

    res.json({ msg: "La lista de convocados se guardo correctamente" });
  } catch (error) {
    console.log("Error al crear la lista de convocados: ", error);
  }
};

export const getAsistenciasPorPunto = async (req, res) => {
  const idPunto = req.usuario.ubicacion?.puntoFijo;
  const permiso = req.usuario.ubicacion?.todosLosPuntos;

  let asistencias;
  try {
    if (permiso == true) {
      asistencias = await convocadoModelo
        .find({
          estado: true,
          vigente: true,
        })
        .populate("punto", ["nombre", "barrio"]);
    } else if (idPunto) {
      asistencias = await convocadoModelo
        .find({
          estado: true,
          punto: idPunto,
          vigente: true,
        })
        .populate("punto", ["nombre", "barrio"]);
    }
    /* if(idPunto){
            asistencias = await convocadoModelo.find({
                punto: idPunto,
                vigente: true
            }).populate("punto", ["nombre","barrio"])
        }else if (permiso == true){
            asistencias = await convocadoModelo.find({
                estado: true
            }).populate("punto", ["nombre","barrio"])
        } */

    res.json(asistencias);
  } catch (error) {
    res.status(401).json({
      msg: "Error al traer la lista de asistencias",
    });
    console.log("Error al traer la lista: ", error);
  }
};

export const guardarAsistenciasPorPunto = async (req, res) => {
  const datos = req.body;
  const { id } = req.params;

  try {
    const asistencia = await convocadoModelo.findByIdAndUpdate(
      id,
      { lista: datos },
      { new: true }
    );
    res.json({ msg: "Se Subio La Asistencia Correctamente", asistencia });
  } catch (error) {
    console.log("Error", error);
  }
};

export const actualizarPlanilla = async (req, res) => {
  const { id } = req.params;

  try {
    const data = req.body;
    /* console.log(data) */
    await convocadoModelo.findByIdAndUpdate(id, data, { new: true });

    res.json({ msg: "Se Actualizo la planilla" });
  } catch (err) {
    console.log("Error al actualizar la planilla: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const archivarPlanilla = async (req, res) => {
  const { id } = req.params;
  const valor = req.body.vigente;

  try {
    const planilla = await convocadoModelo.findByIdAndUpdate(
      id,
      { vigente: valor },
      { new: true }
    );

    res.json({
      msg: "Planilla Actualizada Correctamente ",
      planilla,
    });
  } catch (err) {
    console.log("Error al actualizar el punto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const eliminarPlanillaLog = async (req, res) => {
  const { id } = req.params;

  try {
    const planilla = await convocadoModelo.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.json({
      msg: "Planilla eliminada correctamente (lógica)",
      planilla,
    });
  } catch (err) {
    console.log("Error al borrar la planilla: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

export const crearJustificacionPlanilla = async (req, res) => {
  const { id, idUser } = req.params;
  try {
    // Ejecución normal del programa
    const planilla = await convocadoModelo.findById(id);

    if (!planilla)
      return res.status(404).json({ msg: "La Planilla No Existe" });

    if (!planilla.estado)
      return res
        .status(404)
        .json({ msg: "La Planilla No Existe (desactivado)" });

    const datos = req.body;

    const listaUser = await planilla.lista.find((asis) => asis.id === idUser);
    let arrayAsistencia = listaUser.asistencia[0];

    const asistenciaUser = {
      presente: arrayAsistencia.presente,
      tardanza: arrayAsistencia.tardanza,
      falta: arrayAsistencia.falta,
      horaDeLlegada: arrayAsistencia.horaDeLlegada,
      horaDeSalida: arrayAsistencia.horaDeLlegada,
      justificacionFalta: datos.justificacionFalta,
    };

    listaUser.asistencia[0] = asistenciaUser;

    const consultarIndex = (list) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === idUser) {
          return i;
        }
      }
    };

    const indexUser = consultarIndex(planilla.lista);

    const nuevaPlanilla = (planilla.lista[indexUser] = listaUser);

    await planilla.save(nuevaPlanilla);

    return res.json({
      msg: "Se Modifico la plantilla",
      planilla,
    });
  } catch (error) {
    // Si ocurre un error
    console.log("Error al actualizar la planilla: ", error);
  }
};
