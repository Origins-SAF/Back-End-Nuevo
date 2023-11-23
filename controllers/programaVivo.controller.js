import programaModelo from '../models/programaVivo.modelo.js';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js';


// Devuelve todos los programas activos de la colección
export const getProgramasPublicados = async (req, res) => {

  try {
      const programas = await programaModelo.find({publicado: true, estado: false}) // consulta para todos los documentos
  // Respuesta del servidor
  res.json(programas);
  } catch (error) {
      console.log("Error al traer los programas: ", error)
  }
}

export const getStreamingsVivo = async (req, res) => {
  try {
    const programasVivo = await programaModelo.find({publicado: true, estado: false, vivo: true}) // consulta para todos los documentos
  // Respuesta del servidor
  res.json(programasVivo);
  } catch (error) {
      console.log("Error al traer el streaming: ", error)
  }
}

// Devuelve todos los programas activos de la colección
export const getProgramas = async (req, res) => {

  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);

  try {
      const programas = await programaModelo.find() // consulta para todos los documentos
       const programasFiltrados = programas.reverse().slice(skip, skip + limit);
  // Respuesta del servidor
  res.json(programasFiltrados);
  } catch (error) {
      console.log("Error al traer los programas: ", error)
  }
}

// Devuelve un programa de la colección
export const getProgramaUnico = async (req, res) => {
  const {id } = req.params;
  try {
      const programa = await programaModelo.findById(id) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(programa);
  } catch (error) {
      console.log("Error al traer el programa: ", error)
  }
}


// Controlador que almacena un nuevo programa
export const postPrograma = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;
 const usuarios = await usuarioModelo.find({}, 'uid')
 try {

 // Se alamacena el nuevo programa en la base de datos
 const programa = new programaModelo(datos);
 await programa.save() 

 const noti = {}

 noti.descripcion = `Nuevo Programa Publicado (${programa.titulo})`
 noti.tipo = "Programa"
 noti.img = "ti-headphone"

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

 
 res.json({msg: 'El programa se guardo correctamente', notificacion: noti.descripcion});
 } catch (error) {
     console.log("Error al crear un programa: ", error)
 }
}

// Controlador para actualizar los datos de un programa
export const updatePrograma = async (req, res) => {

    const { id } = req.params;

  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
    
 const programa = await programaModelo.findByIdAndUpdate(
      id,
      datos,
      { new: true }
    );

    res.json({
        msg: "Programa actualizado correctamente",
        programa,
      });
 } catch (error) {
     console.log("Error al actualizar la noticia: ", error)
 }
}

// Cambiar el estado publicado de un programa (Eliminación lógica)
export const desactivarPrograma = async (req, res) => {
    const { id } = req.params;

    try {
      const programa = await programaModelo.findByIdAndUpdate(
          id,
          { publicado: false },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Programa desactivado correctamente (lógica)",
          programa,
        });
    } catch (error) {
      console.log("Error al desactivar de forma logica el programa: ", error)
    }
  };

// Cambiar el estado publicado de un programa (lógica)
export const publicarPrograma = async (req, res) => {
    const { id } = req.params;
    try {
      const programa = await programaModelo.findByIdAndUpdate(
          id,
          { publicado: true },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Programa Publicado correctamente (lógica)",
          programa,
        });
    } catch (error) {
      console.log("Error al publicar de forma logica el programa: ", error)
    }
  };

// Controlador para eliminar un programa de la BD físicamente
export const eliminarPrograma = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ejecución normal del programa
      await programaModelo.findByIdAndDelete(id);
  
      res.json({
        msg: "Programa Eliminado (físicamente) correctamente",
      });
    } catch (error) {
      // Si ocurre un error
      console.log("Error al eliminar el programa : ", error);
    }
  };
