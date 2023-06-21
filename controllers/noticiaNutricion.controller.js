import noticiaNutricionModelo from '../models/noticiaNutricion.modelo.js';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js'
import cloudinary from 'cloudinary'

// Devuelve todos los noticias publicas de la colección
export const getNoticiasNutricionPublicas = async (req, res) => {


  
  try {
      const noticiasNutricion = await noticiaNutricionModelo.find({publicado: true})
      const todasLasNoticiasNutricion = noticiasNutricion.reverse() 
      // consulta para todos los documentos
     
  // Respuesta del servidor
  res.json(todasLasNoticiasNutricion);
  } catch (error) {
      console.log("Error al traer las nutri noticias: ", error)
  }
}

// Devuelve todos los noticias activas de la colección
export const getNoticiasNutricion = async (req, res) => {

  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  //console.log(skip)
  let skipEdit = 0

  if(skip == 0){
    skipEdit = 1
  }else{
    skipEdit = skip
  }
  
  try {
      const noticiasNutricion = await noticiaNutricionModelo.find()
      const todasLasNoticiasNutricion = noticiasNutricion.reverse() // consulta para todos los documentos
      const primeraNoticiaNutricion = todasLasNoticiasNutricion[0]

      const noticiasNutricionFiltradas = todasLasNoticiasNutricion.slice(skipEdit, skipEdit + limit);

      const otrasNoticiasNutricion = noticiasNutricionFiltradas

      const totalNoticiasNutricion = noticiasNutricion.length
      const pages = [];
      for (let i = 0; i < noticiasNutricion.length; i += limit) {
        const page = i
        pages.push(page);
      }
  
      const totalPages= pages
  // Respuesta del servidor
  res.json({totalPages,totalNoticiasNutricion,primeraNoticiaNutricion,otrasNoticiasNutricion});
  } catch (error) {
      console.log("Error al traer las nutri noticias: ", error)
  }
}

// Devuelve una  noticia  de la colección
export const getNoticiasNutricionUnica = async (req, res) => {
  const {id } = req.params;
  try {
      const noticiaNutricion = await noticiaNutricionModelo.findById(id) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(noticiaNutricion);
  } catch (error) {
      console.log("Error al traer la nutri noticia: ", error)
  }
}


// Controlador que almacena una nueva noticia
export const postNoticiasNutricion = async (req, res) => {
  // Desestructuramos la información recibida del cliente

  let imgURl;

  if(req?.file?.path){
    imgURl = await cloudinary.uploader.upload(req?.file?.path)
  }else {
    imgURl = ""
  }

const usuarios = await usuarioModelo.find({}, 'uid')
 try {

  const datos = {
    ...req.body,
    img: imgURl?.url ? imgURl?.url : imgURl,
    
  }
 // Se alamacena la nueva noticia en la base de datos
 const noticiaNutricion = new noticiaNutricionModelo(datos);
 await noticiaNutricion.save() 
  //console.log(usuarios)
 const noti = {}

 noti.descripcion = `Nueva Noticia Subida (${noticiaNutricion.titulo})`
 noti.tipo = "Noticia"
 noti.img = "ti-clipboard"


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

 
 res.json({msg: 'La Nutri noticia se guardo correctamente', notificacion: noti.descripcion});
 } catch (error) {
     console.log("Error al crear una  nutri noticia: ", error)
 }
}

// Controlador que almacena una nueva noticia
export const updateNoticiasNutricion = async (req, res) => {

    const { id } = req.params;

  // Desestructuramos la información recibida del cliente
  let imgURl;

  if(req?.file?.path){
    imgURl = await cloudinary.uploader.upload(req?.file?.path)
  }else {
    imgURl = req?.body?.image
  }



 try {

  const datos = {
    ...req.body,
    img: imgURl?.url ? imgURl?.url : imgURl,
 
  }

     // Se alamacena la nueva noticia en la base de datos
 const noticiaNutricion = await noticiaNutricionModelo.findByIdAndUpdate(
      id,
      datos,
      { new: true }
    );

    res.json({
        msg: "Nutri noticia actualizada correctamente",
        noticiaNutricion,
      });
 } catch (error) {
     console.log("Error al actualizar la nutri noticia: ", error)
 }
}

// Cambiar el estado publicado de una noticia (Eliminación lógica)
export const desactivarNoticiasNutricion = async (req, res) => {
    const { id } = req.params;

    try {
      const noticiaNutricion = await noticiaNutricionModelo.findByIdAndUpdate(
          id,
          { publicado: false },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Nutri noticia desactivada correctamente (lógica)",
          noticiaNutricion,
        });
    } catch (error) {
      console.log("Error al desactivar de forma logica la nutri noticia: ", error)
    }
  };

// Cambiar el estado publicado de una noticia (lógica)
export const publicarNoticiasNutricion = async (req, res) => {
    const { id } = req.params;
    try {
      const noticiaNutricion = await noticiaNutricionModelo.findByIdAndUpdate(
          id,
          { publicado: true },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Nutri noticia Publicada correctamente (lógica)",
          noticiaNutricion,
        });
    } catch (error) {
      console.log("Error al publicar de forma logica la nutri noticia: ", error)
    }
  };

// Controlador para eliminar una noticia de la BD físicamente
export const eliminarNoticiasNutricion = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ejecución normal del programa
      await noticiaNutricionModelo.findByIdAndDelete(id);
  
      res.json({
        msg: "Nutri noticia Eliminada (físicamente) correctamente",
      });
    } catch (error) {
      // Si ocurre un error
      console.log("Error al eliminar la nutri noticia: ", error);
    }
  };
