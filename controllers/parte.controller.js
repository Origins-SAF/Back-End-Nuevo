import parteModelo from "../models/parte.modelo.js";
import _ from "lodash";

// Devuelve todos los partes activas de la colección
export const getPartes = async (req, res) => {
  try {
    const partes = await parteModelo
      .find({ estado: true })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);
    // Respuesta del servidor
    res.json(partes);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesSemanales = async (req, res) => {
  try {
    const partes = await parteModelo
      .find({ estado: true })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);

    /* let listaOrd = partes.slice().sort((a, b) => a.fecha - b.fecha); */
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    /* console.log(dia) */
    const semanaDelMes = Math.ceil(dia / 7);
    
    /* console.log(`Estamos en la semana ${semanaDelMes} del mes.`); */

    // Respuesta del servidor
    res.json({
      msg: `Estamos en la semana ${semanaDelMes} del mes.`
    });
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

/* export const getPartesSemanales = async (req, res) => {
  try {
    const partes = await parteModelo
      .find({ estado: true })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);

    let listaOrd = partes.slice().sort((a, b) => a.fecha - b.fecha);
    let arrayFechas = [];
    for (let i = 0; i < listaOrd.length; i++) {
      let nw = new Date(listaOrd[i].fecha);
      let formato = nw.toLocaleDateString("es-ES");
      let obj = {
        p: i,
        fecha: nw
      }
      arrayFechas.push(obj);
    }

    const currentDate = new Date(arrayFechas[0].fecha);
    console.log(arrayFechas[0].fecha);
    function getWeekNumber(date) {
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const daysSinceFirstDay = Math.floor(
        (date - firstDayOfMonth) / (1000 * 60 * 60 * 24)
      );
      return Math.ceil((daysSinceFirstDay + 1) / 7);
    }

    const weekNumber = getWeekNumber(currentDate);
    console.log("Semana: ", weekNumber);

    // Respuesta del servidor
    res.json({
      arrayFechas,
      semana: weekNumber,
    });
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
}; */

export const getPartesPorFecha = async (req, res) => {
  const { fechapd } = req.params;
  console.log(fechapd);
  try {
    const partes = await parteModelo
      .find({ fecha: fechapd, estado: true })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);
    // Respuesta del servidor
    res.json(partes);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorGrupos = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);

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
    const partes = await parteModelo
      .find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFinal,
        },
        estado: true,
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", [
        "nombre",
        "img",
        "listaInventario",
        "totalEdit",
        "listaParteDia",
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

    const totalPage = partes.length;

    //console.log(datosParte)

    /*  var nuevoArray = _.chain(partes).groupBy("cambioInicial") */

    const nuevoArray = _.groupBy(partes, function (item) {
      /* console.log(item.fecha) */
      let newFecha = item.fecha.toLocaleDateString("en-US");
      /* console.log(newFecha) */
      return newFecha;
    });

    const datap = Object.keys(nuevoArray).map((date) => {
      return {
        parte_fecha: date,
        datos: nuevoArray[date],
      };
    });

    /* console.log(datap[0].parte_fecha)

    let nuevafecha = new Date(datap[0].parte_fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); */

    /* console.log(datap[0].parte_fecha)
    console.log(nuevafecha)
    console.log("===================") */

    /* console.log(partesDatos)  */
    let datosRev = datap.reverse();
    let partesDatos = datosRev.slice(skip, skip + limit);

    // Respuesta del servidor
    //console.log(partesDatos.length)
    res.json({ totalPage, partesDatos });
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorMes = async (req, res) => {
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

  const consulta = await parteModelo.find({
    fecha: {
      $gte: fechaInicio,
      $lt: fechaFinal,
    },
  });

  res.json(consulta);
  /* parteModelo.find({
    $expr: {
      $eq: [{ $month: "$fecha" }, mes]
    }
  }, function(err, users) {
    console.log(users);
  }); */
};

// Controlador que almacena un nuevo parte
// CREAR PARTE
export const postParte = async (req, res) => {
  // Desestructuramos la información recibida del cliente

  const datos = req.body;
  datos.usuario = req.usuario._id;
  try {
    // Se alamacena el nuevo inventario en la base de datos
    const parte = new parteModelo(datos);
    await parte.save();

    res.json({ msg: "El parte se guardó correctamente" });
  } catch (error) {
    console.log("Error al crear el parte: ", error);
  }
};

// Controlador que actualiza un parte
// ACTUALIZAR PARTE
export const putParte = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    //console.log(data.fecha)
    data.personalEditor = req.usuario._id;
    //console.log(id)
    await parteModelo.findByIdAndUpdate(id, data, { new: true });

    res.json({ msg: "El parte se actualizó correctamente" });
  } catch (error) {
    console.log("Error al actualizar el parte: ", error);
  }
};
