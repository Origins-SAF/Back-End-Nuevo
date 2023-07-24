import convocadoModelo from '../models/convocados.modelo.js';
import mongoose from 'mongoose';

export const getConvocados = async (req, res) => {
  const limitArc = parseInt(req.query.limitArc);
  const skipArc = parseInt(req.query.skipArc);

  const limitConv = parseInt(req.query.limitConv);
  const skipConv = parseInt(req.query.skipConv);

    try {
        const convocados = await convocadoModelo.find({estado: true}).populate("punto", ["nombre","barrio"]) // consulta para todos los documentos
    
        /* const totalPage = convocados.length */

    let listaConvocados = convocados.reverse();/* .slice(skip, skip + limit) */
    //console.log(listaConvocados)

    // "data" es la variable que está alojando el JSON
    var datos;
    var convocadosArrayList = [];
    var archivadosArrayList = []
    
    for (let i = 0; i < listaConvocados.length; i++) {
      datos = listaConvocados[i];
    /*   
      console.log("___________")
      console.log(listaConvocados[i])
      console.log("___________") */

      var listaFecha;
      var listaC = {};
      var listaArchivados = {}
      /* console.log(datos.vigente) */
      /* console.log(datos.fecha.toLocaleDateString("es-ES")) */
      // Revisa si la ciudad que que actualmente estamos leyendo difiere con la última leída
      if (listaFecha !== datos.fecha.toLocaleDateString("es-ES") && datos.vigente == true) {

        /* console.log(datos.fecha) */
        // Guarda la nueva ciudad en la variable correspondiente
        listaFecha = datos.fecha.toLocaleDateString("es-ES");
        /* console.log(listaFecha) */
        // Guarda en la propiedad "nombre" del objeto "ciudad" el valor de la propiedad "Ciudad"
        // del profesional que actualmente estamos evaluando
        listaC.fecha_convocados = datos.fecha;

        // Filtra el objeto "data" comparando la propiedad "Ciudad" de cada profesional con la ciudad actual
        listaC.datos = listaConvocados.filter((item) => item.fecha.toLocaleDateString("es-ES") === listaFecha && item.vigente == true  );
       
        /* console.log(listaC) */
        // Finalmente toma el objeto ciudad con todos los profesionales que le corresponden y lo guarda en el array "ciudades"

        convocadosArrayList.push(listaC);
        
      } else if(listaFecha !== datos.fecha.toLocaleDateString("es-ES") && datos.vigente == false){

        listaArchivados = listaConvocados.filter((item) => item.vigente == false);
        archivadosArrayList.push(listaArchivados);
      }
    }
    // Respuesta del servidor
    /* console.log(convocadosArrayList.length) */

   

    const pagesArc = [];
    const pagesConv = [];

    //Archivados
    if(limitArc != 1){
      for (let i = 0; i < archivadosArrayList.length; i += limitArc) {
        let pageA = i
        pagesArc.push(pageA);
      }
    }

    /* console.log(convocadosArrayList) */

    //Convocados
    if(limitConv != 1){
      /* console.log('limitConv ' + limitConv) */
     /*  console.log(convocadosArrayList.length) */

      for (let x = 0; x < convocadosArrayList.length; x += limitConv) {
        let pageC = x
        /* console.log(pageC) */
        pagesConv.push(pageC);
      }
    }

    const totalPageArchivados = pagesArc

    const totalPageConvocados = pagesConv
   /*  console.log(archivadosArrayList.length) */
    let archivadosArray = archivadosArrayList[0].slice(skipArc, skipArc + limitArc);
    let convocadosArray = convocadosArrayList.splice(skipConv, skipConv + limitConv);
   
    console.log(archivadosArray.length)
    // Respuesta del servidor
    res.json({totalPageArchivados, totalPageConvocados, convocadosArray, archivadosArray});
    } catch (error) {
        console.log("Error al traer los convocados: ", error)
    }
}

// Controlador que almacena una nueva lista de convocados
export const postConvocados = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
   
   try {
       // Se alamacena la nueva lista en la base de datos
   const listConvocados = new convocadoModelo(datos);
   await listConvocados.save() 
  
   
  
   
   res.json({msg: 'La lista de convocados se guardo correctamente'});
   } catch (error) {
       console.log("Error al crear la lista de convocados: ", error)
   }
  }

export const getAsistenciasPorPunto = async (req, res) => {
    const idPunto = req.usuario.ubicacion?.puntoFijo
    const permiso = req.usuario.ubicacion?.todosLosPuntos

    let asistencias 
    try {
      if (permiso == true){
        asistencias = await convocadoModelo.find({
          estado: true
      }).populate("punto", ["nombre","barrio"])
      }else if(idPunto){
        asistencias = await convocadoModelo.find({
          estado: true,
          punto: idPunto,
          vigente: true
      }).populate("punto", ["nombre","barrio"])
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

        res.json(asistencias)
    } catch (error) {
        res.status(401).json({
            msg: "Error al traer la lista de asistencias",
          });
          console.log("Error al traer la lista: ", error)
    }
    
   
}

export const guardarAsistenciasPorPunto = async (req, res) => {
    const datos = req.body
    const {id } = req.params;

    try {
        const asistencia = await convocadoModelo.findByIdAndUpdate(
            id,
            { lista: datos },
            { new: true }
          );
        res.json({msg:"Se Subio La Asistencia Correctamente", asistencia})
    } catch (error) {
        console.log("Error", error)
    }
}

export const actualizarPlanilla = async (req, res) => {
  const { id } = req.params;

  try {

      const data = req.body
  /* console.log(data) */
    await convocadoModelo.findByIdAndUpdate(id, data, { new: true });

    res.json({msg:"Se Actualizo la planilla"});
  } catch (err) {
    console.log("Error al actualizar la planilla: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
}

export const archivarPlanilla = async (req, res) => {
    const { id } = req.params;
    const valor = req.body.vigente
    
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