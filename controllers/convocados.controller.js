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
    
    for (let i = 0; i < listaConvocados.length; i++) {
      datos = listaConvocados[i];

      var listaFecha;
      var listaC = {};
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
        listaC.datos = listaConvocados.filter((item) => item.fecha.toLocaleDateString("es-ES") === listaFecha);
        //onsole.log(listaC)
        // Finalmente toma el objeto ciudad con todos los profesionales que le corresponden y lo guarda en el array "ciudades"
        convocadosArray.push(listaC);
      }
    }
    // Respuesta del servidor
    //console.log(convocadosArray.length)
   
    // Respuesta del servidor
    res.json({totalPage,convocadosArray});
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
    /* console.log(req.usuario) */
    const idPunto = req.usuario.ubicacion?.puntoFijo
    const permiso = req.usuario.ubicacion?.todosLosPuntos
  /*   console.log(idPunto)
    console.log(permiso) */
    let asistencias 

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
    
    res.json(asistencias?.length)
}