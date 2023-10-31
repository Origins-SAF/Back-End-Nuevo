import noticiaModelo from '../models/noticia.modelo.js';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js'
import cloudinary from 'cloudinary'

// Devuelve todos los noticias publicas de la colección
export const getNoticiasTodas = async (req, res) => {


  
  try {
      const noticias = await noticiaModelo.find({publicado: true})
      const todasLasNoticias = noticias.reverse() 
      // consulta para todos los documentos
     
  // Respuesta del servidor
  res.json(todasLasNoticias);
  } catch (error) {
      console.log("Error al traer las noticias: ", error)
  }
}

export const getNoticiasPublicasGrupos = async (req, res) => {

  /* const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);

  //console.log(skip)
  let skipEdit = 0

  if(skip == 0){
    skipEdit = 3
  }else{
    skipEdit = skip
  } */
  
  try {
      const noticias = await noticiaModelo.find()
      const todasLasNoticias = noticias.reverse() // consulta para todos los documentos
      const primerasNoticias = todasLasNoticias.slice(0, 3);

      const noticiasFiltradas = todasLasNoticias.slice(3);

     /*  const otrasNoticias = noticiasFiltradas */

      const totalNoticias = noticias.length
     /*  const pages = [];
      for (let i = 0; i < noticias.length; i += limit) {
        const page = i
        pages.push(page);
      } */
  
      /* const totalPages= pages */
  // Respuesta del servidor
  res.json({ totalNoticias,primerasNoticias, noticiasFiltradas});
  } catch (error) {
      console.log("Error al traer las noticias: ", error)
  }
}

// Devuelve todos los noticias activas de la colección
export const getNoticias = async (req, res) => {

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
      const noticias = await noticiaModelo.find()
      const todasLasNoticias = noticias.reverse() // consulta para todos los documentos
      const primeraNoticia = todasLasNoticias[0]

      const noticiasFiltradas = todasLasNoticias.slice(skipEdit, skipEdit + limit);

      const otrasNoticias = noticiasFiltradas

      const totalNoticias = noticias.length
      const pages = [];
      for (let i = 0; i < noticias.length; i += limit) {
        const page = i
        pages.push(page);
      }
  
      const totalPages= pages
  // Respuesta del servidor
  res.json({totalPages,totalNoticias,primeraNoticia,otrasNoticias});
  } catch (error) {
      console.log("Error al traer las noticias: ", error)
  }
}

// Devuelve una  noticia  de la colección
export const getNoticiarUnica = async (req, res) => {
  const {id } = req.params;
  try {
      const noticia = await noticiaModelo.findById(id) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(noticia);
  } catch (error) {
      console.log("Error al traer la noticia: ", error)
  }
}


// Controlador que almacena una nueva noticia
export const postNoticia = async (req, res) => {
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
 const noticia = new noticiaModelo(datos);
 await noticia.save() 
  //console.log(usuarios)
 const noti = {}

 noti.descripcion = `Nueva Noticia Subida (${noticia.titulo})`
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

 
 res.json({msg: 'La Noticia se guardo correctamente', notificacion: noti.descripcion});
 } catch (error) {
     console.log("Error al crear una noticia: ", error)
 }
}

// Controlador que almacena una nueva noticia
export const updateNoticia = async (req, res) => {

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
 const noticia = await noticiaModelo.findByIdAndUpdate(
      id,
      datos,
      { new: true }
    );

    res.json({
        msg: "Noticia actualizada correctamente",
        noticia,
      });
 } catch (error) {
     console.log("Error al actualizar la noticia: ", error)
 }
}

// Cambiar el estado publicado de una noticia (Eliminación lógica)
export const desactivarNoticia = async (req, res) => {
    const { id } = req.params;

    try {
      const noticia = await noticiaModelo.findByIdAndUpdate(
          id,
          { publicado: false },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Noticia desactivada correctamente (lógica)",
          noticia,
        });
    } catch (error) {
      console.log("Error al desactivar de forma logica la noticia: ", error)
    }
  };

// Cambiar el estado publicado de una noticia (lógica)
export const publicarNoticia = async (req, res) => {
    const { id } = req.params;
    try {
      const noticia = await noticiaModelo.findByIdAndUpdate(
          id,
          { publicado: true },
          { new: true }
        );
      
        // Respuesta del servidor
        res.json({
          msg: "Noticia Publicada correctamente (lógica)",
          noticia,
        });
    } catch (error) {
      console.log("Error al publicar de forma logica la noticia: ", error)
    }
  };

// Controlador para eliminar una noticia de la BD físicamente
export const eliminarNoticia = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ejecución normal del programa
      await noticiaModelo.findByIdAndDelete(id);
  
      res.json({
        msg: "Noticia Eliminada (físicamente) correctamente",
      });
    } catch (error) {
      // Si ocurre un error
      console.log("Error al eliminar la noticia: ", error);
    }
  };
