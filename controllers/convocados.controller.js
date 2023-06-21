import convocadoModelo from '../models/convocados.modelo.js';
import mongoose from 'mongoose';

export const getConvocados = async (req, res) => {
    try {
        const convocados = await convocadoModelo.find({estado: true}).populate("punto", ["nombre","barrio"]) // consulta para todos los documentos
    
        const totalPage = convocados.length

    let listaConvocados = convocados.reverse();/* .slice(skip, skip + limit) */
    //console.log(listaConvocados)

    // "data" es la variable que está alojando el JSON
    var datos;
    var convocadosArray = [];
    var archivadosArray = []
    
    for (let i = 0; i < listaConvocados.length; i++) {
      datos = listaConvocados[i];

      var listaFecha;
      var listaC = {};
      var listaArchivados = {}
      /* console.log(datos.fecha.toLocaleDateString("es-ES")) */
      // Revisa si la ciudad que que actualmente estamos leyendo difiere con la última leída
      if (listaFecha !== datos.fecha.toLocaleDateString("es-ES")) {
        // Guarda la nueva ciudad en la variable correspondiente
        listaFecha = datos.fecha.toLocaleDateString("es-ES");
        /* console.log(listaFecha) */
        // Guarda en la propiedad "nombre" del objeto "ciudad" el valor de la propiedad "Ciudad"
        // del profesional que actualmente estamos evaluando
        listaC.fecha_convocados = datos.fecha;

        // Filtra el objeto "data" comparando la propiedad "Ciudad" de cada profesional con la ciudad actual
        listaC.datos = listaConvocados.filter((item) => item.fecha.toLocaleDateString("es-ES") === listaFecha && item.vigente == true);
        listaArchivados = listaConvocados.filter((item) => item.vigente == false);
        //onsole.log(listaC)
        // Finalmente toma el objeto ciudad con todos los profesionales que le corresponden y lo guarda en el array "ciudades"
        
        convocadosArray.push(listaC);
        archivadosArray.push(listaArchivados);
      }
    }
    // Respuesta del servidor
    //console.log(convocadosArray.length)
   
    // Respuesta del servidor
    res.json({totalPage,convocadosArray, archivadosArray});
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
        if(idPunto){
            asistencias = await convocadoModelo.find({
                punto: idPunto,
                vigente: true
            }).populate("punto", ["nombre","barrio"])
        }else if (permiso == true){
            asistencias = await convocadoModelo.find({
                estado: true
            }).populate("punto", ["nombre","barrio"])
        }

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